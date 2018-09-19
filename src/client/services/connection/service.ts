import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService implements OnDestroy{

    private _connectionStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    private _onlineSub: Subscription;
    private _offlineSub: Subscription;

    constructor(){
        this._offlineSub = fromEvent(window, 'offline', {passive: true})
        .subscribe(
            _ => this._connectionStatusSubject.next(false)
        );

        this._onlineSub = fromEvent(window, 'online', {passive: true})
        .subscribe(
            _ => this._connectionStatusSubject.next(true)
        );
    }

    ngOnDestroy() {
        if (this._onlineSub && this._onlineSub.unsubscribe) {
            this._onlineSub.unsubscribe();
        }
        if (this._offlineSub && this._offlineSub.unsubscribe) {
            this._offlineSub.unsubscribe();
        }
    }

    isOnline(): boolean {
        const online = this._connectionStatusSubject.value;
        return online;
    }

    observeOnline(): Observable<boolean> {
        return this._connectionStatusSubject;
    }
}
