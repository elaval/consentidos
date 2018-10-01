import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { forkJoin, Observable } from 'rxjs';

const height = 100;
const width = 100;

@Component({
  selector: 'app-miniquad',
  templateUrl: './miniquad.component.html',
  styleUrls: ['./miniquad.component.css']
})
export class MiniquadComponent implements OnInit {
  @Input()
  unit: UnitOfAnalysis;
  svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  xScale: d3.ScaleLinear<number, number>;
  marker: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  top50Index: any;
  ppIndex: any;
  publicIndex: number;
  yScale: d3.ScaleLinear<number, number>;
  initialised: boolean;
  margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  }
  container: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

  constructor() { 

  }

  ngOnInit() {
    
    this.svg = d3.select("svg")
    .attr("width", width + this.margin.left + this.margin.right)
    .attr("height", height + this.margin.top + this.margin.bottom)
    ;

    this.container = this.svg.append("g")
    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
    ;

    
    this.container.append("text")
    .classed("xTitle", true)
    .attr("font-size", 8)
    .attr("text-anchor", "start")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", -2)
    .text("% Publico")
    ;
  
    
    this.container.append("text")
    .classed("yTitle", true)
    .attr("font-size", 8)
    .attr("text-anchor", "start")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", 10)
    .attr("transform", `rotate(90 ${0} ${0} )`)
    .text("% alto ranking")
    ;

    this.marker = this.container.append("circle")
    .classed("marker", true)
    .attr("r", 10)
    .attr("fill", "orange")
    ;

    this.xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0,1])
    ;   
    
    this.yScale = d3.scaleLinear()
    .range([height,0])
    .domain([0,1])  
    ;

    this.container.append("line")
    .classed("v", true)
    .attr("x1", this.xScale(0.5))
    .attr("x2", this.xScale(0.5))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "grey")
    ;

    this.container.append("line")
    .classed("h", true)
    .attr("y1", this.yScale(0.5))
    .attr("y2", this.yScale(0.5))
    .attr("x1", 0)
    .attr("x2", height)
    .attr("stroke", "grey")
    ;
    
    
    this.initialised = true;

    this.render()

  }

  render() {
    if (this.unit && this.initialised) {
      this.unit.getHigherPercentileIndex()
      .subscribe(yValue => {
        this.unit.getPrivateIndex()
        .subscribe(xValue => {
          this.marker
          .transition()
          .attr("cx", this.xScale(1-xValue))
          .attr("cy", this.yScale(yValue))

          this.container.select("text.xTitle")
          .text(`${this.formatterPercent(1-xValue)} ed. pública`)
          ;

          this.container.select("text.yTitle")
          .text(`${this.formatterPercent(yValue)} top ranking`)
          ;
        })
      })
      ;

    }
  }

  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");

  ngOnChanges(changes: SimpleChanges) {
    this.render()
  }

}
