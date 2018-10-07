import { Component, OnInit, Input } from '@angular/core';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import * as _ from "lodash"
import * as d3 from "d3"
import { BehaviorSubject, zip } from 'rxjs';
import { DIMENSION_ATTRIBUTES } from '../../config';
import { DataService } from '../../services/data.service';

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
  directCompetitors: any;
  detailSchools: any;
  selectedItem: any;
  logosUrls: any;
  
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.carrera.getCompetitionGraph()
    .subscribe(data => {
      this.competitionData = data
    })

    this.dataService.logos.subscribe(data => this.logosUrls =data)

    zip(this.carrera.getCompetitionGraph(), this.carrera.getRecords())
    .subscribe(res => {
      const competitorsData = res[0];
      const myData = res[1];

      const myQuantileArray = _.sortBy(myData.map(d => d.percentil), d => d)
      this.myQuantile25 = d3.quantile(myQuantileArray, 0.25);
      this.myQuantile75 = d3.quantile(myQuantileArray, 0.75);


      this.matriculaCompetencia = _.reduce(competitorsData.competitors, (memo,d) => memo + +d.matricula, 0)
      
      this.directCompetitors = competitorsData.competitors.filter(d => {
        let overlap  =false;

        overlap  = d.quantileInfo.quantile25 <= this.myQuantile75 && d.quantileInfo.quantile75 >= this.myQuantile25;

        return overlap;
      })

      this.directCompetitors.forEach(d => {
        d.focusRecords = d.items.filter(d => d.percentil <= this.myQuantile75 && d.percentil <= this.myQuantile25)
        d.focusEnrollment =  _.reduce(d.focusRecords, (memo, d) => +d.count + memo, 0);        
      })

      this.directCompetitors = this.directCompetitors.filter(d => d.focusEnrollment);
      this.directCompetitors = _.sortBy(this.directCompetitors, d => -d.focusEnrollment);
      
      this.competitors = _.sortBy(competitorsData.competitors, d => +d.quantile50);

    })

  }

  details(item) {
    let groupBySchool = _.groupBy(item.focusRecords, d=> d['rbd']);

    this.detailSchools = _.map(groupBySchool, (items, rbd) => ({
      "rbd": items[0].rbd,
      "nom_rbd": items[0].nom_rbd,
      "nom_com_rbd": items[0].nom_com_rbd,
      "dependencia": items[0].dependencia,
      "matricula" : _.reduce(items, (memo,d) => +d.count + memo, 0)
    }))

    this.selectedItem = item;
    this.detailSchools = _.sortBy(this.detailSchools, d => -d.matricula)
  }

  hideDetails() {

  }

  /*
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
  */

}