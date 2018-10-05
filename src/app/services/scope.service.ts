import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DIMENSION_ATTRIBUTES } from "../config";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class ScopeService {
  private scopeSubject = new BehaviorSubject(null);
  scope = this.scopeSubject
  _scope: any = {};

  constructor() { }

  setScope(scope) {
    this._scope = scope;
    this.scopeSubject.next(scope);
  }

  scopeType() {
    let type = null;

    if (!this._scope || !this._scope['tipo_inst_1']) {
      type = "global";
    } else if (!this._scope['nomb_inst']) {
      type = "tipoInstitucion";
    } else if (!this._scope['nomb_carrera']) {
      type = "institucion";
    } else {
      type = "carrera";
    }

    return type;
  }

  unselectDimension(dimension) {
    if (dimension == "tipoInstitucion") {
      this.setScope(_.omit(this._scope, DIMENSION_ATTRIBUTES["tipoInstitucion"], DIMENSION_ATTRIBUTES["institucion"], DIMENSION_ATTRIBUTES["carrera"]));
    } else if (dimension == "institucion") {
      this.setScope(_.omit(this._scope,  DIMENSION_ATTRIBUTES["institucion"], DIMENSION_ATTRIBUTES["carrera"]));
    } else if (dimension == "carrera") {
      this.setScope(_.omit(this._scope,  DIMENSION_ATTRIBUTES["carrera"]));
    }
  }
}
