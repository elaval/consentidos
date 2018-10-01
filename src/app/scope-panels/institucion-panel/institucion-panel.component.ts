import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

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
  
  constructor() { }

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

      }
    )

    this.unit.getMatricula()
    .subscribe(data => 
      this.matricula = data
    )
  }

  formatterPercent = d3.format(".1%");

  ngOnChanges(changes: SimpleChanges) {
    this.updateUnit()
  }
}