import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import { TwoFaAuthService } from '../api-services/two-fa-auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { data } from 'jquery';

interface ItemData {
  id: string;
  name: string;
  contain: string;
  action: boolean;
  length: number;
}
interface Food {
  value: string;
  viewValue: string;
}
interface Rule {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-signature-template',
  templateUrl: './signature-template.component.html',
  styleUrls: ['./signature-template.component.css']
})
export class SignatureTemplateComponent implements OnInit {

  selectedValue: string;

  rules: Rule[] = [
    { value: 'contain', viewValue: 'Contain' },
    { value: 'notcontain', viewValue: 'Not Contain' },
    { value: 'none', viewValue: 'None' }
  ];

  action = 'Contain';



  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold'],
      [
        'link',
        'unlink',
        'insertVideo',
      ],
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  htmlContent = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private authenticationService: AuthenService,
    private twoFaAuthService: TwoFaAuthService,
    private _sanitizer: DomSanitizer,
  ) { }

  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
    console.log(this.listOfData);

  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        name: '',
        contain: '',
        action: true,
        length: null
      }
    ];
    this.i++;
  }
  contain(id: string) {
    this.editId = id;
    this.action = 'Contain';
  }
  notContain(id: string) {
    this.editId = id;
    this.action = 'Not Contain';
  }
  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }

  ngOnInit(): void {
    this.addRow();
  }

}
