import { Component, OnInit, Input, ElementRef, SimpleChanges } from '@angular/core';
import { DataService } from '../../services/data.service';
import * as d3 from 'd3';
import * as moment from "moment";
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-schools-institutions',
  templateUrl: './schools-institutions.component.html',
  styleUrls: ['./schools-institutions.component.css']
})
export class SchoolsInstitutionsComponent implements OnInit {
  @Input()
  unit;

  svg: import("/Users/ernestolaval/node_modules/@types/d3-selection/index").Selection<import("/Users/ernestolaval/node_modules/@types/d3-selection/index").BaseType, {}, null, undefined>;
  el: any;
  selectedSchool: any;
  selectedInstitution: any;
  selectedLinks: any;
  dataLogos: any;
  data: any;
  timeStamp: moment.Moment;

  nodes;
  links;
  chartWidth: number;
  chartHeight: number;
  linksContainer: d3.Selection<d3.BaseType, {}, null, undefined>;
  container;

  constructor(
    private element: ElementRef,
    private dataService: DataService
  ) { 
    this.el = element.nativeElement;
  }

  ngOnInit() {
    this.svg = d3.select(this.el).select("svg");
    this.container = this.svg.select("g.container")

    this.linksContainer = this.container.append("g").classed("links", true)


    this.processNewUnit(this.unit);

    this.dataService.logos
    .subscribe(data => {
      this.dataLogos = data;
      this.render(this.data)
    });
  }



  processNewUnit(unit:UnitOfAnalysis) {
    if (unit) {
  
      unit.getCompetitionGraph()
      .subscribe(data => {
        this.data = data;
        this.render(this.data)
      });

    }
  }

  render(data) {

    if (data && this.dataLogos) {
      const self = this;
      const width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
  
      const height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
  
      this.chartWidth = width;
      this.chartHeight = 300;
      const competitorColumnWidth = 100;
      const margin  = {
        left:50,
        top:20,
        right:50,
        bottom:20
      }
      
      this.timeStamp = moment(new Date());
        
      const nodesCompetitors = data.competitors;
      const nodesSchools = data.targetSchools;
      
      nodesCompetitors.forEach(d => d.type = "competitor");
      nodesSchools.forEach(d => d.type = "school");
      
      this.nodes = nodesCompetitors.concat(nodesSchools);
      
      this.nodes.forEach(d => d.y=this.chartHeight/2)
      
      this.links = data.links;
        
      const sizeSchools = d3.scaleLinear()
      .domain(d3.extent(<any[]>nodesSchools, d => d.matricula))
      .range([5,15])
      
      const sizeCompetitors = d3.scaleLinear()
      .domain(d3.extent(<any[]>nodesCompetitors, d => d.matricula))
      .range([10,35])
      
      const linkSize = d3.scaleLinear()
      .domain(d3.extent(<any[]>this.links, d => d.matriculaCompetitor))
      .range([0.5,5])
      
      this.svg
        .attr("height", this.chartHeight+margin.top+margin.bottom)
        .attr("width", this.chartWidth+margin.left+margin.right);
      
      const container = this.svg.select("g.container")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
      container.append("text")
      .attr("font-size", "10")
      .attr("transform", `rotate(90 0,0)`)
      .text("Establecimientos Ed. Media")
      
      container.append("text")
      .attr("font-size", "10")
      .text("Institciones Ed. Superior")
      .attr("transform", `rotate(90 0,${this.chartHeight})`)
      .attr("text-anchor", "end")
      .attr("y", this.chartHeight)
         
      
      var simulationSchools = d3.forceSimulation(this.nodes)
        .velocityDecay(0.1)
        //.force("radial", d3.forceRadial(d => d.type == "competitor" ? 240 : 120, chartWidth/2,chartHeight/2) )
        //.force("repulse", d3.forceManyBody().strength(-140).distanceMax(30).distanceMin(10) )
        .force("collide", d3.forceCollide().radius((d:any) => { 
                return d.type == "competitor" ? sizeCompetitors(d.matricula) : sizeSchools(d.matricula) 
        })
               //.iterations(2)
        )    
        //.force("center", d3.forceCenter(chartWidth/2,chartHeight/2))
      
        //.force("link", d3.forceLink(links).strength(0.1))
        //.force("posX", d3.forceX(d => d.type == "competitor" ? 240 : 120))
        .force("posY", d3.forceY((d:any) => d.type == "competitor" ? this.chartHeight*3/4 : this.chartHeight/4).strength(1))
    
    
        .on("tick", this.ticked.bind(this));
      
    
      
      let competitors = container.selectAll("g.competitor")
        .data(nodesCompetitors)
        
        competitors.exit().remove();
        
        const newCompetitors = competitors.enter().append("g")
        .classed("competitor", true)
        .call(d3.drag()
              //.on("start",dragstarted)
              //.on("drag",dragged)
              //.on("end",dragended)
             );
      
        newCompetitors
        .on("mouseenter", d => this.showLinks(d))
        .on("click", this.setTimestamp)
    
        newCompetitors.append("circle")
        //.attr("r",d => size(d.matricula))
        .attr("r", (d:any) => sizeCompetitors(d.matricula))
        .attr("fill", "white")
        .attr("stroke", "grey")
        .attr("stroke-width", "grey")
      
        newCompetitors.append("image")
        .attr("href",(d:any) => this.dataLogos[d.nomb_inst])
        .attr("width",(d:any) => sizeCompetitors(d.matricula)*2/1.4)
        .attr("x",(d:any) => -sizeCompetitors(d.matricula)*2/1.4/2)
        .attr("y",(d:any) => -sizeCompetitors(d.matricula)*2/1.4/2)
        ;
        
        competitors = newCompetitors.merge(competitors);
    
        let schools = container.selectAll("g.school")
        .data(nodesSchools)
        
        schools.exit().remove();
        
        const newSchools = schools.enter().append("g")
        .classed("school", true)
        .call(d3.drag()
              //.on("start",dragstarted)
              //.on("drag",dragged)
              //.on("end",dragended)
             );
      
        newSchools
        .on("click", this.setTimestamp)
    
        
        newSchools.append("circle")
        .attr("r",(d:any) => sizeSchools(d.matricula))
        .attr("fill", "white")
        .attr("stroke", "darkgrey")
        .attr("strokewidth", 2)
        .on("mouseenter", d => this.showLinks(d))
    
      
        newSchools.append("text")
        .classed("matricula", true)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", 8)
        .attr("dy", 2)
        .text((d:any) => d.matricula)
      
        newSchools.append("text")
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("font-size", 5)
        .attr("dy", 10)
        .text((d:any) => d.nom_rbd)
        
        schools = newSchools.merge(schools);
      
      

    
     

    

    
      
       //draw lines for the links 
       let link = this.linksContainer.selectAll("line")
            .data(this.links)

        link.exit().remove();

        link.enter().append("line")
              .attr("stroke-width", (d:any) => linkSize(d.matriculaCompetitor))
              .style("stroke", "blue");     
        
                
    }

    

  }

