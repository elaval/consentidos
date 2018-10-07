import { Injectable } from '@angular/core';
import * as d3 from "d3";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getDescRendimiento(quantileInfo) {
    if (quantileInfo.quantile50 < 30) {
      return "Muy Alto"
    } else if (quantileInfo.quantile50 < 50) {
      return "Alto"
    } else if (quantileInfo.quantile50 > 50) {
      return "Bajo"
    } else {
      return "Medio"
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
