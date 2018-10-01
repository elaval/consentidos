import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { DataService } from '../services/data.service';
import { UnitOfAnalysis } from '../models/unit-of-analysis';
import * as d3 from "d3";
import { ScopeService } from '../services/scope.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  carreras: any;
  instituciones: any;
  tipoInstituciones: any;
  selectedTipoInstitucion: string = "*";
  selectedInstitucion: string = "*";
  selectedCarrera: string = "*";
  byPercentil: any;
  unit: UnitOfAnalysis;
  top50Index: any;
  byDependencia: any;
  ppIndex: any;
  records: any;
  dataReady: any;
  matricula: any;
  competitionGraphData: any;

  constructor(
    public auth: AuthService,
    private dataService: DataService,
    private scopeService: ScopeService
    ) { 
      dataService.instituciones.subscribe(data => {
        this.instituciones  = data;
      })      
      dataService.tipoInstitucion.subscribe(data => {
        this.tipoInstituciones  = data;
      })      
      dataService.carrera.subscribe(data => {
        this.carreras  = data;
      })

    }

  ngOnInit() { 
    this.scopeService.scope.subscribe(scope => {
      this.updateUnitOfAnalysis(scope)
    })

    this.dataService.dataReady.subscribe(ready => this.dataReady = ready);
  }


  updateUnitOfAnalysis(scope) {

    this.unit = new UnitOfAnalysis({
      "scope": scope,
      "dataService": this.dataService
    });


    
  }



  getCurrentScope() {
    const scope = {};

    if (this.selectedTipoInstitucion !== "*") {
      scope['tipo_inst_1'] = this.selectedTipoInstitucion;
    }    
    
    if (this.selectedInstitucion !== "*") {
      scope['nomb_inst'] = this.selectedInstitucion;
    }

    if (this.selectedCarrera !== "*") {
      scope['nomb_carrera'] = this.selectedCarrera;
    }

    return scope;
    
  }

  formatterPercent = d3.format(".1%");
}
