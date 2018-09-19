import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { SubscriberComponent } from '@core/';
import { ConnectionService, ScrollService } from '@services/';

declare var analytics: any;

@Component({
    selector: 'app',
    templateUrl: 'template.html',
    styleUrls: ['./styles.scss'],
    animations: [
        trigger('slideDown', [
          transition(':enter', [
            style({transform: 'translateY(-100%)'}),
            animate(300)
          ]),
          transition(':leave', [
            animate(300, style({transform: 'translateY(-100%)'}))
          ])
        ])
      ]
})
export class AppComponent extends SubscriberComponent implements OnInit {
    online: boolean = true; // default to true to avoid banner-flicker

    constructor(
        private _scroll: ScrollService,
        private _router: Router,
        private _connection: ConnectionService
    ) {
        super();
    }

    ngOnInit() {
        this.addSubscription(
            this._router.events.pipe(
                filter(e => e instanceof NavigationEnd)
            )
            .subscribe((e: NavigationEnd) => {
                this._scroll.scrollToTop();
            })
        );

        this.addSubscription(
            this._connection.observeOnline()
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(
                isOnline => this.online = isOnline
            )
        );
    }
}
