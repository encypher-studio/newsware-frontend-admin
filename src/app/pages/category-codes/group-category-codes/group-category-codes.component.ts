import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../@core/services/api.service';
import { AuthService } from "../../../@core/services/auth.service";
import { NbToastrService } from "@nebular/theme";
import { Settings } from "angular2-smart-table";
import { CategoryCodesDataSource } from '../source-category-codes/source-category-codes-data-source';

@Component({
  selector: 'ngx-group-category-codes',
  templateUrl: './group-category-codes.component.html',
  styleUrls: ['./group-category-codes.component.scss'],
})
export class GroupCategoryCodesComponent {
  @Output() isSelectingCode = new EventEmitter<string>(false);
  _isSelectingCode: string

  settings: Settings = {
    actions: {
      custom: [
        {
          name: 'add-code',
          title: '<span class="custom-action activate-icon">ADD CODE</span>',
          hiddenWhen: () => {
            return this._isSelectingCode !== "no"
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
    this.isSelectingCode.subscribe(value => this._isSelectingCode = value)
    this.isSelectingCode.emit("no")
  }

  onCustomAction = async (event) => {
    switch (event.action) {
      case 'add-code':
        this.isSelectingCode.emit(event.data.code)
        const toast = this.toastrService.warning(
          "CLICK WHEN DONE",
          "Selecting codes for " + event.data.code,
          {
            duration: 0,
            hasIcon: false,
            icon: '',
          }
        )

        toast.onClose().subscribe(() => {
          console.log("CLOSED")
          this.isSelectingCode.emit("no")
        })
        event.data.apikey = '';
        break;
    }
    this.dataSource.replaceData(event.data);
  }
}
