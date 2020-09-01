import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { TwoFaAuthService } from '../api-services/two-fa-auth.service';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';



@Component({
  selector: 'app-check-otp',
  templateUrl: './check-otp.component.html',
  styleUrls: ['./check-otp.component.css']
})
export class CheckOtpComponent implements OnInit, OnDestroy {
  otp = '';
  subscription: Subscription;
  isSubmitOTPLoading = false;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private twoFaAuthService: TwoFaAuthService
  ) { }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSubmitOtp();
    }
  }

  onOtpChange($event) {
    this.otp = $event;
  }
  onSubmitOtp() {
    if (this.otp !== '') {
      this.isSubmitOTPLoading = true;
      let username = localStorage.getItem('username');
      this.twoFaAuthService.checkOtp(this.otp, username).subscribe(
        (res) => {
          if (res) {
            this.toast.success('Validation successful!');
            localStorage.setItem('isLoggedin', 'true');
            localStorage.removeItem('two_fa_status');
            if (localStorage.getItem('roleId') === '2') {
              this.router.navigate(['/dashboard']);
            } else if (localStorage.getItem('roleId') === '1') {
              this.router.navigate(['/company']);
            }
          } else {
            this.toast.error('Invalid OTP!');
          }
          setTimeout(() => {
            this.isSubmitOTPLoading = false;
          }, 1000);
        }
      );
    } else {
      this.toast.warning('Input OTP!');
    }
  }
  ngOnInit(): void {
    let username = localStorage.getItem('username');
    this.subscription = Observable.interval(2000).subscribe((val) => {
      this.twoFaAuthService.checkBypassOtp(username).subscribe(
        res => {
          console.log(res);
          if (res) {
            localStorage.setItem('isLoggedin', 'true');
            localStorage.removeItem('two_fa_status');
            this.toast.success('You have approved by mobile application!')
            this.router.navigate(['/dashboard']);
          }
        }
      );
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
