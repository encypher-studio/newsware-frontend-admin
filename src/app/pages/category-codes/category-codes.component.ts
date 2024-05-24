import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../@core/services/api.service';
import { AuthService } from "../../@core/services/auth.service";
import { NbToastrService } from "@nebular/theme";
import { Settings } from "angular2-smart-table";
import { Source } from '../../@core/models/source';

@Component({
  selector: 'ngx-category-codes',
  templateUrl: './category-codes.component.html',
  styleUrls: ['./category-codes.component.scss'],
})
export class CategoryCodesComponent {
  isSelectingCode: string
  selectedSource = ""
  settings: Settings = {
    add: {
      hiddenWhen: () => true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
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

  sources: Source[]

  constructor(
    private apiService: ApiService,
  ) {
    this.apiService.getSources().then(res => {
      this.sources = res.data
      if (this.sources.length > 0) this.selectedSource = this.sources[0].code
    })
  }

  isSelected(source: Source) {
    return source.code !== this.selectedSource
  }

  handleIsSelectingCodeEvent(isSelectingCode: string) {
    this.isSelectingCode = isSelectingCode
  }
}
