import { Component, DoCheck, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {
  title: string = 'angular-template';

  constructor() {}

  ngOnInit(): void {}

  ngDoCheck(): void {}
}
