import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from "d3";
import * as _ from "lodash";
import { ScopeService } from '../../services/scope.service';
 
@Component({
  selector: 'app-carrera-panel',
  templateUrl: './carrera-panel.component.html',
  styleUrls: ['./carrera-panel.component.css']
})
export class CarreraPanelComponent implements OnInit {
  @Input()
  unit;

  @Output()
  selectUnit = new EventEmitter();
  
  byPercentil: any;
  top50Index: any;
  byDependencia: any;
  ppIndex: any;
  records: any;
  competitionGraphData: any;
  matricula: any;
  
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

    this.unit.getMatriculaByDependencia()
    .subscribe(data => 
      this. byDependencia = data
    )

    this.unit.getPrivateIndex()
    .subscribe(data => 
      this.ppIndex = data
    )

    this.unit.getRecords()
    .subscribe(data => {
      this.records = data;

      }
    )

    this.unit.getCompetitionGraph()
    .subscribe(data => 
      this.competitionGraphData = data
    )

    this.unit.getMatricula()
    .subscribe(data => 
      this.matricula = data
    )
  }

  formatterPercent = d3.format(".1%");


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
