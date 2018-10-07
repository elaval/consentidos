import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-school-card',
  templateUrl: './school-card.component.html',
  styleUrls: ['./school-card.component.scss']
})
export class SchoolCardComponent implements OnInit {
  @Input()
  school;
  
  constructor() { }

  ngOnInit() {
  }

}
