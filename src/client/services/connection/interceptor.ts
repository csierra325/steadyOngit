import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { ConnectionService } from '@services/connection/service';

@Injectable()
export class HttpConnectionInterceptor implements HttpInterceptor {

    constructor(
        private _connection: ConnectionService
    ){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isOnline = this._connection.isOnline();
        if (!isOnline) {
            return empty();
        } else {
            return next.handle(request);
        }
    }
}
