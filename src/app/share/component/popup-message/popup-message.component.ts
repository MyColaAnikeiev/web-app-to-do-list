import { Component, OnInit } from '@angular/core';
import { PopupMessageService } from './popup-message.service';

import { 
  trigger,
  state,
  style,
  animate,
  transition
}
from '@angular/animations'

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
  animations: []
})
export class PopupMessageComponent implements OnInit {


  constructor(private msgService: PopupMessageService) {}

  ngOnInit(): void {
  }
  
}
