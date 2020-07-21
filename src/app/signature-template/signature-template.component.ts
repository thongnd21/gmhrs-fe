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
import { NzPlacementType } from 'ng-zorro-antd/dropdown';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Signature } from '../model/signature';;


class Rules {
  lengthRule: {
    minLength: number,
    maxLength: number
  }
  listRule: ItemData[]
}
class ItemData {
  id: string;
  content: string;
  action: boolean;
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

  isSetPrimaryDisable = false;
  isSaveRuleDisable = false;
  listRulesCheckErr = new Array();
  listWrongSignature = new Array();
  listSignatureTemplate = new Array();
  topCenterPosition: NzPlacementType = 'topCenter';
  imgWidth = 300;
  imgHeigh = 100;
  imageLink = '';
  signatureName = '';
  insertImgModel = false;
  showCheckErrModel = false;
  showListSignatureTemplate = false;
  showListWrongSignature = false;
  infoToReview: any;
  rules: Rules = {
    lengthRule: {
      minLength: null,
      maxLength: null
    },
    listRule: null
  };
  isDeleteTemplateLoading = false;
  isSetPrimaryTemplateLoading = false;
  isGetAllSignatureLoading = false;
  isSendNotifyRulesLoading = false;
  isShowListWrongSignatureLoading = false;
  isSaveRulesLoading = false;
  isSaveTemplateLoading = false;
  isUpdatedTemplateLoading = false;
  htmlContent = '';
  htmlContentReview = '';
  i = 0;
  editId: string | null = null;
  listOfRules: ItemData[] = [];
  mustContentOrNot = 'Contain this text';

