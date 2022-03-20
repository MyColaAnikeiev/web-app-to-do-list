import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: '.app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleListComponent implements OnInit {
  public clockStateOn = true;

  constructor() { }

  ngOnInit(): void {
  }

}
