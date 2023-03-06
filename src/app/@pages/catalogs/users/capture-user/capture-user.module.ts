import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureUserComponent } from './capture-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    CaptureUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    BrowserModule,
    NgbDropdownModule,
    ReactiveFormsModule
  ],
  exports: [
    CaptureUserComponent
  ]
})
export class CaptureUserModule { }
