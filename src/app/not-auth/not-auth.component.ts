import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-not-auth',
  templateUrl: './not-auth.component.html',
  styleUrls: ['./not-auth.component.css']
})
export class NotAuthComponent implements OnInit {

  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

  ngOnInit() {
  }

}
