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
import { PopupMessage } from './popup-message.interface';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
  animations: [
    trigger('popup', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.6s', style({ opacity: 1 }))
      ]),
      transition(':leave, * => 3', [
        animate('0.4s', style({ opacity: 0 }))
      ]),
      transition(':increment', [
        style({ opacity: 0.4, transform: 'translateY(-60px)' }),
        animate('0.4s', style({ opacity: 1, transform: 'translateY(0)'}))
      ])
    ])
  ]
})
export class PopupMessageComponent implements OnInit {

  displayedMessages: PopupMessage[] = [];

  constructor(private msgService: PopupMessageService) {}

  ngOnInit(): void {
    this.msgService.getMessageStream()
      .subscribe( (msg: PopupMessage) => {
        this.displayedMessages.unshift(msg);
        
        setTimeout(() => {
          const curInd = this.displayedMessages.findIndex(el => el == msg);
          this.displayedMessages.splice(curInd, 1);
        }, 4000)
      })
  }
  
}
