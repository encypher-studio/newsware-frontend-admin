import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryCodesDataSource } from './source-category-codes-data-source';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../@core/services/api.service';
import { AuthService } from "../../../@core/services/auth.service";
import { NbToastrService } from "@nebular/theme";
import { Settings } from "angular2-smart-table";

@Component({
  selector: 'ngx-source-category-codes',
  templateUrl: './source-category-codes.component.html',
  styleUrls: ['./source-category-codes.component.scss'],
})
export class SourceCategoryCodesComponent implements OnChanges {
  @Input() source: string
  @Input() isSelectingCode: string
  _isSelectingCode: string

  settings: Settings = {
    actions: {
      custom: [
        {
          name: 'add-code',
          title: '<span class="custom-action activate-icon">ADD CODE</span>',
          hiddenWhen: (row) => row.isSelected || this._isSelectingCode === "no"
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
      hiddenWhen: (row) => this._isSelectingCode !== "no"
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
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.source?.currentValue)
      this.dataSource = new CategoryCodesDataSource(this.http, this.apiService, this.authService, this.toastrService, changes.source.currentValue, this.onCustomAction);

    if (changes.isSelectingCode?.currentValue) {
      this.dataSource.getElements().then(data => {
        this.dataSource.load([...data])
      })
      this._isSelectingCode = changes.isSelectingCode.currentValue
    }
  }

  onCustomAction = async (event) => {
    switch (event.action) {
      case 'add-code':
        await this.apiService.addCodeToCategoryGroup({
          parentCode: this.isSelectingCode,
          child: {
            code: event.data.code,
            source: event.data.source,
          }
        })
        this.toastrService.success('Code ' + event.data.code + ' added to group ' + this.isSelectingCode);
        break;
    }
    this.dataSource.replaceData(event.data);
  }
}
