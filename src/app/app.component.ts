import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  ContextMenuItem, ContextMenuService, EditService, EditSettingsModel, ExcelExportService,
  PageService, PdfExportService, ResizeService, SortService, SelectionSettingsModel, ToolbarItems, TreeGridComponent, extendArray, ITreeData
} from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { sampleData } from './datasource';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
    { text: "Copy", target: ".e-content", id: "copy" },
    { text: "Cut", target: ".e-content", id: "cut" },
    { text: "Paste Sibling", target: ".e-content", id: "pasteSib" },
    { text: "Paste Child", target: ".e-content", id: "pasteChild" }
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
  customAttributes: any = null;

  ngOnInit(): void {
    this.data = sampleData; // .concat(sampleData, sampleData);
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    this.customAttributes = { class: 'customcss' };
  }

  ngAfterViewInit() {
    this.selectionOptions = { cellSelectionMode: 'Box', type: 'Multiple', mode: 'Cell' };
    this.editSettings = { allowEditing: false, allowAdding: false, allowDeleting: false };
    this.treeGridObj.dataStateChange.subscribe((args: any) => {
      console.log('daata changed   ', args);
    });
    this.treeGridObj.rowDataBound.subscribe((args: any) => {
      // console.log('cmere eree  ', args);
      if (!(args.data as ITreeData).hasChildRecords) {
        if (this.copiedRecord) {
          if (this.copiedRecord.taskID === args.data.taskID) {
            (args.row as HTMLElement).style.backgroundColor = 'green';
          }
        }
      }
    });

    this.treeGridObj.contextMenuClick.subscribe((a: any, b: any, c: any) => {
      // console.log('came here A ', a.rowInfo);
      // console.log('came here B ', b);
      // console.log('came here C ', c);
      const { id } = a.item;
      let isReload = true;
      const tree = this.treeGridObj as TreeGridComponent;
      const dataSource = extendArray((this.treeGridObj as TreeGridComponent).dataSource as object[]);
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
          this.copiedRecord = null;
          this.copiedRecord = a.rowInfo;
          this.clearSelection();

          (a.rowInfo.row as HTMLElement).style.outline = 'auto';
          (a.rowInfo.row as HTMLElement).style.outlineColor = 'green';
          // (this.treeGridObj as TreeGridComponent).dataSource = dataSource;
          this.treeGridObj.copy();
          break;
        case 'cut':
          isReload = false;
          this.copiedRecord = null;
          this.cutRecord = null;
          this.cutRecord = a.rowInfo;
          this.clearSelection();

          (a.rowInfo.row as HTMLElement).style.outline = 'auto';
          (a.rowInfo.row as HTMLElement).style.outlineColor = 'red';
          this.treeGridObj.copy();
          break;
        case 'pasteSib':
          isReload = false;
          this.pasteSib(a.rowInfo, dataSource);
          break;
        case 'pasteChild':
          isReload = false;
          this.pasteChild(a.rowInfo, dataSource);
          break;
      }
      if (isReload) {
        this.reShuffle = true;
        setTimeout(() => {
          this.reShuffle = false;
        }, 200);
      }
      // this.treeGridObj.refreshColumns();
      // (this.treeGridObj as TreeGridComponent).dataSource = dataSource;
      // (dataSource as object[]).unshift({ TaskID: 99, TaskName: "New Data", StartDate: new Date('02/03/2017'), EndDate: new Date('04/04/2017'), Duration: 10, Priority: "High" }); // Add record.
      // (this.treeGridObj as TreeGridComponent).dataSource = dataSource; // Refresh the TreeGrid.
    });
  }

  clearSelection() {
    const rowList: Array<any> = this.treeGridObj.getRows();
    rowList.forEach((row) => {
      (row as HTMLElement).style.outline = 'none';
      (row as HTMLElement).style.outlineColor = 'none';
    });
  }

  pasteSib(current: any, _dataSource: any) {
    // const current.rowIndex;
    let rowItem = _dataSource.find((a: any) => a.taskID === current.rowData.taskID);
    if (!rowItem) {
      rowItem = _dataSource.find((a: any) => a.taskID === current.rowData.parentItem.taskID);
    }
    if (this.copiedRecord && rowItem) {
      const idxC = _dataSource.indexOf(rowItem);
      if (idxC > -1) {
        (_dataSource as object[]).splice(idxC + 1, 0, this.copiedRecord.rowData.taskData);
        (this.treeGridObj as TreeGridComponent).dataSource = _dataSource;
        this.copiedRecord = null;
      }
    }
    if (this.cutRecord && rowItem) {
      let cutItem = _dataSource.find((a: any) => a.taskID === this.cutRecord.rowData.taskID);
      let isParent = true;
      if (!cutItem) {
        isParent = false;
        cutItem = _dataSource.find((a: any) => a.taskID === this.cutRecord.rowData.parentItem.taskID);
      }
      const idxC = _dataSource.indexOf(rowItem);
      const cutIdx = _dataSource.indexOf(cutItem);
      if (idxC > -1) {
        (_dataSource as object[]).splice(idxC + 1, 0, this.cutRecord.rowData.taskData);
        if (isParent) {
          (_dataSource as object[]).splice(cutIdx, 1);
        } else {
          (_dataSource[cutIdx].subtasks as object[]).splice(cutIdx, 1);
        }
        (this.treeGridObj as TreeGridComponent).dataSource = _dataSource;
        this.cutRecord = null;
      }
    }
  }

  pasteChild(current: any, _dataSource: any) {
    let rowItem = _dataSource.find((a: any) => a.taskID === current.rowData.taskID);
    if (!rowItem) {
      rowItem = _dataSource.find((a: any) => a.taskID === current.rowData.parentItem.taskID);
    }
    if (this.copiedRecord && rowItem) {
      const idxC = _dataSource.indexOf(rowItem);
      if (idxC > -1) {
        (_dataSource[idxC].subtasks as object[]).push(this.copiedRecord.rowData.taskData);
        (this.treeGridObj as TreeGridComponent).dataSource = _dataSource;
        this.copiedRecord = null;
      }
    }

    if (this.cutRecord && rowItem) {
      let cutItem = _dataSource.find((a: any) => a.taskID === this.cutRecord.rowData.taskID);
      let isParent = true;
      if (!cutItem) {
        isParent = false;
        cutItem = _dataSource.find((a: any) => a.taskID === this.cutRecord.rowData.parentItem.taskID);
      }
      const idxC = _dataSource.indexOf(rowItem);
      const cutIdx = _dataSource.indexOf(cutItem);
      if (idxC > -1) {
        (_dataSource[idxC].subtasks as object[]).push(this.cutRecord.rowData.taskData);
        if (cutIdx > -1) {
          if (isParent) {
            (_dataSource as object[]).splice(cutIdx, 1);
          } else {
            (_dataSource[cutIdx].subtasks as object[]).splice(cutIdx, 1);
          }
        }
        (this.treeGridObj as TreeGridComponent).dataSource = _dataSource;
        this.cutRecord = null;
      }
    }
  }

  rowDataBound(args: any) {
    if (!(args.data as ITreeData).hasChildRecords) {
      (args.row as HTMLElement).style.backgroundColor = 'green';
    }
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

