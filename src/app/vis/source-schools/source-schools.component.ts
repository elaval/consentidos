import { Component, OnInit, Input } from '@angular/core';
import * as _ from "lodash";

@Component({
  selector: 'app-source-schools',
  templateUrl: './source-schools.component.html',
  styleUrls: ['./source-schools.component.css']
})
export class SourceSchoolsComponent implements OnInit {
  @Input()
  unit
  carreraGenerica: any;
  sourceSchools: any;
  groupsByDependencia: any;
  singleStudenSchools: any;
  moreThanOneStudentSchools: any;

  constructor() { }

  ngOnInit() {
    this.unit.getCarreraGenerica()
    .subscribe(d => {
      this.carreraGenerica = d
    })

    this.unit.getSourceSchools()
    .subscribe(data => {
      this.sourceSchools = data;
      
      let schoolsByMatricula = this.schoolsByNumberofStudents(data);

      this.singleStudenSchools = schoolsByMatricula[1] && schoolsByMatricula[1].length || 0;

      let groups = _.groupBy(data, d => d['dependencia2'])

      this.groupsByDependencia = _.map(groups, (items, key) => ({
        dependencia: key,
        schools: items
      }))

      this.moreThanOneStudentSchools = _.sortBy(_.filter(data, d =>d.matricula > 1), d => -d.matricula);

      
    })
  }

  schoolsByNumberofStudents(data) {
    let groups =  _.groupBy(data, d => d['matricula']);

    let array = _.map(groups, (items, matricula) => ({
      matricula: matricula,
      numberOfSchools: items.length
    }))

    return groups

  } 

}
