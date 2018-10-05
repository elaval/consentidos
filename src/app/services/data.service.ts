import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, zip } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as d3 from "d3";
import * as _ from "lodash";
import * as crossfilter from "crossfilter";
import { UnitOfAnalysis } from '../models/unit-of-analysis';
import { DIMENSION_ATTRIBUTES } from '../config';

const logosURL = "https://raw.githubusercontent.com/elaval/datasets/master/logos.txt?v=6"
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataReadySubject = new BehaviorSubject(false);
  dataReady = this.dataReadySubject.asObservable();

  private carrerasSubject = new BehaviorSubject(null);
  carreras = this.carrerasSubject.asObservable();

  private institucionesSubject = new BehaviorSubject(null);
  instituciones = this.institucionesSubject.asObservable();

  private tipoInstitucionSubject = new BehaviorSubject(null);
  tipoInstitucion = this.tipoInstitucionSubject.asObservable();
  
  private carreraSubject = new BehaviorSubject(null);
  carrera = this.carreraSubject.asObservable();

  private cfMatriculaReadySubject = new BehaviorSubject(false);
  cfMatriculaReady = this.cfMatriculaReadySubject.asObservable();

  private logosSubject = new BehaviorSubject(null);
  logos = this.logosSubject.asObservable();

  data_carerras: any[];
  cfCarreras: CrossFilter.CrossFilter<{}>;
  cfCarrerasDimensions = {};
  cfCarrerasGroups = {};

  cfCarrerasKeys = [
    'nomb_inst', 
    'tipo_inst_1',
    'nomb_carrera'
  ];

  cfMatriculaKeys = [
    'nomb_inst', 
    'tipo_inst_1',
    'nomb_carrera'
  ];

  data_matricula: d3.DSVParsedArray<d3.DSVRowString>;
  cfMatricula: CrossFilter.CrossFilter<{}>;
  cfMatriculaDimensions: any= {};
  cfMatriculaGroups: any = {};
  data_logos: d3.DSVParsedArray<d3.DSVRowString>;

  constructor(
    private http: HttpClient
  ) { 
    this.loadCarreras();
    this.loadMatricula();
    this.loadLogos();
  }

  loadCarreras() {
    this.http.get("https://edudata.s3.amazonaws.com/chile/matricula/carreras2017.txt", {responseType: 'text'})
    .subscribe((data:any) => {
      this.data_carerras = d3.tsvParse(data);
      this.setupCrossfilterCarreras(this.data_carerras);
      this.filterInstituciones();
    })
  }

  loadMatricula() {
    this.http.get("./assets/data/ingreso2017_06.txt", {responseType: 'text'})
    .subscribe((data:any) => {
      this.data_matricula = d3.tsvParse(data);
      this.setupCrossfilterMatricula(this.data_matricula);
      this.dataReadySubject.next(data && data.length > 0);

    })
  }

  loadLogos() {
    this.http.get(logosURL, {responseType: 'text'})
    .subscribe((data:any) => {
      const _logos = d3.tsvParse(data);

      const logosDict = {};
      _.each(_logos, d => logosDict[d.universidad] = d.logo);

      this.logosSubject.next(logosDict);
    })
  }

  setupCrossfilterMatricula(data) {
    this.cfMatricula = crossfilter(data);
    this.cfMatriculaKeys.forEach(key => {
      let d = this.cfMatricula.dimension((d:any) => d.nomb_inst);
      this.cfMatriculaDimensions[key] = this.cfMatricula.dimension((d:any) => d[key]);
      this.cfMatriculaGroups[key] = this.cfMatriculaDimensions[key].group();
    })
    this.cfMatriculaReadySubject.next(true);

  }

  getData(scope) {
    let subject = new Subject();
    this.cfMatriculaReady.subscribe(ready => {
      if (ready) {
        _.each(scope, (value,dimension) => {
          this.cfMatriculaDimensions[dimension].filter(value);
        })
        console.log(this.cfMatricula.groupAll());
        subject.next(this.cfMatricula.groupAll());
      }
    })

    return subject.asObservable();
  }

  resetFiltersMatricula() {
    this.cfMatriculaKeys.forEach(key => {
      this.cfMatriculaDimensions[key].filterAll();
    })
  }

  setupCrossfilterCarreras(data) {
    this.cfCarreras = crossfilter(data);
    
    this.cfCarrerasKeys.forEach(key => {
      let d = this.cfCarreras.dimension((d:any) => d.nomb_inst);
      this.cfCarrerasDimensions[key] = this.cfCarreras.dimension((d:any) => d[key]);
      this.cfCarrerasGroups[key] = this.cfCarrerasDimensions[key].group();
    })
    

  }

  filterInstituciones() {
    this.institucionesSubject.next(this.cfCarrerasGroups['nomb_inst'].all().map(d => d.key));
    this.tipoInstitucionSubject.next(this.cfCarrerasGroups['tipo_inst_1'].all().map(d => d.key));
    this.carrerasSubject.next(this.cfCarrerasGroups['nomb_carrera'].all().map(d => d.key));
  }

  selectUnit(unit:UnitOfAnalysis) {
    if (unit.scope[DIMENSION_ATTRIBUTES['carrera']]) {
      this.selectCarrera(unit.scope[DIMENSION_ATTRIBUTES['carrera']])
    } else if (unit.scope[DIMENSION_ATTRIBUTES['institucion']]) {
      this.selectInstitucion(unit.scope[DIMENSION_ATTRIBUTES['institucion']])
    } else if (unit.scope[DIMENSION_ATTRIBUTES['tipoInstitucion']]) {
      this.selectTipoInstitucion(unit.scope[DIMENSION_ATTRIBUTES['tipoInstitucion']])
    } 
  }

  selectTipoInstitucion(item) {
    this.cfCarrerasDimensions['tipo_inst_1'].filterExact(item);
    this.cfCarrerasDimensions['nomb_inst'].filterAll();
    this.cfCarrerasDimensions['nomb_carrera'].filterAll();

    let instituciones = this.cfCarrerasGroups['nomb_inst'].all().filter(d => d.value > 0).map(d => d.key)
    this.institucionesSubject.next(instituciones);
  }

  selectInstitucion(item) {
    this.cfCarrerasDimensions['nomb_inst'].filterExact(item);
    this.cfCarrerasDimensions['nomb_carrera'].filterAll();

    let carreras = this.cfCarrerasGroups['nomb_carrera'].all().filter(d => d.value > 0).map(d => d.key)
    this.carreraSubject.next(carreras);
  }

  selectCarrera(item) {
    this.cfCarrerasDimensions['nomb_carrera'].filterExact(item);
  }

  getMatriculaRecords(scope) {
    return new Promise((resolve, reject) => {
      this.cfMatriculaReady.subscribe(ready => {
        if (ready) {
          const result = this.data_matricula.filter(d => {
            let found = true;
            _.each(scope, (value,key) => {
              found = found && d[key]==value
            })
            return found;
          })
  
          resolve(result);
        }
      })
    })

  }

  findEquivalents(institucion, carrera) {
    return new Promise((resolve, reject) => {
      this.cfMatriculaReady.subscribe(ready => {
        if (ready) {
          const targetRecord = _.find(this.data_matricula, d => d.nomb_inst == institucion && d.nomb_carrera == carrera);
          const carreraGenerica = targetRecord.area_carrera_generica;
          
          const dataOthers = this.data_matricula.filter(d => d.area_carrera_generica == carreraGenerica);
                
          const groupByInstitucion = _.groupBy(dataOthers, d=> d.nomb_inst)
          
          const output = _.map(groupByInstitucion, (items, key) => ({
            
              institucion: key,
              metrics : this.getMetrics(items),
              records : items
            
          }))
      
  
          resolve(output);
        }
      })
    })

  }

  getMetrics(data) {
    const matricula = data.reduce((memo,d) => +d.count + memo, 0);
    const percentileAccumulated = this.topPercentile(data);
  
    const matriculaPP = data.filter(d => d.dependencia == "4").reduce((memo,d) => +d.count + memo, 0);
  
    return {
      matricula: matricula,
      matriculaTop50 : percentileAccumulated["50"],
      matriculaPP : matriculaPP,
      rateTop50 : percentileAccumulated["50"]/matricula,
      ratePP : matriculaPP/matricula
    }
  }

  topPercentile(data) {
    let tmpData = this.distributeByPercentiles(data);
    
    let output = {
    }
    
    output["10"] = tmpData["10"] && tmpData["10"].matricula || 0;
    output["20"] = (tmpData["20"] && tmpData["20"].matricula || 0) + output["10"];
    output["30"] = (tmpData["30"] && tmpData["30"].matricula || 0) + output["20"];
    output["40"] = (tmpData["40"] && tmpData["40"].matricula || 0) + output["30"];
    output["50"] = (tmpData["50"] && tmpData["50"].matricula || 0) + output["40"];
    
    return output
  }

  distributeByPercentiles(data) {
    const output = {}
    const groupedData = _.groupBy(data, d => d.percentil);
    _.each(groupedData, (d,key) => {
      const matricula = d.reduce((memo,d) => +d.count + memo, 0);
      output[key] = {
        "matricula": matricula,
        "items":d
      }
    })
    return output
  }

  getRecordsForCarreraGenerica(carrera, tipo_institucion) {
    const subject = new BehaviorSubject(null);

    this.dataReady.subscribe(ready => {
      if (ready) {
        subject.next(this.data_matricula.filter(d => d. area_carrera_generica == carrera && d.tipo_inst_1 == tipo_institucion));
      }
    })

    return subject.asObservable();
  }

  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");
  
  /**
   * Takes an array of UnitsOfAnalysis and groups them by their size (matricula).
   * We create 2 groups by type:
   * 1: units higher than 1 stdev above size mean
   * 0: units within 1 stdev from size mean
   * -1: units lower than 1 stdev from size mean
   * 
   * 
   *
   * @param {*} units
   * @memberof DataService
   */
  groupUnitsBySize(units: UnitOfAnalysis[]) {
    const subject = new Subject();
    // We use zip to get call getMatricula() observables in parallel
    let sizeObservables = units.map(d => d.getMatricula());
    
    // zip().subscribe was been executed before the return statement
    // we use setTimeout as a hack to prevent syn issues
    setTimeout(() => {
      zip(...(sizeObservables))
      .subscribe(sizeSet => {
        let items = sizeSet.map((size, i) => ({
          size: size,
          unit: units[i]
        }));
  
        let groups = this.getGroupsBySize(items);
  
        subject.next(groups);
      });
    },0)


    return subject.asObservable();

  }
  

  getGroupsBySize(items) {
    items = _.orderBy(items, d => -d.size);
    const mean = d3.mean(items, (d:any) => d.size);
    const stdev = d3.deviation(items, (d:any) => d.size);

    const inputGroups = _.groupBy(items, (d:any) => {
      let type = "0";
      if (d.size > mean + stdev) { type= "1"}
      else if (d.size < mean - stdev) { type= "-1"}

      return type;
    })

    let groups = _.orderBy(_.map(inputGroups, (items, key) => {
      return {
        type: key,
        instituciones: items.map(d => d.unit)
      }
    }), d => -(+d.type))

    return groups;
  }

}
