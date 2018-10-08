import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import {forkJoin, Observable, of, zip} from 'rxjs';

import { ScopeService } from '../../services/scope.service';
import { DataService } from '../../services/data.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-tipo-institucion-panel',
  templateUrl: './tipo-institucion-panel.component.html',
  styleUrls: ['./tipo-institucion-panel.component.css']
})
export class TipoInstitucionPanelComponent implements OnInit {
  @Input()
  unit: UnitOfAnalysis;

  @Output()
  selectUnit = new EventEmitter();
  
  matricula: any;
  records: any;
  ppIndex: any;
  top50Index: any;
  byPercentil: any;
  instituciones: UnitOfAnalysis[];
  instituciones2: UnitOfAnalysis[];
  groupBySize: any;

  groupLabel = {
    "1": "Matrícula alta",
    "0": "Matrícula media",
    "-1": "Matrícula baja"
  }
  
  constructor(
    private scopeService: ScopeService,
    private dataServcie: DataService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
  }

  updateUnit() {

    this.unit.getHigherPercentileIndex()
    .subscribe(data => 
      this.top50Index = data
    )

    this.unit.getPrivateIndex()
    .subscribe(data => 
      this.ppIndex = data
    )

    this.unit.getMatricula()
    .subscribe(data => 
      this.matricula = data
    )

    this.unit.getChildren("nomb_inst")
    .subscribe(data => {
      let instituciones = data;

      this.dataServcie.groupUnitsBySize(instituciones)
      .subscribe(groups => {
        this.groupBySize = groups
      })
      ;

    })
  }


  selectInstitucion(name) {
    /*
    const newScope = _.clone(this.unit.scope);
    newScope['nomb_inst']= name;
    this.scopeService.setScope(newScope);
    */
  }

  selectItem(unit) {
    const newScope = unit.scope && _.clone(unit.scope) || {};
    this.scopeService.setScope(newScope);
    this.selectUnit.emit(unit);
  }

  unselectDimension(dimension) {
    this.scopeService.unselectDimension(dimension);
  }

  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");

  ngOnChanges(changes: SimpleChanges) {
    this.updateUnit()
  }
}
