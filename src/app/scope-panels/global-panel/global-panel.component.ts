import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { ScopeService } from '../../services/scope.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-global-panel',
  templateUrl: './global-panel.component.html',
  styleUrls: ['./global-panel.component.css']
})
export class GlobalPanelComponent implements OnInit {
  @Input()
  unit: UnitOfAnalysis;

  @Output()
  selectUnit = new EventEmitter();


  matricula: any;
  records: any;
  ppIndex: any;
  top50Index: any;
  byPercentil: any;
  tipoInstituciones: any[];
  
  constructor(
    private scopeService: ScopeService,
    private utilService: UtilService
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

    this.unit.getMatricula()
    .subscribe(data => 
      this.matricula = data
    )

    this.unit.getChildren('tipo_inst_1')
    .subscribe(data => {
      this.tipoInstituciones = data;

      const tempList = this.tipoInstituciones.map(d => ({
        item: d,
        size: d.getMatricula()
      }))
    })
  }

  selectTipoInstitucion(name) {
    const newScope = this.unit.scope && _.clone(this.unit.scope) || {};
    newScope['tipo_inst_1']= name;
    this.scopeService.setScope(newScope);
  }

  selectItem(unit) {
    const newScope = unit.scope && _.clone(unit.scope) || {};
    this.scopeService.setScope(newScope);
    this.selectUnit.emit(unit);
  }


  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");


  ngOnChanges(changes: SimpleChanges) {
    this.updateUnit()
  }
}