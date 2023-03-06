import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportarComponent } from './importar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LightboxModule } from 'ngx-lightbox';
import { CsvModule } from '@ctrl/ngx-csv';

@NgModule({
  declarations: [
    ImportarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LightboxModule,
    NgbNavModule,
    CsvModule
  ],
  exports: [
    ImportarComponent
  ]
})
export class ImportarModule { }
