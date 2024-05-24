import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../@core/services/api.service';
import { AuthService } from "../../../@core/services/auth.service";
import { NbToastrService } from "@nebular/theme";
import { Settings } from "angular2-smart-table";
import { CategoryCodesDataSource } from '../source-category-codes/source-category-codes-data-source';
import { CategoryCode, ChildrenCategoryCode } from '../../../@core/models/category-code';

export interface SelectedGroupCode {
  code: string
  children: ChildrenCategoryCode[]
  deleteCallback: (code: string, source: string) => Promise<void>
  addCallback: (code: string, source: string) => Promise<void>
}

@Component({
  selector: 'ngx-group-category-codes',
  templateUrl: './group-category-codes.component.html',
  styleUrls: ['./group-category-codes.component.scss'],
})
export class GroupCategoryCodesComponent {
  @Output() selectedGroupCode = new EventEmitter<SelectedGroupCode>(false);
  _selectedGroupCode: SelectedGroupCode

  settings: Settings = {
    actions: {
      custom: [
        {
          name: 'add-code',
          title: '<span class="custom-action activate-icon">EDIT CODES</span>',
          hiddenWhen: () => {
            return this._selectedGroupCode.code !== ""
          },
        },
      ],
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-close"></i>',
    },
    columns: {
      code: {
        title: 'Code',
        isEditable: false,
        isSortable: true,
        isAddable: true,
      },
      description: {
        title: 'Description',
        isEditable: true,
        isSortable: false,
        isAddable: true,
      },
      children: {
        title: 'Codes',
        isEditable: false,
        isSortable: false,
        isAddable: false,
        valuePrepareFunction: (value) => {
          return value.map(v => v.source + "." + v.code).join(", ")
        }
      }
    },
    pager: {
      display: true,
      perPage: 10,
    },
  };

  dataSource: CategoryCodesDataSource;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService,
    private toastrService: NbToastrService,
  ) {
    this.dataSource = new CategoryCodesDataSource(this.http, this.apiService, this.authService, this.toastrService, "group", this.onCustomAction);
    this.selectedGroupCode.subscribe(value => {
      this._selectedGroupCode = value
      this.dataSource.reset()
    })
    this.selectedGroupCode.emit({
      code: '',
      children: [],
      deleteCallback: () => { return Promise.resolve() },
      addCallback: () => { return Promise.resolve() },
    })
  }

  onCustomAction = async (event) => {
    switch (event.action) {
      case 'add-code':
        this.selectedGroupCode.emit({
          code: event.data.code,
          children: event.data.children,
          deleteCallback: (code, source) => this.deleteCallback(event, code, source),
          addCallback: (code, source) => this.addCallback(event, code, source),
        })
        const toast = this.toastrService.warning(
          "CLICK WHEN DONE",
          "Selecting codes for " + event.data.code,
          {
            duration: 0,
            hasIcon: false,
            icon: '',
          }
        )

        toast.onClose().subscribe(async () => {
          this.selectedGroupCode.emit({
            code: '',
            children: [],
            deleteCallback: () => { return Promise.resolve() },
            addCallback: () => { return Promise.resolve() },
          })
        })
        break;
    }
  }

  deleteCallback = async (event: any, code: string, source: string) => {
    await this.apiService.deleteCodeFromCategoryGroup({
      parentCode: event.data.code,
      child: {
        code: code,
        source: source,
      }
    })
    const newData = this.dataSource.categoryCodes.find(c => c.code === event.data.code && c.source === event.data.source)
    newData.children = newData.children.filter(c => c.code !== code || c.source !== source)
    this.dataSource.replaceData(newData)
    this.selectedGroupCode.emit({
      ... this._selectedGroupCode,
      children: newData.children,
    })
  }

  addCallback = async (event: any, code: string, source: string) => {
    await this.apiService.addCodeToCategoryGroup({
      parentCode: event.data.code,
      child: {
        code: code,
        source: source,
      }
    })

    const newData = { ...event.data }
    newData.children.push({
      code: code,
      source: source,
    })
    this.dataSource.replaceData(newData)
    this.selectedGroupCode.emit({
      ... this._selectedGroupCode,
      children: newData.children,
    })
  }
}
