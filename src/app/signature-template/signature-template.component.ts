import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import { SignatureService } from '../api-services/signature.services';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { parseJSON } from 'jquery';

interface ItemData {
  id: string;
  content: string;
  action: boolean;
  length: number;
}

class Template {
  html: string;
};

@Component({
  selector: 'app-signature-template',
  templateUrl: './signature-template.component.html',
  styleUrls: ['./signature-template.component.css']
})
export class SignatureTemplateComponent implements OnInit {

  isSaveRulesLoading = false;
  isSaveTemplateLoading = false;
  htmlContent = '';
  i = 0;
  editId: string | null = null;
  listOfRules: ItemData[] = [];
  mustContentOrNot = 'Contain this text';

  editorConfig: AngularEditorConfig = {
    editable: true,
    sanitize: true,
    spellcheck: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [''],
      [
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private authenticationService: AuthenService,
    private signatureService: SignatureService,
    private _sanitizer: DomSanitizer,
  ) { }
  changeMustOrNot(rule): void {
    if (rule) {
      this.mustContentOrNot = 'Contain this text';
    } else {
      this.mustContentOrNot = 'Not contain this text';
    }
  }
  startEdit(id: string): void {
    this.editId = id;
  }
  stopEdit(): void {
    this.editId = null;
    console.log(this.listOfRules);

  }
  submitSignatureRules(): void {
    this.isSaveRulesLoading = true;
    let username = localStorage.getItem('username');
    console.log(JSON.stringify(this.listOfRules));
    let template = new Template;
    template.html = JSON.stringify(this.listOfRules);
    this.signatureService.sendSignatureTemplateRules(username, template).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Save signature rules success!');
        } else {
          this.toast.error('Save failed!')
        }
        setTimeout(() => {
          this.isSaveRulesLoading = false;
        }, 1000);
      }
    )
  }
  submitSignature(): void {
    this.isSaveTemplateLoading = true;
    let username = localStorage.getItem('username');
    console.log(this.htmlContent);
    let template = new Template;
    template.html = this.htmlContent;
    this.signatureService.sendSignatureTemplate(username, template).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Update signature success!');
        } else {
          this.toast.error('Update signature fail!')
        }
        setTimeout(() => {
          this.isSaveTemplateLoading = false;
        }, 1000);
      }
    )
  }
  addRow(): void {
    this.listOfRules = [
      ...this.listOfRules,
      {
        id: `${this.i}`,
        content: '',
        action: true,
        length: null
      }
    ];
    this.i++;
  }
  addContent(content): void {
    let closeTag = this.htmlContent.substring(this.htmlContent.lastIndexOf('</'), this.htmlContent.lastIndexOf('>') + 1);
    if (content === 'phone') {
      if (this.htmlContent.lastIndexOf('>') + 1 === this.htmlContent.length) {
        this.htmlContent = this.htmlContent.substring(0, this.htmlContent.lastIndexOf('<'));
        this.htmlContent += '{phoneNumber}' + closeTag;
      } else {
        this.htmlContent += '{phoneNumber}';
      }
    } else if (content === 'email') {
      if (this.htmlContent.lastIndexOf('>') + 1 === this.htmlContent.length) {
        this.htmlContent = this.htmlContent.substring(0, this.htmlContent.lastIndexOf('<'));
        this.htmlContent += '{email}' + closeTag;
      } else {
        this.htmlContent += '{email}';
      }
    } else if (content === 'name') {
      if (this.htmlContent.lastIndexOf('>') + 1 === this.htmlContent.length) {
        this.htmlContent = this.htmlContent.substring(0, this.htmlContent.lastIndexOf('<'));
        this.htmlContent += '{fullname}' + closeTag;
      } else {
        this.htmlContent += '{fullname}';
      }
    }
  }
  deleteRow(id: string): void {
    this.listOfRules = this.listOfRules.filter(d => d.id !== id);
  }
  loadTemplate(): void {
    let username = localStorage.getItem('username');
    this.signatureService.getSignatureTemplate(username).subscribe(
      (res: any) => {
        if (res.status) {
          this.htmlContent = res.html;
        }
      }
    );
  }
  loadRules(): void {
    let username = localStorage.getItem('username');
    this.signatureService.getSignatureTemplateRules(username).subscribe(
      (res) => {
        let rulesJson: any = res;
        console.log('rulesJson: ' + parseJSON(rulesJson));
        if (rulesJson) {
          parseJSON(rulesJson).forEach(element => {
            this.listOfRules = [
              ...this.listOfRules,
              {
                id: element.id,
                content: element.content,
                action: element.action,
                length: element.length
              }
            ];
            this.i++;
          });
          console.log(this.listOfRules);

        }
        if (this.i === 0) {
          this.addRow();
        }
      }
    );
  }
  ngOnInit(): void {
    // this.addRow();
    this.loadTemplate();
    this.loadRules();
  }

}
