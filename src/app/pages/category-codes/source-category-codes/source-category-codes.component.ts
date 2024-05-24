import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryCodesDataSource } from './source-category-codes-data-source';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../@core/services/api.service';
import { AuthService } from "../../../@core/services/auth.service";
import { NbToastrService } from "@nebular/theme";
import { Settings } from "angular2-smart-table";
import { SelectedGroupCode } from '../group-category-codes/group-category-codes.component';

@Component({
  selector: 'ngx-source-category-codes',
  templateUrl: './source-category-codes.component.html',
  styleUrls: ['./source-category-codes.component.scss'],
})
export class SourceCategoryCodesComponent implements OnChanges {
  @Input() source: string
  @Input() selectedGroupCode: SelectedGroupCode
  _selectedGroupCode: SelectedGroupCode = {
    code: "",
    children: [],
    deleteCallback: async (code: string, source: string) => { },
    addCallback: async (code: string, source: string) => { },
  }

  settings: Settings = {
    actions: {
      custom: [
        {
          name: 'add-code',
          title: '<span class="custom-action activate-icon">ADD TO GROUP</span>',
          hiddenWhen: (row) => {
            return this._selectedGroupCode.code === ""
              || this._selectedGroupCode.children.find(child =>
                child.code === row.getData().code && child.source === row.getData().source
              ) !== undefined
          },
        },
        {
          name: 'delete-code',
          title: '<span class="custom-action activate-icon">REMOVE FROM GROUP</span>',
          hiddenWhen: (row) => {
            return this._selectedGroupCode.code === ""
              || this._selectedGroupCode.children.find(child =>
                child.code === row.getData().code && child.source === row.getData().source
              ) === undefined
          },
        },
      ],
    },
    add: {
      hiddenWhen: () => true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
      hiddenWhen: () => this._selectedGroupCode.code !== ""
    },
    delete: {
      hiddenWhen: () => true
    },
    columns: {
      code: {
        title: 'Code',
        isEditable: false,
        isSortable: true,
        isAddable: false,
      },
      source: {
        title: 'Source',
        isEditable: false,
        isSortable: true,
        isAddable: false,
      },
      description: {
        title: 'Description',
        isEditable: true,
        isSortable: false,
        isAddable: true,
      },
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
    private zone: NgZone,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.source?.currentValue)
      this.dataSource = new CategoryCodesDataSource(this.http, this.apiService, this.authService, this.toastrService, changes.source.currentValue, this.onCustomAction);

    if (changes.selectedGroupCode?.currentValue) {
      console.log("CHANGED", changes.selectedGroupCode?.currentValue)
      this._selectedGroupCode = changes.selectedGroupCode?.currentValue
      this.dataSource.reset()
    }
  }

  onCustomAction = async (event) => {
    switch (event.action) {
      case 'add-code':
        await this._selectedGroupCode.addCallback(event.data.code, event.data.source)
        this.toastrService.success("", event.data.code + ' added to group ' + this.selectedGroupCode.code);
        this.dataSource.replaceData(event.data);
        break;
      case 'delete-code':
        await this.selectedGroupCode.deleteCallback(event.data.code, event.data.source)
        this.toastrService.danger("", event.data.code + ' removed from group ' + this.selectedGroupCode.code, { icon: "" });
        break;
    }
  }
}
