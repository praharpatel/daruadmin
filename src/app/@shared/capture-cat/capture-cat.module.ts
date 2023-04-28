import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureCatComponent } from './capture-cat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DropzoneModule } from 'ngx-dropzone-wrapper';

@NgModule({
  declarations: [
    CaptureCatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgSelectModule,
    NgxDropzoneModule,
    DropzoneModule,
    NgbCarouselModule
  ],
  exports: [
    CaptureCatComponent
  ]
})
export class CaptureCatModule { }
