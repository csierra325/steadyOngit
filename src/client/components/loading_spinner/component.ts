import { Component, AfterViewInit } from '@angular/core';

declare const Snap: any;
declare const mina: any;

@Component({
  selector: 'loading-spinner',
  templateUrl: './template.html'
})
export class LoadingSpinnerComponent implements AfterViewInit { 

    ngAfterViewInit() {
        const spinner = Snap('#loading-svg');
        const circ = spinner.circle(120, 120, 117);
        circ.attr({
            strokeDasharray: 750,
            fill: 'none',
            stroke: '#fff',
            'stroke-width': 7,
            strokeDashoffset: 0,
            'transform': 'rotate(360deg)'
        })

        function throb() {
            Snap.animate(0, 1500, function(value) {
                circ.attr({
                    strokeDashoffset: value,
                    transform: `rotate(${360 - ((360/1500)*value)}deg)`
                });
            }, 2000, mina.linear, throb);
        }
        throb();
    }
}
