import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConfigComponent
  ],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConfigModule { }
