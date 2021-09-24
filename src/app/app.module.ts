import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ContextMenuService, EditService, ExcelExportService, FilterService, FreezeService,
  PageService, PdfExportService, ResizeService, RowDDService, SelectionService, SortService,
  ToolbarService, TreeGridModule
} from '@syncfusion/ej2-angular-treegrid';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    TreeGridModule,
    ButtonModule,
    DropDownListAllModule,
    ContextMenuModule
  ],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    ResizeService,
    ExcelExportService,
    PdfExportService,
    FreezeService, SelectionService,
    EditService, ToolbarService, ContextMenuService,
    FilterService, PageService, SortService, RowDDService],
  bootstrap: [AppComponent]
})
export class AppModule { }
