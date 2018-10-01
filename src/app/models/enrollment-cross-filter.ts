import * as _ from 'lodash';
import { DataService } from '../services/data.service';
import * as crossfilter from 'crossfilter';

export class Scope {
 
}




/**
 * 
 *
 * @export
 * @class EnrollmentCrossFilter
 */
export class EnrollmentCrossFilter {
  scope: {};
  data: any[];
  cf: CrossFilter.CrossFilter<any>;
  dimension = {};
  group = {};

  dimensionKeys = [
    'nomb_inst', 
    'nomb_carrera',
    'nom_rbd',
    'percentil',
    'dependencia'
  ];

  constructor(
    data: any[]
  ) {
    this.data = data;
    this.cf = crossfilter(data)
    this.buildDimensions();
  }

  buildDimensions() {
    this.dimensionKeys.forEach(key => {
      this.dimension[key] = this.cf.dimension(d => d[key]);
      this.group[key] = this.dimension[key].group().reduce(this.reduceAdd, this.reduceRemove, this.reduceInitial).order((p) => p.matricula);
    });
  }

  reduceAdd(p,v) {
    return {
      "matricula": p.matricula + (+v.count), 
    };
  }

  reduceRemove(p,v) {
    return {
      "matricula": p.matricula - (+v.count), 
    };
  }  
  
  reduceInitial() {
    return {"matricula": 0};

  }

  getDataBy(dim) {
    let results =  this.group[dim] && this.group[dim].all().filter(d => d.value.matricula > 0) || [];
    return results.map(d => {
      const record = {}
      record[dim]= d.key;
      record['matricula'] = d.value.matricula;

      return record;
    })
  }

}
