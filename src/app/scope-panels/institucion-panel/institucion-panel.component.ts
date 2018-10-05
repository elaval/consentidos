import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { ScopeService } from '../../services/scope.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-institucion-panel',
  templateUrl: './institucion-panel.component.html',
  styleUrls: ['./institucion-panel.component.css']
})
export class InstitucionPanelComponent implements OnInit {
  @Input()
  unit;

  @Output()
  selectUnit = new EventEmitter();

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
    private scopeService: ScopeService,
    private dataService: DataService
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

    this.unit.getChildren("nomb_carrera")
    .subscribe(data => {
      let instituciones = data;

      this.dataService.groupUnitsBySize(instituciones)
      .subscribe(groups => {
        this.groupBySize = groups
      })
      ;

    })
    
  }


  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");


  selectItem(unit) {
    const newScope = unit.scope && _.clone(unit.scope) || {};
    this.scopeService.setScope(newScope);
    this.selectUnit.emit(unit);
  }

  unselectDimension(dimension) {
    this.scopeService.unselectDimension(dimension);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateUnit()
  }
}