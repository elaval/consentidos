import { Component, OnInit, Input, SimpleChanges, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { forkJoin, Observable, zip } from 'rxjs';

@Component({
  selector: 'app-miniquad',
  templateUrl: './miniquad.component.html',
  styleUrls: ['./miniquad.component.css']
})
export class MiniquadComponent implements OnInit {
  @Input()
  unit: UnitOfAnalysis;

  @Input()
  size: number = 100;

  @Input()
  hideLabels: boolean = false;

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
  height = 100;
  width = 100;

  constructor(
    private elRef: ElementRef
  ) { 

  }

  ngOnInit() {
    this.height = this.size || this.height;
    this.width = this.size || this.width;

    this.svg = d3.select(this.elRef.nativeElement).select("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    ;

    this.container = this.svg.append("g")
    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
    ;

    
    this.container.append("text")
    .classed("xTitle", true)
    .attr("font-size", 8)
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", -2)
    .attr("opacity", this.hideLabels ? 0 : 1)
    .text("% Publico")
    ;
  
    
    this.container.append("text")
    .classed("yTitle", true)
    .attr("font-size", 8)
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", 10)
    .attr("transform", `rotate(90 ${0} ${0} )`)
    .attr("opacity", this.hideLabels ? 0 : 1)
    .text("% alto ranking")
    ;

    this.marker = this.container.append("circle")
    .classed("marker", true)
    .attr("r", this.size/10)
    .attr("opacity", 0.7)
    .attr("fill", "orange")
    ;

    this.xScale = d3.scaleLinear()
    .range([0, this.width])
    .domain([0,1])
    ;   
    
    this.yScale = d3.scaleLinear()
    .range([this.height,0])
    .domain([0,1])  
    ;

    this.container.append("line")
    .classed("v", true)
    .attr("x1", this.xScale(0.5))
    .attr("x2", this.xScale(0.5))
    .attr("y1", 0)
    .attr("y2", this.height)
    .attr("stroke", "grey")
    ;

    this.container.append("line")
    .classed("h", true)
    .attr("y1", this.yScale(0.5))
    .attr("y2", this.yScale(0.5))
    .attr("x1", 0)
    .attr("x2", this.height)
    .attr("stroke", "grey")
    ;
    
    
    this.initialised = true;

    this.render()

  }

  render() {
    if (this.unit && this.initialised) {
      zip(this.unit.getHigherPercentileIndex(), this.unit.getPrivateIndex())
      .subscribe(res => {
        const yValue = res[0];
        const xValue = res[1];

        let yLabel = yValue > 0.5 ? "ALTO" : "BAJO";
        let yLabelPos = "middle"; // yValue > 0.7 ? "start" : yValue > 0.3 ? "middle" : "end";
        let xLabel = xValue > 0.5 ? "PAGADO" : "GRATUITO";
        let xLabelPos = "middle"; // xValue > 0.7 ? "start" : xValue > 0.3 ? "middle" : "end";

        this.marker
        .transition()
        .attr("cx", this.xScale(1-xValue))
        .attr("cy", this.yScale(yValue))

        this.container.select("text.xTitle")
        .attr("x", xValue > 0.5 ? this.xScale(0.25): this.xScale(0.75))
        .attr("y", yValue > 0.5 ? 0 : this.height)
        .attr("dy", yValue > 0.5 ? 0 : 5)
        .attr("text-anchor",xLabelPos)
        .text(`${xLabel}`)
        ;

        this.container.select("text.yTitle")
        .attr("x", xValue > 0.5 ? 0 : this.width)
        .attr("dy", xValue > 0.5 ? 5 : 0)
        .attr("y", yValue > 0.5 ? this.yScale(0.75): this.yScale(0.25))
        .attr("text-anchor",d => yLabelPos)
        .attr("transform", `rotate(90 ${xValue > 0.5 ? 0 : this.width} ${yValue > 0.5 ? this.yScale(0.75): this.yScale(0.25)} )`)

        .text(`${yLabel}`)
        ;
      })


    }
  }

  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");

  ngOnChanges(changes: SimpleChanges) {
    this.render()
  }

}
