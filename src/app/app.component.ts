import { Component, HostListener } from '@angular/core';
import { ScheduleStorageService } from './share/services/schedule-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(private storage: ScheduleStorageService){}


  @HostListener('window:beforeunload') beforeUnload(){
    this.storage.forceExit();
  }

}
