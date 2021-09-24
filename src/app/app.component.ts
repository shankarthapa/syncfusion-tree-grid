import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  ContextMenuItem, ContextMenuService, EditService, EditSettingsModel, ExcelExportService,
  PageService, PdfExportService, ResizeService, SortService, SelectionSettingsModel, ToolbarItems, TreeGridComponent
} from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { sampleData } from './datasource';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ContextMenuService, PageService, ResizeService, SortService, EditService,
    PdfExportService, ExcelExportService]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Syncfusion-TreeGrid';
  data: any = {};
  filterOptions: any = {};
  editSettings: EditSettingsModel = {};
  selectionOptions: SelectionSettingsModel = {};
  contextMenuItems = [
    { text: "Freeze ON/OFF", target: ".e-columnheader", id: "freeze" },
    { text: "Filter ON/OFF", target: ".e-columnheader", id: "filter" },
    { text: "Multi-Sort ON/OFF", target: ".e-columnheader", id: "sort" },
    { text: "Add/Edit/Delete", target: ".e-columnheader", id: "aed" },
    { text: "Enable Drag & Drop", target: ".e-columnheader", id: "drag" },
    { text: "Resize", target: ".e-columnheader", id: "resize" },

    { text: "Enable Multi Select", target: ".e-content", id: "multi" },
    { text: "Copy", target: ".e-content", id: "copy" }
    // { text: "Cut", target: ".e-content", id: "cut" },
    // { text: "Paste Sibling", target: ".e-content", id: "pasteSib" },
    // { text: "Paste Child", target: ".e-content", id: "pasteChild" }
  ];
  public toolbar: ToolbarItems[] = [];
  @ViewChild('treegrid') treeGridObj = {} as any;

  reShuffle = false;
  frozenCol = 0;
  hasFilter = false;
  hasSorting = false;
  hasToolBar = false;
  hasDragDrop = false;
  hasResize = false;
  hasMultiSelect = false;
  rowDrop = {};
  copiedRecord: any = null;
  cutRecord: any = null;

  ngOnInit(): void {
    this.data = sampleData; // .concat(sampleData, sampleData);
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
  }

  ngAfterViewInit() {
    this.selectionOptions = { cellSelectionMode: 'Box', type: 'Multiple', mode: 'Cell' };
    this.editSettings = { allowEditing: false, allowAdding: false, allowDeleting: false };
    
    this.treeGridObj.contextMenuClick.subscribe((a: any, b: any, c: any) => {
      console.log('came here A ', a);
      const { id } = a.item;
      let isReload = true;
      switch (id) {
        case 'freeze':
          if (this.frozenCol === 0) {
            this.frozenCol = 1;
          } else {
            this.frozenCol = 0;
          }
          break;
        case 'filter':
          this.hasFilter = !this.hasFilter;
          break;
        case 'sort':
          this.hasSorting = !this.hasSorting;
          break;
        case 'aed':
          if (!this.hasToolBar) {
            this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
            this.hasToolBar = true;
          } else {
            this.editSettings = { allowEditing: false, allowAdding: false, allowDeleting: false };
            this.hasToolBar = false;
          }
          break;
        case 'drag':
          this.hasDragDrop = !this.hasDragDrop;
          break;
        case 'resize':
          this.hasResize = !this.hasResize;
          break;
        case 'multi':
          this.hasMultiSelect = !this.hasMultiSelect;
          break;
        case 'copy':
          isReload = false;
          this.cutRecord = null;
          this.copiedRecord = a.rowInfo.rowData;
          this.treeGridObj.copy();
          break;
        case 'cut':
          this.copiedRecord = null;
          this.cutRecord = a.rowInfo.rowData;
          break;
        case 'pasteSib':
          this.pasteSib(a.rowInfo.rowData);
          break;
        case 'pasteChild':
          this.pasteChild();
          break;
      }
      if (isReload) {
        this.reShuffle = true;
        setTimeout(() => {
          this.reShuffle = false;
        }, 200);
      }
      
    });
  }

  pasteSib(current: any) {
    if (this.copiedRecord) {
      const currentParentItem = current.parentItem;
      const currentMatched = this.data.find((a: any) => a.taskID === currentParentItem.taskID);
      if (currentMatched) {
        const idxC = this.data.indexOf(currentMatched);
        this.data.splice(idxC + 1, 0, this.copiedRecord.taskData);
      }
    }
  }

  pasteChild() {

  }

  getMultiSelection() {
    if (this.hasMultiSelect) {
      return this.selectionOptions;
    }
    return null;
  }

  getEditOption() {
    if (this.hasToolBar) {
      return this.toolbar;
    }
    return null;
  }

  getTableData(): Array<any> {
    return sampleData.concat(sampleData, sampleData);
  }
}

