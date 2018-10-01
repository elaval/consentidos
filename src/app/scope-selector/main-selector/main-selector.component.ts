import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../services/data.service';
import { ScopeService } from '../../services/scope.service';

@Component({
  selector: 'app-main-selector',
  templateUrl: './main-selector.component.html',
  styleUrls: ['./main-selector.component.css']
})
export class MainSelectorComponent implements OnInit {
  instituciones: any;
  tipoInstituciones: any;
  carreras: any;
  selectedTipoInstitucion: any = "*";
  selectedInstitucion: string = "*";
  selectedCarrera: string = "*";

  constructor(
    public auth: AuthService,
    private dataService: DataService,
    private scopeService : ScopeService
    ) 
  { 
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
      this.selectedTipoInstitucion= scope && scope['tipo_inst_1'] || "*";
      this.selectedInstitucion= scope && scope['nomb_inst'] || "*";
      this.selectedCarrera= scope && scope['nomb_carrera'] || "*";
    })
  }

  selectTipoInstitucion(item) {
    this.selectedTipoInstitucion = item;
    this.selectedInstitucion = '*';
    this.selectedCarrera = '*';

    this.dataService.selectTipoInstitucion(item);

    if (this.selectedTipoInstitucion !== "*") {
      this.scopeService.setScope({
        tipo_inst_1: this.selectedTipoInstitucion
      })
    } else {
      this.scopeService.setScope({
      })
    }

  }

  selectInstitucion(item) {
    this.selectedCarrera = '*';
    this.selectedInstitucion = item;

    this.dataService.selectInstitucion(item);

    this.scopeService.setScope({
      tipo_inst_1: this.selectedTipoInstitucion,
      nomb_inst: this.selectedInstitucion
    })
  }

  selectCarrera(item) {
    this.selectedCarrera = item;

    this.dataService.selectCarrera(item);

    this.scopeService.setScope({
      tipo_inst_1: this.selectedTipoInstitucion,
      nomb_inst: this.selectedInstitucion,
      nomb_carrera : this.selectedCarrera
    })  
  }
  
}
