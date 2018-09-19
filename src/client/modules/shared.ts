import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {InputGroupComponent} from '@components/inputgroup/component';
import {LoadingSpinnerComponent} from '@components/loading_spinner/component';

@NgModule({
    imports:[
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    declarations: [
        InputGroupComponent,
        LoadingSpinnerComponent,
    ],
    exports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        InputGroupComponent,
        LoadingSpinnerComponent,
    ]
})
export class SharedModule {}
