import { Directive, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ShafleAnimatonBindingService } from '../services/shafle-animation-binding.service';


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

  lastRow = 1;
  @Input('gridRow') curRow: number = -1;

  @HostBinding('style.position') position = 'relative';
  @HostBinding('style.top') top = '0px';
  @HostBinding('style.zIndex') zindex = '';
  @HostBinding('style.gridRow') gridRow = '';

  remainedShift = 0;

  private animationFunction: null | (() => void) = null;
  

  constructor(private bound: ShafleAnimatonBindingService, private element: ElementRef) {
    this.lastRow = bound.startingRow;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.elHeight = (this.element.nativeElement as HTMLElement).getBoundingClientRect().height;
    },0);
  }
  

  ngOnChanges(changes: SimpleChanges): void {

    if('curRow' in changes){
      this.gridRow = changes.curRow.currentValue;

      if(this.lastRow != -1){
        this.animate(this.lastRow - this.curRow);
      }

      this.lastRow = changes.curRow.currentValue;
    }
  }

  
  animate(shift: number){
    if(shift == 0){
      return;
    }

    const relativeSift = this.elHeight * shift;

    // When animation is unfinished it will continue to new 
    // destination from from place it was at a moment.
    this.remainedShift += relativeSift;

    // This should be set together with style.gridRow before rendering
    // to avoid flickering.
    this.top = String(this.remainedShift.toFixed(1)) + 'px';

    // The farther element is going the more it hovering above any other elements
    this.zindex = String(Math.floor(Math.abs(this.remainedShift))+10);

    if(this.animationFunction){
      this.bound.unregisterAnimation(this.animationFunction);
      this.animationFunction = null;
    }

    this.animationFunction = () => {
      let step = (5 * Math.sign(this.remainedShift)) + (0.08 * this.remainedShift);

      if(Math.abs(step) >= Math.abs(this.remainedShift)){
        this.remainedShift = 0;
        this.top = '0px';
        this.bound.unregisterAnimation(this.animationFunction);
        this.animationFunction = null;
        return;
      }

      this.remainedShift -= step;

      this.top = String(this.remainedShift.toFixed(1)) + 'px';
    };

    this.bound.registerAnimation(this.animationFunction);
  }
}
