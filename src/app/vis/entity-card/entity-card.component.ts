import { Component, OnInit, Input } from '@angular/core';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-entity-card',
  templateUrl: './entity-card.component.html',
  styleUrls: ['./entity-card.component.css']
})
export class EntityCardComponent implements OnInit {
  @Input()
  unit: UnitOfAnalysis;
  publicLabel: string;
  rendimientoLabel: string;
  
  constructor(
    private utilService : UtilService
  ) { }

  ngOnInit() {
    this.unit.getQuantileInfo()
    .subscribe(data => {
      const quantileInfo = data;
      this.rendimientoLabel = `${this.utilService.getDescRendimiento(quantileInfo).toUpperCase()} ranking`;
    })
    this.unit.getPrivateIndex()
    .subscribe(d => {
      const freeSchoolIndex = 1 - d;
      if (freeSchoolIndex >= .5) {
        this.publicLabel = `${this.utilService.getDescDependencia(freeSchoolIndex).toUpperCase()}`; 
      } else {
        this.publicLabel = `${this.utilService.getDescDependencia(freeSchoolIndex).toUpperCase()}`; 

      }
    })

  }

}
