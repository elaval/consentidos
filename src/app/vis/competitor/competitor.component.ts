import { Component, OnInit, Input, ElementRef, SimpleChanges } from '@angular/core';
import * as d3 from "d3";
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-competitor',
  templateUrl: './competitor.component.html',
  styleUrls: ['./competitor.component.css']
})
export class CompetitorComponent implements OnInit {
  @Input()
  data;

  @Input()
  institucion = "UNIVERSIDAD DE CHILE";  
  
  @Input()
  carrera = "ARQUITECTURA";

  el: any;
  svg: d3.Selection<d3.BaseType, {}, null, undefined>;
  fontSize: 8;
  sizeScale: d3.ScaleLinear<number, number>;
  
  constructor(
    private element: ElementRef,
    private dataService: DataService
  ) { 
    this.el = element.nativeElement;
  }

  ngOnInit() {
    this.svg = d3.select(this.el).select("svg");
    this.sizeScale = d3.scaleLinear()
    .range([5,10]);
  }

  render(data) {
    const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    const height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    const size = Math.min(width,height);

    if (data) {
      const svg = this.svg.node();

      const margin  = {
        left:100,
        top:20,
        right:600,
        bottom:20
      }
      const chartWidth = width-margin.left-margin.right;
      const chartHeight = height-margin.top-margin.bottom-100;
        
      d3.select(svg)
        .attr("height", chartHeight+margin.top+margin.bottom)
        .attr("width", chartWidth+margin.left+margin.right);
      
      const container = d3.select(svg).select("g.container")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
      
      const ratePPExtent = d3.extent(data, (d:any) => 1-d.metrics.ratePP);
      const rateTop50Extent = d3.extent(data, (d:any) => +d.metrics.rateTop50);
      
      const xScale = d3.scaleLinear()
        //.domain(d3.extent(data, (d:any) => 1-d.metrics.ratePP))
        .domain([Math.max(0,ratePPExtent[0]-0.1),Math.min(1,ratePPExtent[1]+0.1)])
        .range([0,chartWidth])
        ;
      
      const yScale = d3.scaleLinear()
        //.domain(d3.extent(data, (d:any) => +d.metrics.rateTop50))
        .domain([Math.max(0,rateTop50Extent[0]-0.1),Math.min(1,rateTop50Extent[1]+0.1)])
        .range([chartHeight,0])
        ;

      this.sizeScale
        .domain(d3.extent(data, (d:any) => +d.metrics.matricula))
      
      const axisXContainer = container.select("g.x.axis")
        //.attr("class", "x axis")
        .attr("transform", `translate(0, ${chartHeight})`)
        ;
      
      const axisYContainer = container.select("g.y.axis")
        //.attr("class", "y axis")
        .attr("transform", `translate(0, 0)`)
        ;
      
      const axisY = d3.axisLeft(yScale);
      const axisX = d3.axisBottom(xScale);
    
      axisXContainer
      .call(axisX)
      
      axisYContainer
      .call(axisY)
      ;
      
      const nodes = data.map(d => 
        ({
            x:xScale(1-d.metrics.ratePP),
            y:yScale(d.metrics.rateTop50),
            name: d.institucion,
            data:d
        })
      );
      
      let units = container.selectAll("g.inst")
      .data(nodes, (d:any) => d.name);
      
      units.exit().remove();
      
      const newUnits = units.enter().append("g")
        .classed("inst", true);


      
      newUnits.append("text");
      
      units = newUnits.merge(units);

      
      units
        .transition()
        .attr("transform", (d:any) => `translate(${d.x}, ${d.y})`);

      units
        .on("mouseover",function(){
          const sel = d3.select(this);
          //sel.node().parentNode.appendChild(this)
          (<HTMLElement>this).parentNode.appendChild(<HTMLElement>this)
        });

      
      units.selectAll("text")
        .text((d:any) => d.name)
        .attr("dy", (d:any) => 3 * this.sizeScale(d.data.metrics.matricula))
        .attr("font-size", this.fontSize)
        .attr("text-anchor", "middle")
        .call(this.getBB);

      newUnits.insert("rect", "text");
      newUnits.append("circle");

      units.selectAll("circle")
        .transition()
        .attr("r",  (d:any) => this.sizeScale(d.data.metrics.matricula))
        .style("fill", (d:any) => d.name == this.institucion ? "orange" : "grey");

      units.selectAll("rect")
      .attr("y", (d:any) => 3 * this.sizeScale(d.data.metrics.matricula)- this.fontSize)
      .attr("x", (d:any) => -d.bbox.width/2)
      .attr("width", (d:any) => d.bbox.width)
      .attr("height", 20)
      .attr("fill", "white")
      
      container.select("line.vertical")
        .attr("x1", d => xScale(0.5))
        .attr("x2", d => xScale(0.5))    
        .attr("y1", d => chartHeight)
        .attr("y2", d => 0)
        .attr("stroke", "grey")
        ;
      
        container.select("line.horizontal")
        .attr("x1", d => 0)
        .attr("x2", d => chartWidth)    
        .attr("y1", d => yScale(0.5))
        .attr("y2", d => yScale(0.5))
        .attr("stroke", "grey")
        ;
    
      container.select("text.quadrant.label.left")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", -10)
      .attr("font-size", 10)
      .text("+ Part. Pagado")
      
      container.select("text.quadrant.label.right")
      .attr("x", chartWidth)
      .attr("y", 0)
      .attr("dy", -10)
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .text("+ Público/Subvencionado")
      
      container.select("text.quadrant.label.top")
      .attr("x", chartWidth)
      .attr("y", 0)
      .attr("dy", -90)
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .attr("transform", `rotate(90 ${chartWidth}, 0)`)
      .text("Percentiles altos")
      
      container.select("text.quadrant.label.bottom")
      .attr("x", chartWidth)
      .attr("y", chartHeight)
      .attr("dy", -80)
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .attr("transform", `rotate(90 ${chartWidth}, ${chartHeight})`)
      .text("Percentiles bajos")
      
    }

  }

  getBB(selection) {
    selection.each(function(d){d.bbox = this.getBBox();})
  } 

  ngOnChanges(changes: SimpleChanges) {
    this.dataService.findEquivalents(this.institucion, this.carrera)
    .then(data => this.render(data))

  }
}
