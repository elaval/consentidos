import { Injectable } from '@angular/core';
import { UnitOfAnalysis } from '../models/unit-of-analysis';
import * as _ from "lodash";
import { root } from 'node_modules_old/rxjs/src/internal/util/root';

@Injectable({
  providedIn: 'root'
})
export class UnitsStorageService {
  storage = {};
  constructor() { }

  setUnit(unit: UnitOfAnalysis) {
    const key = this.scopeToKey(unit.scope) || "root";

    this.storage[key]= unit;
  }

  getUnit(scope: any) {
    const key = this.scopeToKey(scope) || "root";

    return this.storage[key];
  }

  scopeToKey(scope) {
    const dimensions  = _.sortBy(_.keys(scope));

    const key = dimensions.map(d => `${d}:${scope[d]}`).join("|")

    return key;
  }
}
