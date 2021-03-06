import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SignatureService } from '../api-services/signature.services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzPlacementType } from 'ng-zorro-antd/dropdown';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Signature } from '../model/signature';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

class DepartmentSpec {
  id: number;
  name: string;
  status: boolean;
}
class PositionSpec {
  id: number;
  name: string;
  status: boolean;
}
class TeamSpec {
  id: number;
  name: string;
  status: boolean;
}
class EmployeeSpec {
  id: number;
  name: string;
  status: boolean;
}
class SpecRuleCheck {
  idSpec: number;
  signature_id: number;
  specificBy: string;
  allSignature: Signature[]
  department: DepartmentSpec[];
  position: PositionSpec[];
  team: TeamSpec[];
  // employee: EmployeeSpec[];
}
class Rules {
  lengthRule: {
    minLength: number,
    maxLength: number
  }
  listRule: ItemData[]
}
class ItemData {
  id: number;
  content: string;
  action: string;
}
class WrongSignatureEmployee {
  email: string;
  firstName: string;
  lastName: string;
  message: string[];
}
class DynamicRule {
  name: string;
  content: string;
}
@Component({
  selector: 'app-signature-template',
  templateUrl: './signature-template.component.html',
  styleUrls: ['./signature-template.component.css']
})
export class SignatureTemplateComponent implements OnInit {

  isUploadGsuiteKeyFile = true;
  isSpinning = false;
  isSetPrimaryDisable = false;
  isSaveRuleDisable = false;
  isSaveTemplateDisable = false;
  isSetPrimaryRuleDisable = false;
  dynamicRule = new Array<DynamicRule>();
  listEmployeeSpecificApply = new Array();
  listRulesCheckErr = new Array<String>();
  listWrongSignature = new Array<WrongSignatureEmployee>();
  listSignatureTemplate = new Array<Signature>();
  listSignatureTemplateRule = new Array<Signature>();
  topCenterPosition: NzPlacementType = 'topCenter';
  imgWidth = 100;
  imgHeigh = 100;
  imageLink = '';
  signatureName = '';
  signatureID = '';
  signatureRuleName = '';
  signatureRuleID = '';
  is_primary_rule = 0;
  insertImgModel = false;
  showSpecificEmployeeModel = false;
  showSpecificModel = false;
  showCheckErrModel = false;
  showListSignatureTemplate = false;
  showListSignatureTemplateRule = false;
  showListWrongSignature = false;
  infoToReview: {
    primary_email: null,
    first_name: null,
    last_name: null,
    phone: null,
    position_in_company: any
  };

  rules: Rules = {
    lengthRule: {
      minLength: null,
      maxLength: null
    },
    listRule: null
  };
  isTableSpecificLoading = false;
  isSetPrimaryTemplateRuleLoading = false;
  isGetAllSignatureRuleLoading = false;
  isDeleteTemplateRuleLoading = false;
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
  indexPoniterRule = null;
  currentEditID = null;
  i = 0;
  idSpec = 0;
  editId: string | null = null;
  listOfSpecTemplate = {
    allDepartment: new Array(),
    allPosition: new Array(),
    allEmployee: new Array(),
    allTeam: new Array(),
    allSignature: new Array(),
    allSupportSpecific: new Array(),
    specRuleCheck: new Array<SpecRuleCheck>()
  }

  listOfRules: ItemData[] = [];
  mustContentOrNot = 'Contain this text';

  editorReviewConfig: AngularEditorConfig = {
    editable: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text to review',
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
    sanitize: false,
    spellcheck: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    toolbarHiddenButtons: [
      [],
      [
        'insertImage',
        'insertVideo',
        'customClasses'
      ],
    ],
  };

