import * as _ from 'lodash';
import { DataService } from '../services/data.service';
import { EnrollmentCrossFilter } from './enrollment-cross-filter';
import { BehaviorSubject } from 'rxjs';
import { UnitsStorageService } from '../services/units-storage.service';

export class Scope {
  department?: string;
  portfolio?: string;
  category?: string;
  manufacturer?: string;
  brand?: string;

  state?: string;
  division?: string;
  // store_type?: string;

  upc_id?: string;
  customerSegment?: string;
  customerSegmentGroup?: string;
  store_id?: string;
  subdivision?: string;
}




/**
 * Class that represent a unit associated to a specific scope (set of dimensions) with metrics associated to a
 * date range
 *
 * @export
 * @class UnitOfAnalysis
 */
export class UnitOfAnalysis {
  scope: {};
  dataService: DataService;
  data: {};
  enrollmentCF: EnrollmentCrossFilter;

  dataReadySubject = new BehaviorSubject(false);
  dataReady = this.dataReadySubject.asObservable();
  matricula: any;
  unitsStorageService: UnitsStorageService;

  constructor(options: {
    scope?: {}, // scope of this unit e.g. {state:'CA', department: 'SNACKS'}
    dataService: DataService, // injection of DataService
    unitsStorageService: UnitsStorageService,
    records?: any[]
  }
  ) {
    this.scope = options.scope;
    this.dataService = options.dataService;
    this.unitsStorageService = options.unitsStorageService;
    if (!options.records) {
      this.loadRecords();
    } else {
      this.setRecords(options.records)
    }

  }

  loadRecords() {
    this.dataService.getMatriculaRecords(this.scope)
    .then(data => {
      this.data = data;
      this.enrollmentCF = new EnrollmentCrossFilter(<any[]>data);
      this.dataReadySubject.next(true);
    })

  }

  setRecords(records) {
    this.data = records;
    this.enrollmentCF = new EnrollmentCrossFilter(<any[]>records);
    this.dataReadySubject.next(true);
  }

  getMatricula() {
    const subject = new BehaviorSubject(null);

    this.dataReady.subscribe(ready => {
      if (ready) {
        if (!this.matricula) {
          this.matricula = _.reduce(this.data, (memo,d) => memo + +d.count, 0);
        }

        subject.next(this.matricula);
      }
    }) 

    return subject.asObservable();  
  }

  getRecords() {
    const subject = new BehaviorSubject(null);

    this.dataReady.subscribe(ready => {
      if (ready) {
        subject.next(this.data);
      }
    }) 

    return subject.asObservable();
  }

  getPrivateIndex() {
    const subject = new BehaviorSubject(null);

    this.getMatriculaByDependencia()
    .subscribe(data => {
      if (data) {
        let total = _.reduce(data, (memo,d) => memo + d.matricula, 0);
        let pp = _.reduce(data.filter(d => d.dependencia == "PP"), (memo,d) => memo + d.matricula, 0);
        subject.next(pp/total || 0);
      }
    })

    return subject.asObservable();
  }

  getHigherPercentileIndex(percentile?) {
    const subject = new BehaviorSubject(null);

    const threshold = percentile || 30;

    this.getMatriculaByPercentil()
    .subscribe(data => {
      let total = _.reduce(data, (memo,d) => memo + d.matricula, 0);
      let top = _.reduce(data.filter(d => +d.percentil <= threshold), (memo,d) => memo + d.matricula, 0);
      subject.next(top/total);
    })

    return subject.asObservable();
  }

  getMatriculaByDependencia() {
    const subject = new BehaviorSubject(null);

    this.getMatriculaBy('dependencia')
    .subscribe(data => {
      if (data) {

        let recordsMun  = _.find(data, d => d.dependencia == 1);
        let recordsCorpMun  = _.find(data, d => d.dependencia == 2);
        let recordsPS  = _.find(data, d => d.dependencia == 3);
        let recordsPP  = _.find(data, d => d.dependencia == 4);
        let recordsAD  = _.find(data, d => d.dependencia == 5); 


        let matriculaMUN  = (recordsMun && recordsMun.matricula || 0) +  (recordsCorpMun && recordsCorpMun.matricula || 0)
        let matriculaPS  = recordsPS && recordsPS.matricula || 0 
        let matriculaPP  = recordsPP && recordsPP.matricula || 0
        let matriculaAD  = recordsAD && recordsAD.matricula || 0 

        let result = [
          { dependencia: "MUN", matricula: matriculaMUN },
          { dependencia: "PS", matricula: matriculaPS },
          { dependencia: "PP", matricula: matriculaPP },
          { dependencia: "AD", matricula: matriculaAD }
        ];

        subject.next(result);
      }
      
    })

    return subject.asObservable();
  }

  getMatriculaByPercentil() {
    const subject = new BehaviorSubject(null);

    this.getMatriculaBy('percentil')
    .subscribe(data => {
      let result = _.sortBy(data, d=> +d['percentil']);
      subject.next(result);
    })

    return subject.asObservable();
  }

