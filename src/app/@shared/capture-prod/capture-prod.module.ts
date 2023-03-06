import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureProdComponent } from './capture-prod.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    CaptureProdComponent
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
    CaptureProdComponent
  ]
})
export class CaptureProdModule { }
