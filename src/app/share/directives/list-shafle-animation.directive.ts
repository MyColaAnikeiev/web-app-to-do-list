import { Directive, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';


/**
 * List element should be on grid and have row index corresponding to 
 * its list position. 
 * 
 * @Input('gridRow') - bind current grid-row value to this input so
 * directive can animate changes using style.top property.
 */
@Directive({
  selector: '[appListShafleAnimation]'
})
export class ListShafleAnimationDirective implements OnInit, OnChanges{
  
  elHeight = 32;

  lastRow = -1;
  @Input('gridRow') curRow: number = -1;

  @HostBinding('style.position') position = 'relative';

  @HostBinding('style.top') top = '0px';

  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.elHeight = (this.element.nativeElement as HTMLElement).getBoundingClientRect().height;
    },0);
  }

  ngOnChanges(changes: SimpleChanges): void {

    if('curRow' in changes){

      if(this.lastRow != -1){
        this.animate(this.lastRow - this.curRow);
      }

      this.lastRow = changes.curRow.currentValue;
    }
  }

  
  animate(shift: number){
    const totalSift = this.elHeight * shift;
    const steps = 10;
    let step = 1;
    let intervalID: ReturnType<typeof setInterval> | undefined; 

   
    intervalID = setInterval(() => {
      this.top = String((totalSift*(steps-step)/steps).toFixed(1)) + 'px';
      step++;

      if(step >= steps){
        this.top = '0px';
        clearInterval(<any>intervalID);
      }
    }, 50);
  }
}
