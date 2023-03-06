import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureCatComponent } from './capture-cat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CaptureCatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CaptureCatComponent
  ]
})
export class CaptureCatModule { }
