import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-institution-profile',
  templateUrl: './institution-profile.component.html',
  styleUrls: ['./institution-profile.component.css']
})
export class InstitutionProfileComponent implements OnInit {
  @Input()
  unit;
  indexGratuito: number;
  indexRendimiento: any;
  matricula: any;
  quantileInfo: any;
  
  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.unit.getHigherPercentileIndex()
    .subscribe(data => 
      this.indexRendimiento = +data
    )

    this.unit.getPrivateIndex()
    .subscribe(data => 
      this.indexGratuito = 1 - (+data || 0)
    )

    this.unit.getMatricula()
    .subscribe(data => 
      this.matricula = data
    )

    this.unit.getQuantileInfo()
    .subscribe(data => 
      this.quantileInfo = data
    )
    

  }

}
