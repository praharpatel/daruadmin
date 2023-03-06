import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbNavModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { UIModule } from '../../@shared/ui/ui.module';

import { BlogRoutingModule } from './blog-routing.module';

import { BloglistComponent } from './bloglist/bloglist.component';
import { BloggridComponent } from './bloggrid/bloggrid.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
    declarations: [BloglistComponent, BloggridComponent, DetailComponent],
    imports: [
        CommonModule,
        BlogRoutingModule,
        NgbNavModule,
        NgbTooltipModule,
        UIModule
    ]
})

export class BlogModule { }
