import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { zip } from 'rxjs';
import * as _ from "lodash";
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-perfil-careras',
  templateUrl: './perfil-careras.component.html',
  styleUrls: ['./perfil-careras.component.scss']
})
export class PerfilCarerasComponent implements OnInit {
  @Input()
  carrera:UnitOfAnalysis;
  siblingsData: any;
  carreraGenerica: any;
  loading = true;
  
  constructor(
    private dataService: DataService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    
    this.carrera.getRecords()
    .subscribe(data => {
      this.carreraGenerica = data[0].area_carrera_generica
    })
    

    this.loadSiblings();

  }

  loadSiblings() {
    this.dataService.findSiblings(this.carrera)
    .subscribe(data => {
      const siblings: UnitOfAnalysis[] = data;

      const quantileInfoObs = siblings.map((d:UnitOfAnalysis) => d.getProfileInfo())
      zip(...(quantileInfoObs))
      .subscribe(res => {
        const items = siblings.map((unit, i) =>({
          "unit": unit,
          "info": res[i]
        }))

        const group = _.groupBy(items, d => this.utilService.getDescRendimiento(d.info.quantileInfo));

        const order = {
          "Muy Alto" : 0,
          "Alto" : 1,
          "Medio" : 2,
          "Bajo" : 3
        }
        const groupedArray = _.map(group, (items, categoriaRanking) => {
          return {
            categoriaRanking : categoriaRanking,
            order: order[categoriaRanking],
            items: _.sortBy(items, d => d.info.privateIndex)
          }
        })
        this.loading = false;
        setTimeout(() => {
          this.siblingsData = _.sortBy(groupedArray, d => d.order)
        },0)
      })

    })
    ;
  }

}