  dragstarted(d)
  { 
     //simulationSchools.restart();
     //simulationSchools.alpha(1.0);
     d.fx = d.x;
     d.fy = d.y;
  }

  dragged(d)
  {
     d.fx = d3.event.x;
     d.fy = d3.event.y;
  }

  dragended(d)
  {
     d.fx = null;
     d.fy = null;
     //simulationSchools.alphaTarget(0.1);
  }

  ticked()  {
    const competitorRadius = 30
    const container = this.svg.select("g.container")
    let competitors = container.selectAll("g.competitor")

    competitors
    .attr("transform", (d:any) => {
      const posX = Math.max(competitorRadius, Math.min(this.chartWidth - competitorRadius, d.x))
      const posY = Math.max(this.chartHeight/2 + competitorRadius, Math.min(this.chartHeight - competitorRadius, d.y))
      d.x = posX;
      d.y = posY;
      return `translate(${posX}, ${posY})`
    })
    .attr("opacity", (d:any) => {
      return d.highlight ? 1 : 0.5;
    });


    let schools = container.selectAll("g.school")
    schools
    .attr("transform", (d:any) => {
      const posX = Math.max(competitorRadius, Math.min(this.chartWidth - competitorRadius, d.x))
      const posY = Math.max(competitorRadius, Math.min(this.chartHeight/2 - competitorRadius, d.y))
      d.x = posX;
      d.y = posY;
      return `translate(${posX}, ${posY})`
    })
    .attr("opacity", (d:any) => {
      return d.highlight ? 1 : 0.5;
    });
    ; 
    
    schools.selectAll("text.label")
    .attr("opacity", (d:any) => {
      return d.highlight ? 1 : 0;
    });

    let link = this.linksContainer.selectAll("line")

        //update link positions 
    //simply tells one end of the line to follow one node around
    //and the other end of the line to follow the other node around
    link
        .attr("x1", (d:any) => d.target.x)
        .attr("y1", (d:any) => d.target.y)
        .attr("x2", (d:any) => d.source.x)
        .attr("y2", (d:any) =>  d.source.y)
        .attr("opacity", (d:any) => d.highlighted ? 1 : 0)
        ;
    
  } 

  showLinks(d) {
    // Do not activate if we have recently clicked
    const now = moment(new Date());
    
    if (d.type == "competitor") {
      this.selectedSchool = null;
      this.selectedInstitution = d;
    } else {
      this.selectedSchool = d;
      this.selectedInstitution = null;
    }
        
    if ((now.diff(this.timeStamp)) > 3000) {
      this.nodes.forEach(n => { n.highlight = false;});
      this.links.forEach(l => l.highlighted = false);
      const selectedLinks = this.links.filter(l=> l.target==d || l.source==d);
      
      selectedLinks.forEach(l => {
        l.highlighted = true;
        l.source.highlight = true;
        l.target.highlight = true;
      })
    
      this.selectedLinks = selectedLinks;
      
      this.ticked();

    }
    
   
  }
  setTimestamp() {
    this.timeStamp = moment(new Date());
  }

  ngOnChanges(changes: SimpleChanges) {
    this.processNewUnit(this.unit);
  }
}