  getMatriculaBy(dim) {
    const subject = new BehaviorSubject(null);

    this.dataReady.subscribe(ready => {
      if (ready) {
        subject.next(this.enrollmentCF.getDataBy(dim));
      }
    }) 

    return subject.asObservable();
  }

  getCompetitionGraph() {
    const subject = new BehaviorSubject(null);

    this.dataReady.subscribe(ready => {
      if (ready) {
        const studentsData = this.data;

        const areaGenerica = studentsData[0].area_carrera_generica;
        const institucion = studentsData[0].nomb_inst;
        const tipoInstitucion = studentsData[0].tipo_inst_1;
        const mySchoolsGroup = _.groupBy(studentsData, d => d.rbd)
        const miMatricula = [];
        const mySchools = _.map(mySchoolsGroup, (items, key) => ({
          rbd: key,
          nom_rbd: items[0].nom_rbd,
          nom_com_rbd: items[0].nom_com_rbd,
          matricula: items.reduce((memo,d) => +d.count + memo, 0)
        }))
        
        mySchools.forEach(d => miMatricula[d.rbd] = d.matricula);
    
        this.dataService.getRecordsForCarreraGenerica(areaGenerica, tipoInstitucion)
        .subscribe(data => {
          const dataCarreraGenerica = data;
          const potentialCompetitorsRecords = dataCarreraGenerica.filter(d => mySchoolsGroup[d.rbd] && d.nomb_inst !== institucion)
          
          const enrollmentCompetitors = potentialCompetitorsRecords.reduce((memo,d) => +d.count + memo, 0)
          
          const targetSchoolsGroup = _.groupBy(potentialCompetitorsRecords, d => d.rbd) 
          const targetSchools = _.map(targetSchoolsGroup, (items, key) => ({
            rbd: key,
            nom_rbd: items[0].nom_rbd,
            nom_com_rbd: items[0].nom_com_rbd,
            matricula: items.reduce((memo,d) => +d.count + memo, 0),
            miMatricula: miMatricula[key]
          }))
          
          const groupedCompetitors = _.groupBy(potentialCompetitorsRecords, d => d.nomb_inst);
          const competitors = _.sortBy(_.map(groupedCompetitors, (d,inst) => ({
            nomb_inst : inst,
            matricula : d.reduce((memo,e) => +e.count + memo, 0),
            items: d
          })), f => -f.matricula);
          
          const schoolsDict = {};
          targetSchools.forEach(d => schoolsDict[d.rbd] = d);
          
          const competitorsDict = {};
          competitors.forEach(d => competitorsDict[d.nomb_inst] = d);
          
          const links = [];
          
          competitors.forEach(itemInstitucion => {
            const groupedSchools = _.groupBy(itemInstitucion.items, d => d.rbd);
            
            _.each(groupedSchools, (items, key) => {
              links.push({
                competitorName: itemInstitucion.nomb_inst,
                target: itemInstitucion,
                schoolName: schoolsDict[key].nom_rbd,
                source: schoolsDict[key],
                studentsCompetitor: items,
                matriculaCompetitor : items.reduce((memo,e) => +e.count + memo, 0),
                studentsTarget: targetSchoolsGroup[key],
                matriculaTarget : targetSchoolsGroup[key].reduce((memo,e) => +e.count + memo, 0)
        
              })
            })
          })
          
          subject.next({
            competitors: competitors,
            targetSchools: targetSchools,
            links: links
          })
        })
      }

    })

    
    return subject.asObservable();
  }

  getTipoInstitucion() {
    return this.scope && this.scope['tipo_inst_1'] || "";
  }  
  
  getInstitucion() {
    return this.scope && this.scope['nomb_inst'] || "";
  }

  getCarrera() {
    return this.scope && this.scope['nomb_carrera'] || "";
  }

  getType() {
    let type = "global";

    type = (this.getTipoInstitucion()) && "tipoInstitucion" || type
    type = (this.getInstitucion()) && "institucion" || type
    type = (this.getCarrera()) && "carrera" || type

    return type
  }

  getName() {
    let name = this.getCarrera() || this.getInstitucion() || this.getTipoInstitucion() || null;
    return name
  }

  getChildren(dimension) {
    const subject = new BehaviorSubject(null);

    this.getRecords()
    .subscribe(data => {
      const groups = _.groupBy(data, d => d[dimension]);
      const values = _.keys(groups);

      const children = values.map(value => {
        const newScope = this.scope && _.clone(this.scope) || {};
        newScope[dimension] = value;
        let unit;
  
        if (this.unitsStorageService.getUnit(newScope)) {
          unit = this.unitsStorageService.getUnit(newScope);
        } else {
          unit = new UnitOfAnalysis({
            "scope": newScope,
            "dataService": this.dataService,
            "unitsStorageService": this.unitsStorageService,
            "records" : groups[value]
          });
          this.unitsStorageService.setUnit(unit);
        }

        return unit;
      })

      subject.next(children);
    })

    return subject;
  }


}
