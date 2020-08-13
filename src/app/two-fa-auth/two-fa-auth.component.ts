import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TwoFaAuthService } from '../api-services/two-fa-auth.service';

@Component({
  selector: 'app-two-fa-auth',
  templateUrl: './two-fa-auth.component.html',
  styleUrls: ['./two-fa-auth.component.css']
})
export class TwoFaAuthComponent implements OnInit {
  otp = '';
  QrCodeLink: any;
  showOrNot = false;
  isSubmitOTPLoading = false;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private twoFaAuthService: TwoFaAuthService,
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
    if (this.otp !== '') {
      this.isSubmitOTPLoading = true;
      let username = localStorage.getItem('username');
      this.twoFaAuthService.activated2FA(this.otp, username).subscribe(
        (res) => {
          if (res) {
            this.toast.success('Activated 2FA successfully!');
            this.router.navigate(['/dashboard']);
          } else {
            this.toast.error('Invalid OTP!');
          }
          setTimeout(() => {
            this.isSubmitOTPLoading = false;
          }, 1000);
        }
      );
    } else {
      this.toast.warning('Input OTP!')
    }
  }
  ngOnInit(): void {
    let username = localStorage.getItem('username');
    this.twoFaAuthService.check2faStatus(username).subscribe(
      (res: any) => {
        localStorage.setItem('two_fa_status', res);
        let two_fa_status = localStorage.getItem('two_fa_status');
        console.log(two_fa_status);

        if (two_fa_status === "null" || two_fa_status === '0') {
          let username = localStorage.getItem('username');
          this.twoFaAuthService.getQrCode(username).subscribe(
            (res) => {
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
