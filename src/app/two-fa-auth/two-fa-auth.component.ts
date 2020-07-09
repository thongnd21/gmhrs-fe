import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import { TwoFaAuthService } from '../api-services/two-fa-auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-two-fa-auth',
  templateUrl: './two-fa-auth.component.html',
  styleUrls: ['./two-fa-auth.component.css']
})
export class TwoFaAuthComponent implements OnInit {
  otp: any;
  QrCodeLink: any;
  showOrNot = false;
  isSubmitOTPLoading = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private authenticationService: AuthenService,
    private twoFaAuthService: TwoFaAuthService,
    private _sanitizer: DomSanitizer,
  ) {

  }
  onOtpChange($event) {
    this.otp = $event;
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSubmitOtp();
    }
  }

  onSubmitOtp() {
    this.isSubmitOTPLoading = true;
    let username = localStorage.getItem('username');
    this.twoFaAuthService.activated2FA(this.otp, username).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Activated 2FA successful!');
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error('Invalid OTP!');
        }
        setTimeout(() => {
          this.isSubmitOTPLoading = false;
        }, 1000);
      }
    );
  }
  ngOnInit(): void {
    let username = localStorage.getItem('username');

    this.twoFaAuthService.check2faStatus(username).subscribe(
      (res) => {
        localStorage.setItem('two_fa_status', res.toString());
        let two_fa_status = localStorage.getItem('two_fa_status');
        console.log(two_fa_status);

        if (two_fa_status.toString() === '0') {
          let username = localStorage.getItem('username');
          this.twoFaAuthService.getQrCode(username).subscribe(
            (res) => {
              console.log('qr content: ' + res);
              if (res === null) {
                console.log('reload bs server err!');

                this.ngOnInit();
                return;
              }
              this.showOrNot = true;
              this.QrCodeLink = res;
            }
          );
        } else {
          this.router.navigate(['/activated2fa']);
        }
      }
    )



  }

}
