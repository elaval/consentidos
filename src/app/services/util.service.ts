import { Injectable } from '@angular/core';
import * as d3 from "d3";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getDescRendimiento(index) {
    if (index < 0.5) {
      return "Bajo"
    } else {
      return "Alto"
    }
  }

  getDescDependencia(index) {
    if (index > 0.5) {
      return "Gratuito"
    } else {
      return "Pagado"
    }
  }

  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");

}
