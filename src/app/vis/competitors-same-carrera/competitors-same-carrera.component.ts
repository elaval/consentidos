import { Component, OnInit, Input } from '@angular/core';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import * as _ from "lodash"
import * as d3 from "d3"
import { BehaviorSubject, zip } from 'rxjs';
import { DIMENSION_ATTRIBUTES } from '../../config';

const LIMIT_HIGH = 30;
const LIMIT_LOW = 70;

@Component({
  selector: 'app-competitors-same-carrera',
  templateUrl: './competitors-same-carrera.component.html',
  styleUrls: ['./competitors-same-carrera.component.scss']
})
export class CompetitorsSameCarreraComponent implements OnInit {
  @Input()
  carrera: UnitOfAnalysis;
  competitionData: any;
  matriculaCompetencia: any;
  myQuantile25: number;
  competitors: any;
  myQuantile75: number;
  
  constructor() { }

  ngOnInit() {
    this.carrera.getCompetitionGraph()
    .subscribe(data => {
      this.competitionData = data


    })

    this.carrera.getRecords()
    .subscribe(data => {


    })

    zip(this.carrera.getCompetitionGraph(), this.carrera.getRecords())
    .subscribe(res => {
      const competitorsData = res[0];
      const myData = res[1];

      const myQuantileArray = _.sortBy(myData.map(d => d.percentil), d => d)
      this.myQuantile25 = d3.quantile(myQuantileArray, 0.25);
      this.myQuantile75 = d3.quantile(myQuantileArray, 0.75);


      this.matriculaCompetencia = _.reduce(competitorsData.competitors, (memo,d) => memo + +d.matricula, 0)
      
      let maxPercentileBySchool = {};
      let group = _.groupBy(myData, d => d['rbd']);
      
      _.each(group, (items, school) => {
        maxPercentileBySchool[school] = _.min(items, d => +d.percentil);
      })

      let allRecords = [];
      let dataByCompetitor = [];
      competitorsData.competitors.forEach(d => {
        let matricula = _.reduce(d.items, (memo,d) => +d.count + memo,0);
        let percentilArray = _.sortBy(d.items.map(d => +d.percentil), d => d);
        let quantile25 = d3.quantile(percentilArray, 0.25);
        let quantile75 = d3.quantile(percentilArray, 0.75);
        d.quantile25 = quantile25;
        d.quantile50 = d3.quantile(percentilArray, 0.5);;
        d.quantile75 = quantile75;
        allRecords = _.concat(allRecords, d.items);
      })

      let groupBySchoolCompetitors = _.groupBy(allRecords, d => d.rbd)

      let out = _.map(groupBySchoolCompetitors, (items, rbd) => ({
        rbd: rbd,
        items : _.filter(items, d => +d.percentil <= +maxPercentileBySchool[rbd].percentil)
      }));

      this.competitors = _.sortBy(competitorsData.competitors, d => +d.quantile50);

    })

  }

  distributeByPerformance(dataCompetitors) {
    let allRecords = [];

    dataCompetitors.forEach(d => {
      allRecords = _.concat(allRecords, d.items);
    })

    const highPerformanceStudents = _.filter(allRecords, d => +d['percentil'] <= LIMIT_HIGH);
    const lowPerformanceStudents = _.filter(allRecords, d => +d['percentil'] > LIMIT_HIGH);
    

    return {
      highPerformance : {
        matricula: _.reduce(highPerformanceStudents, (memo, d) => +d.count + memo, 0),
        itemsByInstitucion : this.groupByInstitucion(highPerformanceStudents)
      },

      lowPerformance : {
        matricula: _.reduce(lowPerformanceStudents, (memo, d) => +d.count + memo, 0),
        itemsByInstitucion : this.groupByInstitucion(lowPerformanceStudents)
      }
    }
  }

  groupByInstitucion(data) {
    let group = _.groupBy(data, d => d[DIMENSION_ATTRIBUTES['institucion']]);
    let groupArray = _.map(group, (items, institucion) => ({
      "institucion" : institucion,
      "matricula" : _.reduce(items, (memo, d) => +d.count + memo, 0)
    }))

    return groupArray
  }

}