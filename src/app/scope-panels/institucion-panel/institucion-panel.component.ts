import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { ScopeService } from '../../services/scope.service';

@Component({
  selector: 'app-institucion-panel',
  templateUrl: './institucion-panel.component.html',
  styleUrls: ['./institucion-panel.component.css']
})
export class InstitucionPanelComponent implements OnInit {
  @Input()
  unit;
  matricula: any;
  records: any;
  ppIndex: any;
  top50Index: any;
  byPercentil: any;
  carreras: UnitOfAnalysis[];
  groupBySize: any;

  groupLabel = {
    "1": "Matricula alta",
    "0": "Matricula media",
    "-1": "Matricula baja"
  }
  
  constructor(
    private scopeService: ScopeService
  ) { }

  ngOnInit() {
  }

  updateUnit() {
    this.unit.getMatriculaByPercentil()
    .subscribe(data => 
      this.byPercentil = data
    );

    this.unit.getHigherPercentileIndex()
    .subscribe(data => 
      this.top50Index = data
    )

    this.unit.getPrivateIndex()
    .subscribe(data => 
      this.ppIndex = data
    )

    this.unit.getRecords()
    .subscribe(data => {
      this.records = data;

      const groups = _.groupBy(this.records, d => d['nomb_carrera']);
      this.carreras = _.map(groups, (items,key) => {
        const matricula = _.reduce(items, (memo, e) => {
          return +e.count + memo;
        }, 0)
        return {
          name: key,
          matricula: matricula
        }
      })

      const mean = d3.mean(this.carreras, d => d.matricula);
      const stdev = d3.deviation(this.carreras, d => d.matricula);

      const instGroups = _.groupBy(this.carreras, d => {
        let type = "0";
        if (d.matricula > mean + stdev) { type= "1"}
        else if (d.matricula < mean - stdev) { type= "-1"}

        return type;
      })

      this.groupBySize = _.orderBy(_.map(instGroups, (items, key) => {
        return {
          type: key,
          carreras: items
        }
      }), d => -(+d.type))

    })

    this.unit.getMatricula()
    .subscribe(data => 
      this.matricula = data
    )
  }

  selectCarrera(name) {
    const newScope = _.clone(this.unit.scope);
    newScope['nomb_carrera']= name;
    this.scopeService.setScope(newScope);
  }

  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");

  ngOnChanges(changes: SimpleChanges) {
    this.updateUnit()
  }
}