import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RouterModule, ExtraOptions, PreloadAllModules} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '@modules/shared';
import {AppComponent, NotFoundComponent, HeaderComponent, DemoComponent, InputGroupComponent} from '@components/';
import {HttpConnectionInterceptor} from '@services/connection';
import {env} from '@environments/environment';
import { FormsModule } from '@angular/forms';

const routerOptions: ExtraOptions = {
    // enableTracing: !env.isProdMode
    preloadingStrategy: PreloadAllModules
};

@NgModule({
    bootstrap: [
        AppComponent
    ],
    // modules go here
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        FormsModule, 
        RouterModule.forRoot(
            [
                {path: '404', component: NotFoundComponent},
                {path: '', pathMatch: 'full', component: DemoComponent},
                {path: '**', redirectTo: '/404'}
            ], 
            routerOptions
        )
    ],
    // components
    declarations: [
        AppComponent,
        NotFoundComponent,
        HeaderComponent,
        DemoComponent
    
    ],
    // services
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConnectionInterceptor,
            multi: true,
        }
    ]
    
})
export class AppModule {}
