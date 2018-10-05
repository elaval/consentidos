import { Component, OnInit, Input } from '@angular/core';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';

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
  
  constructor() { }

  ngOnInit() {
    this.unit.getPrivateIndex()
    .subscribe(d => {
      this.publicLabel = "Gratuito (Municipal/Subvencionado)";
      if (d > .5) {
        this.publicLabel = "Pagado (Particular pagado)";
      }
    })

    this.unit.getHigherPercentileIndex()
    .subscribe(d => {
      this.rendimientoLabel = "Alto rendimiento";
      if (d < .5) {
        this.rendimientoLabel = "Bajo rendimiento";
      }
    })
  }

}