  constructor(
    private toast: ToastrService,
    private signatureService: SignatureService,
    private modal: NzModalService,
    private router: Router
  ) { }
  clearDataSignature(): void {
    this.signatureID = '';
    this.signatureName = '';
    this.htmlContent = '';
    this.htmlContentReview = '';
    // this.toast.success('New signature successfully!')
  }
  clearDataSignatureRule(): void {
    this.signatureRuleID = '';
    this.signatureRuleName = '';
    this.rules.lengthRule.maxLength = 0;
    this.rules.lengthRule.minLength = 0;
    this.rules.listRule = [];
    this.listOfRules = [];
    // this.toast.success('New signature rule successfully!')
  }
  showConfirmUpdateOnlyWrong(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure?</i>',
      nzContent: '<b>It will update signature for only wrong signature employees in the list!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.updateSignatureForOnyWrongEmployee()
    });
  }
  updateSignatureForOnyWrongEmployee(): void {
    this.showListWrongSignature = false;
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.updateSignatureForOnlyWrongEmployee(id).subscribe(
      (res: any) => {
        if (res.status) {
          this.toast.success(res.message);
          this.listRulesCheckErr = [];
        } else {
          if (res.message[0].signatureName !== undefined) {
            this.toast.error('You signature template not follow the rule, please check notification', 'Signature template rules check');
            this.listRulesCheckErr = res.message;
          } else {
            this.toast.error(res.message);
          }
        }
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )
  }
  showEmployeeSpecific(specificBy, specID): void {
    this.isTableSpecificLoading = true;
    let listEm = new Map();
    if (specificBy === 'department') {
      for (let spec of this.listOfSpecTemplate.specRuleCheck) {
        if (spec.idSpec === specID) {
          for (let de of spec.department) {
            for (let em of this.listOfSpecTemplate.allEmployee) {
              if (de.status) {
                if (em.department_id === de.id) {
                  listEm.set(em, em);
                }
              }
            }
          }
        }
      }
    } else if (specificBy === 'position') {
      for (let spec of this.listOfSpecTemplate.specRuleCheck) {
        if (spec.idSpec === specID) {
          for (let po of spec.position) {
            for (let em of this.listOfSpecTemplate.allEmployee) {
              if (po.status) {
                if (em.position_id === po.id) {
                  listEm.set(em, em);
                }
              }
            }
          }
        }
      }
    } else if (specificBy === 'team') {
      for (let spec of this.listOfSpecTemplate.specRuleCheck) {
        if (spec.idSpec === specID) {
          for (let team of spec.team) {
            for (let em of this.listOfSpecTemplate.allEmployee) {
              if (team.status) {
                for (let teamOfEm of em.team_employees) {
                  if (teamOfEm.team_id === team.id) {
                    listEm.set(em, em);
                  }
                }
              }
            }
          }
        }
      }
    }
    // else if (specificBy === 'employee') {
    //   for (let spec of this.listOfSpecTemplate.specRuleCheck) {
    //     if (spec.idSpec === specID) {
    //       for (let em of spec.employee) {
    //         if (em.status) {
    //           listEm.set(em, em);
    //         }
    //       }
    //     }
    //   }
    // }
    this.listEmployeeSpecificApply = Array.from(listEm.values());
    this.showSpecificEmployeeModel = true;
    this.isTableSpecificLoading = false;
  }
  closeEmployeeSpecific(): void {
    this.showSpecificEmployeeModel = false;
    this.listEmployeeSpecificApply = [];
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfSpecTemplate.specRuleCheck, event.previousIndex, event.currentIndex);
  }
  loadSpecificBy(specNum, idSpec): void {
    if (specNum !== 'department') {
      for (let spec of this.listOfSpecTemplate.specRuleCheck) {
        if (spec.idSpec === idSpec) {
          for (let po of spec.position) {
            po.status = false;
          }
        }
      }
    } else {
      for (let spec of this.listOfSpecTemplate.specRuleCheck) {
        if (spec.idSpec === idSpec) {
          for (let de of spec.department) {
            de.status = false;
          }
        }
      }
    }
  }
  loadSpecificRuleCheck(): void {
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.getSpecificRule(id).subscribe(
      (res: any) => {
        if (res.status) {
          this.listOfSpecTemplate = res.data;
          if (this.listOfSpecTemplate.allSignature.length === 0) {
            this.toast.error('You do not have any signature!');
          } else {
            for (let specRow of this.listOfSpecTemplate.specRuleCheck) {
              specRow.idSpec = this.idSpec;
              this.idSpec++;
            }
            this.showSpecificModel = true;
          }
        } else {
          this.toast.error(res.message);
        }
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )
  }
  handleCloseModel(): void {
    this.showCheckErrModel = false;
    this.showListWrongSignature = false;
    this.showListSignatureTemplate = false;
    this.showListSignatureTemplateRule = false;
    this.showSpecificModel = false;
  }
  // select(event) {
  // const start = event.target.selectionStart;
  // const end = event.target.selectionEnd;
  // let s = window.getSelection();
  // alert(s.anchorOffset)
  // console.log('editor: ' + s.anchorNode);
  // console.log('range: ' + s.getRangeAt(0));
  // }
  showConfirmSetPrimaryTemplate(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure?</i>',
      nzContent: '<b>Set primary will automatic save!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.setPrimaryTemplate()
    });
  }
  setPrimaryTemplate(): void {
    this.isSetPrimaryTemplateLoading = true;
    this.isSpinning = true;
    let signature = new Signature;
    let id = localStorage.getItem('id');
    signature.id = this.signatureID;
    signature.name = this.signatureName;
    signature.content = this.htmlContent;
    signature.account_id = id;
    this.signatureService.updateSignatureTemplate(id, signature).subscribe(
      (res: any) => {
        let respone = {
          action: '',
          message: null,
          status: null,
          id: null
        }
        respone = res;
        if (respone.status === true) {
          // this.toast.success(respone.message);
          this.isSetPrimaryDisable = false;
          // set primary
          let data = new Signature();
          data.id = this.signatureID;
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
            }
          )
          //
          this.listRulesCheckErr = [];
        } else {
          if (respone.message[0].signatureName !== undefined) {
            this.toast.error('You signature template not follow the rule, please check notification', 'Signature template rules check');
            this.listRulesCheckErr = respone.message;
          } else {
            this.toast.error(respone.message);
          }
        }
        this.isSetPrimaryTemplateLoading = false;
        this.isSaveTemplateLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isSetPrimaryTemplateLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  showConfirmSetPrimaryTemplateRule(): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure?</i>',
      nzContent: '<b>Set primary will automatic save!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.setPrimaryTemplateRule()
    });
  }
  setPrimaryTemplateRule(): void {
    this.isSetPrimaryTemplateRuleLoading = true;
    this.isSpinning = true;
    this.rules.listRule = this.listOfRules;
    let id = localStorage.getItem('id');
    let signature = new Signature();
    signature.is_primary = this.is_primary_rule;
    signature.id = this.signatureRuleID;
    signature.account_id = id;
    signature.content = JSON.stringify(this.rules);
    signature.name = this.signatureRuleName;
    this.signatureService.updateSignatureTemplateRules(signature).subscribe(
      (res: any) => {
        if (res.status) {
          // this.toast.success(res.message);
          this.signatureRuleID = res.id;
          //set primary
          let data = new Signature();
          data.id = this.signatureRuleID;
          data.account_id = localStorage.getItem('id');
          data.name = this.signatureRuleName;
          this.signatureService.setPrimaryTemplateRule(data).subscribe(
            (res: any) => {
              if (res.status) {
                this.isSetPrimaryRuleDisable = true;
                this.is_primary_rule = 1;
                this.toast.success(res.message);
              } else {
                this.toast.error(res.message);
              }
            },
            (err) => {
              console.log(err);
              this.isSpinning = false;
              this.isSetPrimaryTemplateRuleLoading = false;
              this.toast.error("Connection timeout!")
            }
          )
          // 
        } else {
          this.toast.error(res.message);
        }
        this.isSaveRulesLoading = false;
        this.isSpinning = false;
        this.isSetPrimaryTemplateRuleLoading = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isSetPrimaryTemplateRuleLoading = false;
        this.toast.error("Connection timeout!")
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
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.sendMailRemindEmployees(id).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Send mails successfully!');
        } else {
          this.toast.error('Some Error!')
        }
        this.isShowListWrongSignatureLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isShowListWrongSignatureLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  getListWrongSignature(): void {
    this.isShowListWrongSignatureLoading = true;
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.getListWrongSignature(id).subscribe(
      (res: any) => {
        // console.log(res);
        if (res.status) {
          this.toast.success('There is not employees wrong signature!', 'Wrong signature status');
        } else {
          if (res.data !== undefined) {
            this.listWrongSignature = res.data;
            this.showListWrongSignature = true;
          } else {
            this.toast.error(res.message)
          }
        }
        this.isShowListWrongSignatureLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isShowListWrongSignatureLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  saveSpecTemplate(): void {
    this.isSpinning = true;
    this.showSpecificModel = false;
    let id = localStorage.getItem('id');
    let data = {
      id: id,
      template_spec: this.listOfSpecTemplate.specRuleCheck
    }
    this.signatureService.saveSpecSignature(data).subscribe(
      (res: any) => {
        if (res.status) {
          this.toast.success(res.message);
        } else {
          this.toast.error(res.message);
        }
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )
  }
  showConfirmSaveSpecTem(): void {
    console.log("spec rule: " + this.listOfSpecTemplate.specRuleCheck);

    for (let spec of this.listOfSpecTemplate.specRuleCheck) {
      let check = false;
      for (let de of spec.department) {
        if (de.status) {
          check = true;
        }
      }
      for (let po of spec.position) {
        if (po.status) {
          check = true;
        }
      }
      for (let team of spec.team) {
        if (team.status) {
          check = true;
        }
      }
      // for (let em of spec.employee) {
      //   if (em.status) {
      //     check = true;
      //   }
      // }
      if (!check) {
        this.toast.error('Please select value to save!');
        return;
      }
    }
    this.modal.confirm({
      nzTitle: '<i>Are you sure?</i>',
      nzContent: '<b>Do you want to save this rules!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.saveSpecTemplate()
    });
  }
  showConfirmDeleteSigantureRule(id, name): void {
    this.modal.confirm({
      nzTitle: '<i>Are you sure?</i>',
      nzContent: '<b>If you delete, it will not be recovered!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.deleteSignatureTemplateRuleByID(id, name)
    });
  }
  showConfirmDeleteSiganture(name) {
    this.modal.confirm({
      nzTitle: '<i>Are you sure?</i>',
      nzContent: '<b>If you delete, it will not be recovered!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.deleteSignatureTemplateByName(name)
    });
  }
  showConfirmNotifySignatureRules(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to send notify mail?</i>',
      nzContent: '<b>It will send mail notify to all employees by company gmail.</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.sendMailNotifyRules()
    });
  }
  showConfirmNewSignatureRules(): void {
    if (this.signatureRuleName === '' || this.rules.listRule === null) {
      this.toast.error('Please input rule name and rule content!');
      return;
    } else if (this.rules.listRule.length === 0) {
      this.toast.error('Please input rule data table!');
      return;
    } else if (this.rules.lengthRule.maxLength <= this.rules.lengthRule.minLength) {
      this.toast.error('Please check maximun and minimum length!');
      return;
    }
    for (let rule of this.rules.listRule) {
      if (rule.content === '') {
        this.toast.error('Content of rule can not blank!');
        return;
      }
    }
    this.modal.confirm({
      nzTitle: '<i>Do you Want to create a new signature rule?</i>',
      nzContent: '<b>It will create new signature rule!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.newSignatureRules()
    });
  }
  showConfirmUpdateSignatureRules(): void {
    if (this.signatureRuleName === '' || this.rules.listRule === null) {
      this.toast.error('Please input rule name and rule content!');
      return;
    } else if (this.rules.listRule.length === 0) {
      this.toast.error('Please input rule data table!');
      return;
    } else if (this.rules.lengthRule.maxLength <= this.rules.lengthRule.minLength) {
      this.toast.error('Please check maximun and minimum length!');
      return;
    }
    for (let rule of this.rules.listRule) {
      if (rule.content === '') {
        this.toast.error('Content of rule can not blank!');
        return;
      }
    }
    this.modal.confirm({
      nzTitle: '<i>Do you Want to update this signature rule?</i>',
      nzContent: '<b>It will update this signature rule!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.updateSignatureRules()
    });
  }
  showConfirmUpdateAllSignature(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to Update signature for all employees NOW?</i>',
      nzContent: '<b>It will update signature for all employees base on specific rules first. If employees are not in specific rule, their signature will update base on template <b>default</b> .</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.syncSignatureAll()
    });
  }
  showConfirmNewSignature(): void {
    if (this.signatureName === '') {
      this.toast.error('Input signature name!');
      return;
    } else if (this.htmlContent === '') {
      this.toast.error('Input signature template content!');
      return;
    }
    this.modal.confirm({
      nzTitle: '<i>Do you want to new signature?</i>',
      nzContent: '<b>It will create a new signature template!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.newSignature()
    });
  }
  showConfirmUpdateSignature(): void {
    if (this.signatureName === '') {
      this.toast.error('Input signature name!');
      return;
    } else if (this.htmlContent === '') {
      this.toast.error('Input signature template content!');
      return;
    }
    this.modal.confirm({
      nzTitle: '<i>Do you want to new signature?</i>',
      nzContent: '<b>It will update this signature template!</b>',
      nzOkText: "OK, do it!",
      nzOnOk: () => this.updateSignature()
    });
  }
  sendMailNotifyRules(): void {
    this.isSendNotifyRulesLoading = true;
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.sendMailRulesChanges(id).subscribe(
      (res: any) => {
        if (res.status) {
          this.toast.success('Send mail notify to all employees successfully!')
        } else {
          this.toast.error(res.message)
        }
        this.isSendNotifyRulesLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isSendNotifyRulesLoading = false;
        this.toast.error("Connection timeout!")
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
  showInsertImgModal(): void {
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
    if (this.infoToReview !== null) {
      this.htmlContentReview = this.htmlContent;
      // console.log('htmlContentReview: ' + this.htmlContentReview);
      // console.log('htmlContent: ' + this.htmlContent);
      let firstname = this.infoToReview.first_name;
      let lastname = this.infoToReview.last_name;
      let phone = this.infoToReview.phone;
      let position = this.infoToReview.position_in_company.name;
      let primary_email = this.infoToReview.primary_email;
      this.htmlContentReview = this.htmlContentReview.split('{email}').join(primary_email);
      this.htmlContentReview = this.htmlContentReview.split('{name}').join(firstname + ' ' + lastname);
      this.htmlContentReview = this.htmlContentReview.split('{phone}').join(phone);
      this.htmlContentReview = this.htmlContentReview.split('{position}').join(position);
      // this.toast.success('Load review successfully!');
    } else {
      this.toast.error('You have not synchronized data!')
    }

  }
  addDynamicContentRule(addContent): void {
    if (this.rules.listRule !== null) {
      addContent = '{' + addContent + '}';
      for (let rule of this.rules.listRule) {
        if (rule.id === this.currentEditID) {
          let currentContent = rule.content;
          let pre = currentContent.substring(0, this.indexPoniterRule);
          let sub = currentContent.substring(this.indexPoniterRule, currentContent.length);
          rule.content = pre + addContent + sub;
        }
      }
    } else {
      this.toast.info('Please select a rule!');
    }

  }
  startEdit(id: string, event): void {
    this.editId = id;
    console.log(this.rules.listRule);
    this.indexPoniterRule = event.target.selectionStart;
    console.log('start: ' + this.indexPoniterRule);
    this.currentEditID = id;
  }
  stopEdit(): void {
    this.editId = null;
    // console.log(this.listOfRules);
    this.rules.listRule = this.listOfRules;
    // console.log(this.rules);

  }
  newSignatureRules(): void {
    this.isSaveRulesLoading = true;
    this.isSpinning = true;
    this.rules.listRule = this.listOfRules;
    let id = localStorage.getItem('id');
    let signature = new Signature();
    signature.is_primary = this.is_primary_rule;
    signature.account_id = id;
    signature.content = JSON.stringify(this.rules);
    signature.name = this.signatureRuleName;
    this.signatureService.newSignatureTemplateRules(signature).subscribe(
      (res: any) => {
        if (res.status) {
          this.toast.success(res.message);
          this.signatureRuleID = res.id;
          this.is_primary_rule = 0;
          this.isSetPrimaryRuleDisable = false;
        } else {
          this.toast.error(res.message);
        }
        this.isSaveRulesLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isSaveRulesLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  updateSignatureRules(): void {
    this.isSpinning = true;
    this.rules.listRule = this.listOfRules;
    let id = localStorage.getItem('id');
    let signature = new Signature();
    signature.is_primary = this.is_primary_rule;
    signature.id = this.signatureRuleID;
    signature.account_id = id;
    signature.content = JSON.stringify(this.rules);
    signature.name = this.signatureRuleName;
    this.signatureService.updateSignatureTemplateRules(signature).subscribe(
      (res: any) => {
        if (res.status) {
          this.signatureRuleID = res.id;
          this.toast.success(res.message);
        } else {
          this.toast.error(res.message);
        }
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )
  }
  syncSignatureAll(): void {
    this.isUpdatedTemplateLoading = true;
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.updateSignatureForAllEmployees(id).subscribe(
      (res: any) => {
        // console.log(res);
        if (res.status) {
          this.toast.success(res.message);
          this.listRulesCheckErr = [];
        } else {
          if (res.message[0].signatureName !== undefined) {
            this.toast.error('You signature template not follow the rule, please check notification', 'Signature template rules check');
            this.listRulesCheckErr = res.message;
          } else {
            this.toast.error(res.message);
          }
        }
        this.isUpdatedTemplateLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isUpdatedTemplateLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  newSignature(): void {
    this.isSaveTemplateLoading = true;
    this.isSpinning = true;
    let signature = new Signature;
    let id = localStorage.getItem('id');
    signature.name = this.signatureName;
    signature.content = this.htmlContent;
    signature.account_id = id;
    this.signatureService.newSignatureTemplate(id, signature).subscribe(
      (res: any) => {
        let respone = {
          action: '',
          message: null,
          status: null,
          id: null
        }
        respone = res;
        if (respone.status === true) {
          this.toast.success(respone.message);
          this.signatureID = respone.id;
          this.isSetPrimaryDisable = false;
          this.listRulesCheckErr = [];
        } else {
          if (respone.message[0].signatureName !== undefined) {
            this.toast.error('You signature template not follow the rule, please check notification', 'Signature template rules check');
            this.listRulesCheckErr = respone.message;
          } else {
            this.toast.error(respone.message);
          }
        }
        this.isSaveTemplateLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isSaveTemplateLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  updateSignature(): void {
    this.isSpinning = true;
    let signature = new Signature;
    let id = localStorage.getItem('id');
    signature.name = this.signatureName;
    signature.id = this.signatureID;
    signature.content = this.htmlContent;
    signature.account_id = id;
    this.signatureService.updateSignatureTemplate(id, signature).subscribe(
      (res: any) => {
        let respone = {
          action: '',
          message: null,
          status: null,
          id: null
        }
        respone = res;
        if (respone.status === true) {
          this.toast.success(respone.message);
          this.listRulesCheckErr = [];
        } else {
          if (respone.message[0].signatureName !== undefined) {
            this.toast.error('You signature template not follow the rule, please check notification', 'Signature template rules check');
            this.listRulesCheckErr = respone.message;
          } else {
            this.toast.error(respone.message);
          }
        }
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )
  }
  getSignatureTemplateByName(name: any): void {
    this.isGetAllSignatureLoading = true;
    this.showListSignatureTemplate = false;
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.getSignatureTemplateByName(id, name).subscribe(
      (res: any) => {
        // console.log('result get by name' + res);
        if (res.status) {
          let signature = new Signature();
          signature = res.data;
          this.htmlContent = signature.content;
          this.signatureName = signature.name;
          this.signatureID = signature.id;
          this.loadReview();
          this.showListSignatureTemplate = false;
          this.isSetPrimaryDisable = signature.is_primary > 0;
          this.toast.success('Load signature: ' + this.signatureName + ' successfully!');
        } else {
          this.toast.error(res.message);
        }
        this.isGetAllSignatureLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isGetAllSignatureLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  deleteSignatureTemplateByName(name: any): void {
    this.isDeleteTemplateLoading = true;
    this.showListSignatureTemplate = false;
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.deleteSignatureTemplateByName(id, name).subscribe(
      (res: any) => {
        if (res.status) {
          this.toast.success(res.message);
          this.loadTemplate();
        } else {
          this.toast.error(res.message);
        }
        this.isDeleteTemplateLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isDeleteTemplateLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  getAllSignature(): void {
    this.isGetAllSignatureLoading = true;
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.getAllsigantureTemplate(id).subscribe(
      (res: any) => {
        // console.log('list siganture: ' + res);
        if (res.status) {
          this.listSignatureTemplate = res.data;
          this.showListSignatureTemplate = true;
        } else {
          this.toast.error(res.message);
        }
        this.isGetAllSignatureLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isGetAllSignatureLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  getAllSignatureRule(): void {
    this.isGetAllSignatureRuleLoading = true;
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.getAllSignatureTemplateRules(id).subscribe(
      (res: any) => {
        if (res.status) {
          this.listSignatureTemplateRule = res.data;
          this.showListSignatureTemplateRule = true;
        } else {
          this.toast.error(res.message);
        }
        this.isGetAllSignatureRuleLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isGetAllSignatureRuleLoading = false;
        this.toast.error("Connection timeout!")
      }
    );
  }
  addRow(): void {
    this.listOfRules = [
      ...this.listOfRules,
      {
        id: this.i,
        content: '',
        action: 'true'
      }
    ];
    this.i++;
    this.rules.listRule = this.listOfRules;
    console.log(this.listOfRules);
  }
  addRowSpec(): void {
    let newRow = new SpecRuleCheck();
    newRow.idSpec = this.idSpec;
    newRow.specificBy = this.listOfSpecTemplate.allSupportSpecific[0].name;
    newRow.signature_id = this.listOfSpecTemplate.allSignature[0].id;
    newRow.department = JSON.parse(JSON.stringify(this.listOfSpecTemplate.allDepartment));
    newRow.position = JSON.parse(JSON.stringify(this.listOfSpecTemplate.allPosition));
    // newRow.employee = JSON.parse(JSON.stringify(this.listOfSpecTemplate.allEmployee));
    newRow.team = JSON.parse(JSON.stringify(this.listOfSpecTemplate.allTeam));
    newRow.allSignature = this.listOfSpecTemplate.allSignature;
    this.listOfSpecTemplate.specRuleCheck.push(newRow);
    this.idSpec++;
    console.log(this.listOfSpecTemplate.specRuleCheck);
  }
  addContent(content): void {
    let closeTag = this.htmlContent.substring(this.htmlContent.lastIndexOf('</'), this.htmlContent.lastIndexOf('>') + 1);
    if (this.htmlContent.lastIndexOf('>') + 1 === this.htmlContent.length) {
      this.htmlContent = this.htmlContent.substring(0, this.htmlContent.lastIndexOf('<'));
      this.htmlContent += '{' + content + '}' + closeTag;
    } else {
      this.htmlContent += '{' + content + '}';
    }
  }
  deleteRow(id): void {
    this.listOfRules = this.listOfRules.filter(d => d.id !== id);
    this.rules.listRule = this.listOfRules;
  }
  deleteRowSpec(id): void {
    this.listOfSpecTemplate.specRuleCheck = this.listOfSpecTemplate.specRuleCheck.filter(d => d.idSpec !== id);
  }
  loadTemplate(): void {
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.getInfoToReview(id).subscribe(
      async (res: any) => {
        this.infoToReview = res;
        if (this.infoToReview !== null) {
          this.signatureService.getSignatureTemplate(id).subscribe(
            (res: any) => {
              if (res.status) {
                // console.log('siganture: ' + res);
                let signature = new Signature();
                signature = res.data;
                this.htmlContent = signature.content;
                this.signatureName = signature.name;
                this.signatureID = signature.id;
                this.isSetPrimaryDisable = signature.is_primary > 0;
                this.htmlContentReview = this.htmlContent;
                // console.log('htmlContentReview: ' + this.htmlContentReview);
                let firstname = this.infoToReview.first_name;
                let lastname = this.infoToReview.last_name;
                let phone = this.infoToReview.phone;
                let primary_email = this.infoToReview.primary_email;
                let position = this.infoToReview.position_in_company.name;
                this.htmlContentReview = this.htmlContentReview.split('{email}').join(primary_email);
                this.htmlContentReview = this.htmlContentReview.split('{name}').join(firstname + ' ' + lastname);
                this.htmlContentReview = this.htmlContentReview.split('{phone}').join(phone);
                this.htmlContentReview = this.htmlContentReview.split('{position}').join(position);
              } else {
                this.signatureID = '';
                this.signatureName = '';
                this.htmlContent = '';
                this.htmlContentReview = '';
                this.toast.error(res.message);
              }
              this.isSpinning = false;
            },
            (err) => {
              console.log(err);
              this.isSpinning = false
              this.toast.error("Connection timeout!")
            }
          );

        } else {
          this.toast.error('You have not synchronized data!');
          // this.router.navigate(['/dashboard'])
        }
        // console.log('Info to review: ' + res);
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )
  }
  getSignatureTemplateRuleByID(id): void {
    this.isSpinning = true;
    this.showListSignatureTemplateRule = false;
    this.signatureService.getDynamicRule().subscribe(
      (res: any) => {
        if (res.status) {
          if (res.data.length > 0) {
            this.signatureService.getSignatureRuleByID(id).subscribe(
              (res: any) => {
                if (res.status) {
                  let signatureRule = {
                    lengthRule: {
                      maxLength: null,
                      minLength: null
                    },
                    name: null,
                    id: null,
                    listRule: [],
                    is_primary: null
                  }
                  signatureRule = res.data;
                  this.isSetPrimaryRuleDisable = signatureRule.is_primary === 1
                  this.is_primary_rule = signatureRule.is_primary;
                  this.signatureRuleName = signatureRule.name;
                  this.signatureRuleID = signatureRule.id;
                  this.rules.lengthRule.minLength = signatureRule.lengthRule.minLength;
                  this.rules.lengthRule.maxLength = signatureRule.lengthRule.maxLength;
                  this.listOfRules = [];
                  signatureRule.listRule.forEach(element => {
                    this.listOfRules = [
                      ...this.listOfRules,
                      {
                        id: this.i,
                        content: element.content,
                        action: element.action
                      }
                    ];
                    this.i++;
                  });

                  this.rules.listRule = this.listOfRules;
                  this.toast.success('Load rule: ' + this.signatureRuleName + ' successfully!');
                  // console.log('this.rule: ' + this.rules);
                } else {
                  this.toast.error(res.message)
                }
              },
              (err) => {
                console.log(err);
                this.isSpinning = false
                this.toast.error("Connection timeout!")
              }
            );
          }
        } else {
          this.toast.error(res.message);
        }
        this.isSpinning = false;
      }
    )
  }
  deleteSignatureTemplateRuleByID(id, name): void {
    this.isDeleteTemplateRuleLoading = true;
    this.showListSignatureTemplateRule = false;
    this.isSpinning = true;
    this.signatureService.deleteSignatureRuleByID(id, name).subscribe(
      (res: any) => {
        if (res.status) {
          this.toast.success(res.message);
          this.loadRules();
        } else {
          this.toast.error(res.message);
        }
        this.isDeleteTemplateRuleLoading = false;
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
        this.isDeleteTemplateRuleLoading = false;
        this.toast.error("Connection timeout!")
      }
    )
  }
  checklog() {
    console.log(this.rules);
  }
  loadRules(): void {
    this.isSpinning = true;
    this.isSetPrimaryRuleDisable = true;
    let id = localStorage.getItem('id');
    this.signatureService.getDynamicRule().subscribe(
      (res: any) => {
        if (res.status) {
          if (res.data.length > 0) {
            this.signatureService.getSignatureTemplateRules(id).subscribe(
              (res: any) => {
                if (res.status) {
                  let signatureRule = {
                    lengthRule: {
                      maxLength: null,
                      minLength: null
                    },
                    name: null,
                    id: null,
                    listRule: [],
                    is_primary: null
                  }
                  signatureRule = res.data;
                  this.signatureRuleName = signatureRule.name;
                  this.signatureRuleID = signatureRule.id;
                  this.is_primary_rule = signatureRule.is_primary;
                  this.rules.lengthRule.minLength = signatureRule.lengthRule.minLength;
                  this.rules.lengthRule.maxLength = signatureRule.lengthRule.maxLength;
                  this.listOfRules = [];
                  signatureRule.listRule.forEach(element => {
                    this.listOfRules = [
                      ...this.listOfRules,
                      {
                        id: this.i,
                        content: element.content,
                        action: element.action
                      }
                    ];
                    this.i++;
                  });
                  this.rules.listRule = this.listOfRules;
                  // console.log('this.rule: ' + this.rules);
                } else {
                  this.signatureRuleName = '';
                  this.signatureRuleID = '';
                  this.rules = {
                    lengthRule: {
                      minLength: null,
                      maxLength: null
                    },
                    listRule: null
                  };
                  this.listOfRules = [];
                }
              }
            );
          }
        } else {
          this.toast.error(res.message);
        }
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )

  }
  loadDynamicRule(): void {
    this.isSpinning = true;
    this.signatureService.getDynamicRule().subscribe(
      (res: any) => {
        if (res.status) {
          // console.log(res.data);
          this.dynamicRule = res.data;
        } else {
          this.toast.error(res.message);
        }
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )
  }
  clearContent(): void {
    this.htmlContent = '';
    this.htmlContentReview = '';
    this.signatureName = '';
    this.signatureID = '';
    this.signatureRuleName = '';
    this.signatureRuleID = '';
    this.rules = null;
  }
  goToSettingPage(): void {
    this.router.navigate(['/company-config-connection']);
  }
  checkGsuiteKey(): void {
    this.isSpinning = true;
    let id = localStorage.getItem('id');
    this.signatureService.checkFileGsuiteKey(id).subscribe(
      (res: any) => {
        if (!res.status) {
          this.isUploadGsuiteKeyFile = false;
        } else {
          this.loadTemplate();
          this.loadRules();
          this.loadDynamicRule();
        }
        this.isSpinning = false;
      },
      (err) => {
        console.log(err);
        this.isSpinning = false
        this.toast.error("Connection timeout!")
      }
    )
  }
  ngOnInit(): void {
    this.checkGsuiteKey();
  }
}