  editorReviewConfig: AngularEditorConfig = {
    editable: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text to review',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName'
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

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
      ['bold'],
      [
        'insertImage',
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
    private modal: NzModalService,
  ) { }
  handleCloseModel(): void {
    this.showCheckErrModel = false;
    this.showListWrongSignature = false;
    this.showListSignatureTemplate = false;
  }
  select(event) {
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    // console.log(start + ', ' + end)
  }
  setPrimaryTemplate(): void {
    this.isSetPrimaryTemplateLoading = true;
    let id = localStorage.getItem('id');
    let data = new Signature();
    data.account_id = id;
    data.name = this.signatureName;
    this.signatureService.setPrimaryTemplate(data).subscribe(
      (res: any) => {
        if (res.status) {
          this.isSetPrimaryDisable = true;
          this.toast.success(res.message);
        } else {
          this.toast.error(res.message);
        }
        this.isSetPrimaryTemplateLoading = false;
      }
    )
  }
  formatNumber(value: string): string {
    const stringValue = `${value}`;
    const list = stringValue.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }
  sendMailRemind(): void {
    this.handleCloseModel();
    this.isShowListWrongSignatureLoading = true;
    let username = localStorage.getItem('username');
    this.signatureService.sendMailRemindEmployees(username).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Send mails success!');
        } else {
          this.toast.error('Some Error!')
        }
        this.isShowListWrongSignatureLoading = false;
      }
    )
  }
  getListWrongSignature(): void {
    this.isShowListWrongSignatureLoading = true;
    let username = localStorage.getItem('username');
    this.signatureService.getListWrongSignature(username).subscribe(
      (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          this.toast.success('There is not employees wrong signature!', 'Wrong signature status', { disableTimeOut: true });
        } else {
          this.listWrongSignature = res;
          this.showListWrongSignature = true;
        }
        this.isShowListWrongSignatureLoading = false;
      })
  }
  showConfirmNotifySignatureRules(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to send notify mail?</i>',
      nzContent: '<b>It will send mail notify to all employees by company gmail.</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.sendMailNotifyRules()
    });
  }
  showConfirmSaveSignatureRules(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to Save this signature rules?</i>',
      nzContent: '<b>If you Save this signature rules, it will save signature rule to database.</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.submitSignatureRules()
    });
  }
  showConfirmUpdateAllSignature(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to Update this signature for all employees NOW?</i>',
      nzContent: '<b>If you Update this signature for all employees NOW, it will update all employees signature immediately.</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.syncSignatureAll()
    });
  }
  showConfirmSaveSignature(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to Save this signature?</i>',
      nzContent: '<b>If name of this signature existed in DB, it will update this siganture template for this name. Else it will create the new one!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.submitSignature()
    });
  }
  sendMailNotifyRules(): void {
    this.isSendNotifyRulesLoading = true;
    let username = localStorage.getItem('username');
    this.signatureService.sendMailRulesChanges(username).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Send mail notify to all employees success!')
        } else {
          this.toast.error('Some error occurs!')
        }
        this.isSendNotifyRulesLoading = false;
      }
    )
  }
  showRulesCheckModel(): void {
    if (this.listRulesCheckErr.length !== 0) {
      this.showCheckErrModel = true;
    } else {
      this.toast.success('There is not error occurs!');
    }
  }
  showModal(): void {
    this.insertImgModel = true;
  }
  insertImghandleOkModel(): void {
    if (this.imageLink === '') {
      this.insertImgModel = false;
    } else {
      this.htmlContent += "<img style='width: " + this.imgWidth + "px; height: " + this.imgHeigh + "px;' src='" + this.imageLink + "' />";
      // console.log('htmlContent: ' + this.htmlContent);
      this.insertImgModel = false;
      this.imageLink = '';
    }

  }
  handleCancelModel(): void {
    this.insertImgModel = false;
    this.imageLink = '';
  }
  changeMustOrNot(rule): void {
    if (rule) {
      this.mustContentOrNot = 'Contain this text';
    } else {
      this.mustContentOrNot = 'Not contain this text';
    }
  }
  loadReview(): void {
    this.htmlContentReview = this.htmlContent;
    // console.log('htmlContentReview: ' + this.htmlContentReview);
    // console.log('htmlContent: ' + this.htmlContent);
    let firstname = this.infoToReview.first_name;
    let lastname = this.infoToReview.last_name;
    let phone = this.infoToReview.phone;
    let personalEmail = this.infoToReview.personal_email;
    this.htmlContentReview = this.htmlContentReview.split('{email}').join(personalEmail);
    this.htmlContentReview = this.htmlContentReview.split('{fullname}').join(firstname + ' ' + lastname);
    this.htmlContentReview = this.htmlContentReview.split('{phoneNumber}').join(phone);
  }
  startEdit(id: string): void {
    this.editId = id;
  }
  stopEdit(): void {
    this.editId = null;
    // console.log(this.listOfRules);
    this.rules.listRule = this.listOfRules;
    // console.log(this.rules);

  }
  submitSignatureRules(): void {
    this.isSaveRulesLoading = true;
    this.rules.listRule = this.listOfRules;
    let username = localStorage.getItem('username');
    // console.log(JSON.stringify(this.rules));
    let template = new Template;
    template.html = JSON.stringify(this.rules);
    this.signatureService.saveSignatureTemplateRules(username, template).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Save signature rules success!');
        } else {
          this.toast.error('Please check signature length!');
        }
        setTimeout(() => {
          this.isSaveRulesLoading = false;
        }, 1000);
      }
    )
  }
  syncSignatureAll(): void {
    this.isUpdatedTemplateLoading = true;
    let username = localStorage.getItem('username');
    let template = new Template;
    template.html = this.htmlContent;
    this.signatureService.updateSignatureForAllEmployees(username, template).subscribe(
      (res: any) => {
        // console.log(res);

        if (res === true) {
          this.toast.success('Update signature to all employees success!');
          this.listRulesCheckErr = [];
        } else {
          for (let mes of res) {
            this.toast.warning(mes, 'Signature template rules check', { disableTimeOut: true });
            this.listRulesCheckErr = res;
          }
        }
        setTimeout(() => {
          this.isUpdatedTemplateLoading = false;
        }, 1000);
      }
    )
  }
  submitSignature(): void {
    this.isSaveTemplateLoading = true;
    let signature = new Signature;
    let id = localStorage.getItem('id');
    signature.name = this.signatureName;
    signature.content = this.htmlContent;
    signature.account_id = id;
    this.signatureService.saveSignatureTemplate(id, signature).subscribe(
      (res: any) => {
        if (res.status === true) {
          this.toast.success(res.message);
          this.listRulesCheckErr = [];
        } else {
          for (let mes of res.message) {
            this.toast.warning(mes, 'Signature template rules check', { disableTimeOut: true });
          }
          this.listRulesCheckErr = res.message;
        }
        setTimeout(() => {
          this.isSaveTemplateLoading = false;
        }, 1000);
      }
    )
  }
  getSignatureTemplateByName(name: any): void {
    this.isGetAllSignatureLoading = true;
    let id = localStorage.getItem('id');
    this.signatureService.getSignatureTemplateByName(id, name).subscribe(
      (res: any) => {
        // console.log('result get by name' + res);

        if (res.status) {
          this.htmlContent = res.data.content;
          this.signatureName = res.data.name;
          this.loadReview();
          this.showListSignatureTemplate = false;
          this.isSetPrimaryDisable = res.data.is_primary > 0;
          this.toast.success('Load sinature name: ' + this.signatureName + ' success!');
        } else {
          this.toast.warning(res.message);
        }
        this.isGetAllSignatureLoading = false;
      }
    )
  }
  deleteSignatureTemplateByName(name: any): void {
    this.isDeleteTemplateLoading = true;
    let id = localStorage.getItem('id');
    this.signatureService.deleteSignatureTemplateByName(id, name).subscribe(
      (res: any) => {
        if (res.status) {
          this.signatureService.getAllsigantureTemplate(id).subscribe(
            (res: any) => {
              if (res.status) {
                this.listSignatureTemplate = res.data;
              } else {
                this.toast.warning(res.message);
              }
            }
          )
          this.toast.success(res.message);
        } else {
          this.toast.warning(res.message);
        }
        this.isDeleteTemplateLoading = false;
      }
    )
  }
  getAllSignature(): void {
    this.isGetAllSignatureLoading = true;
    let id = localStorage.getItem('id');
    this.signatureService.getAllsigantureTemplate(id).subscribe(
      (res: any) => {
        // console.log('list siganture: ' + res);

        if (res.status) {
          this.listSignatureTemplate = res.data;
          this.showListSignatureTemplate = true;
        } else {
          this.toast.warning(res.message);
        }
        this.isGetAllSignatureLoading = false;
      }
    )
  }
  addRow(): void {
    this.listOfRules = [
      ...this.listOfRules,
      {
        id: `${this.i}`,
        content: '',
        action: true
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
    let id = localStorage.getItem('id');
    this.signatureService.getInfoToReview(username).subscribe(
      async (res) => {
        this.infoToReview = res;
        // console.log('Info to review: ' + res);
        if (this.infoToReview != null) {
          this.signatureService.getSignatureTemplate(id).subscribe(
            (res: any) => {
              if (res.status) {
                // console.log('siganture: ' + res);

                this.htmlContent = res.data.content;
                this.signatureName = res.data.name;
                this.isSetPrimaryDisable = res.data.is_primary > 0;
                this.htmlContentReview = this.htmlContent;
                // console.log('htmlContentReview: ' + this.htmlContentReview);
                let firstname = this.infoToReview.first_name;
                let lastname = this.infoToReview.last_name;
                let phone = this.infoToReview.phone;
                let personalEmail = this.infoToReview.personal_email;
                this.htmlContentReview = this.htmlContentReview.split('{email}').join(personalEmail);
                this.htmlContentReview = this.htmlContentReview.split('{fullname}').join(firstname + ' ' + lastname);
                this.htmlContentReview = this.htmlContentReview.split('{phoneNumber}').join(phone);
              } else {
                this.toast.warning(res.message);
              }
            }
          );
        }
      }
    )

  }
  loadRules(): void {
    let id = localStorage.getItem('id');
    this.signatureService.getSignatureTemplateRules(id).subscribe(
      (res) => {
        let rulesJson: any = res;
        // console.log('rulesJson: ' + rulesJson);
        if (rulesJson) {
          this.rules.lengthRule.minLength = rulesJson.lengthRule.minLength;
          this.rules.lengthRule.maxLength = rulesJson.lengthRule.maxLength;
          rulesJson.listRule.forEach(element => {
            this.listOfRules = [
              ...this.listOfRules,
              {
                id: element.id,
                content: element.content,
                action: element.action
              }
            ];
            this.i++;
          });
          // console.log(this.rules);
        }
      }
    );
  }
  ngOnInit(): void {
    this.loadTemplate();
    this.loadRules();

  }
}
