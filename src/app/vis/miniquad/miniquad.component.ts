import { Component, OnInit, Input, SimpleChanges, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { forkJoin, Observable, zip } from 'rxjs';
import { UtilService } from '../../services/util.service';

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
  height = 50;
  width = 100;
  quantileBand: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  bandScale: d3.ScaleBand<string>;
  quantileMedian: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  topQuartile: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  bottomQuartile: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  freeSchoolScale: any;

  constructor(
    private elRef: ElementRef,
    private utilService: UtilService
  ) { 

  }

  ngOnInit() {
    this.height = this.size * 0.85 || this.height;
    this.width = this.size || this.width;



    this.svg = d3.select(this.elRef.nativeElement).select("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    ;

    this.container = this.svg.append("g")
    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
    ;

    this.xScale = d3.scaleLinear()
    .range([0, this.width])
    .domain([0,1])
    ;   
    
    this.yScale = d3.scaleLinear()
    .range([this.height,0])
    .domain([0,1])  
    ;

    this.bandScale = d3.scaleBand()
    .range([0, this.width])
    .domain(["100","90","80","70","60","50","40","30","20","10"])
    .padding(0)
    ;

    this.freeSchoolScale = d3.scaleLinear()
    .range([this.height*0.75, this.height*0.25])
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
    .attr("x2", this.width)
    .attr("stroke", "grey")
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
    .classed("top", true)
    .attr("font-size", 8)
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", 10)
    .attr("transform", `rotate(90 ${0} ${0} )`)
    .attr("opacity", this.hideLabels ? 0 : 1)
    .text("% alto ranking")
    ;

    this.container.append("text")
    .classed("yTitle", true)
    .classed("bottom", true)
    .attr("font-size", 8)
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", 10)
    .attr("transform", `rotate(90 ${0} ${0} )`)
    .attr("opacity", this.hideLabels ? 0 : 1)
    .text("% alto ranking")
    ;

    this.quantileBand = this.container.append("rect")
    .classed("band", true)
    .attr("x", 0)
    .attr("y", 0)    
    .attr("width", 0)
    .attr("height", 0)
    .attr("opacity", 0.7)
    .attr("fill", "orange")
    ;

    this.quantileMedian = this.container.append("line")
    .classed("median", true)
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)    
    .attr("y2", 0)    
    .attr("opacity", 0.7)
    .attr("stroke", "grey")
    .attr("stroke-width", 1)
    ;

    this.topQuartile = this.container.append("line")
    .classed("topQuartile", true)
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)    
    .attr("y2", 0)    
    .attr("opacity", 0.7)
    .attr("stroke", "orange")
    .attr("stroke-width", 1)
    ;

    this.bottomQuartile = this.container.append("line")
    .classed("bottomQuartile", true)
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)    
    .attr("y2", 0)    
    .attr("opacity", 0.7)
    .attr("stroke", "orange")
    .attr("stroke-width", 1)
    ;

  
    
    
    this.initialised = true;

    this.render()

  }

  render() {
    if (this.unit && this.initialised) {
      zip(this.unit.getHigherPercentileIndex(), this.unit.getPrivateIndex(), this.unit.getQuantileInfo())
      .subscribe(res => {
        const rendimientoIndex = res[0];
        const freeSchoolIndex = 1-res[1];
        const quantileInfo = res[2];

        const radius  = this.size/10;
        const bandHeight  = this.height/2;

        const scale = this.bandScale;


        let yLabel = freeSchoolIndex < 0.5 ? "PAGADO" : "GRATUITO";
        let yLabelTop =  "GRATUITO";
        let yLabelBottom =  "PAGADO";
        let yLabelPos = "middle"; // yValue > 0.7 ? "start" : yValue > 0.3 ? "middle" : "end";
        let xLabel = this.utilService.getDescRendimiento(quantileInfo).toUpperCase();
        //quantileInfo.quantile50 < 30 ? "MUY ALTO" : quantileInfo.quantile50 < 50 ? "ALTO" : quantileInfo.quantile50 > 70 ? "MUY BAJO" : quantileInfo.quantile50 > 50 ? "BAJO" : "MEDIO";
        let xLabelPos = "middle"; // xValue > 0.7 ? "start" : xValue > 0.3 ? "middle" : "end";

        let xLabelXPosScale = (index) => {
          return index < 30 ? this.xScale(0.75) : quantileInfo.quantile50 < 50 ? this.xScale(0.75) : quantileInfo.quantile50 > 70 ? this.xScale(0.25) : quantileInfo.quantile50 > 50 ? this.xScale(0.25) : this.xScale(0.5); 
        }

        this.quantileBand
        .transition()
        .attr("width", () => {
          let h =  this.bandScale(`${this.roundDecil(quantileInfo.quantile25)}`)-this.bandScale(`${this.roundDecil(quantileInfo.quantile75)}`) + this.bandScale.bandwidth();
          return h;
        })
        .attr("x", () => {
          let v = this.bandScale(`${this.roundDecil(quantileInfo.quantile75)}`)
          return v;
        })
        .attr("height", () => {
          return bandHeight;
        })
        .attr("y", () => {
          let v = this.freeSchoolScale(freeSchoolIndex)-bandHeight/2;
          return v;
        })

        this.quantileMedian
        .transition()
        .attr("x1", () => {
          let v = this.bandScale(`${this.roundDecil(quantileInfo.quantile50)}`)+ this.bandScale.bandwidth()/2
          return v;
        })        
        .attr("x2", () => {
          let v = this.bandScale(`${this.roundDecil(quantileInfo.quantile50)}`)+ this.bandScale.bandwidth()/2
          return v;
        })
        .attr("y1", () => {
          let v = this.freeSchoolScale(freeSchoolIndex)-bandHeight/2;
          return v;
        })
        .attr("y2", () => {
          let v = this.freeSchoolScale(freeSchoolIndex)-bandHeight/2;
          return v;
        })

        this.topQuartile
        .transition()
        .attr("x1", () => {
          let v = this.bandScale(`${this.roundDecil(quantileInfo.quantile100)}`)
          return v;
        })        
        .attr("x2", () => {
          let v = this.bandScale(`${this.roundDecil(quantileInfo.quantile75)}`)
          return v;
        })
        .attr("y1", () => {
          let v = this.freeSchoolScale(freeSchoolIndex)
          return v;
        })
        .attr("y2", () => {
          let v = this.freeSchoolScale(freeSchoolIndex)
          return v;
        })
        .attr("stroke-width", () => {
          return bandHeight/10;
        })


        this.bottomQuartile
        .transition()
        .attr("x1", () => {
          let v = this.bandScale(`${this.roundDecil(quantileInfo.quantile25)}`)+ this.bandScale.bandwidth()
          return v;
        })        
        .attr("x2", () => {
          let v = this.bandScale(`${this.roundDecil(quantileInfo.quantile0)}`) + this.bandScale.bandwidth();
          return v;
        })
        .attr("y1", () => {
          let v = this.freeSchoolScale(freeSchoolIndex)
          return v;
        })
        .attr("y2", () => {
          let v = this.freeSchoolScale(freeSchoolIndex)
          return v;
        })
        .attr("stroke-width", () => {
          return bandHeight/10;
        })


        this.container.select("text.xTitle")
        .attr("x", xLabelXPosScale(quantileInfo.quantile50))
        .attr("y", freeSchoolIndex > 0.5 ? 0 : this.height)
        .attr("dy", freeSchoolIndex > 0.5 ? 0 : 5)
        .attr("text-anchor",xLabelPos)
        .text(`${xLabel}`)
        ;

        this.container.select("text.yTitle.top")
        .attr("x", quantileInfo.quantile50 > 50 ? 0 : this.width)
        .attr("dy", quantileInfo.quantile50 > 50 ? 5 : 0)
        .attr("y", this.yScale(0.75))
        .attr("text-anchor",d => yLabelPos)
        .attr("transform", `rotate(90 ${quantileInfo.quantile50 > 50 ? 0 : this.width} ${this.yScale(0.75)} )`)
        .text(`${yLabelTop}`)
        ;

        this.container.select("text.yTitle.bottom")
        .attr("x", quantileInfo.quantile50 > 50 ? 0 : this.width)
        .attr("dy", quantileInfo.quantile50 > 50 ? 5 : 0)
        .attr("y", this.yScale(0.25))
        .attr("text-anchor",d => yLabelPos)
        .attr("transform", `rotate(90 ${quantileInfo.quantile50 > 50 ? 0 : this.width} ${this.yScale(0.25)} )`)
        .text(`${yLabelBottom}`)
        ;
        /*
        this.container.select("text.yTitle")
        .attr("x", quantileInfo.quantile50 > 50 ? 0 : this.width)
        .attr("dy", quantileInfo.quantile50 > 50 ? 5 : 0)
        .attr("y", freeSchoolIndex > 0.5 ? this.yScale(0.75): this.yScale(0.25))
        .attr("text-anchor",d => yLabelPos)
        .attr("transform", `rotate(90 ${quantileInfo.quantile50 > 50 ? 0 : this.width} ${freeSchoolIndex > 0.5 ? this.yScale(0.75): this.yScale(0.25)} )`)

        .text(`${yLabel}`)
        ;
        */
      })


    }
  }

  roundDecil(num) {
    return Math.round(num/10)*10;
  }

  formatterPercent = d3.format(".1%");
  formatterNumber = d3.format(",");

  ngOnChanges(changes: SimpleChanges) {
    this.render()
  }

}
