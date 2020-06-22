import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import { TwoFaAuthService } from '../api-services/two-fa-auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';


@Component({
  selector: 'app-check-otp',
  templateUrl: './check-otp.component.html',
  styleUrls: ['./check-otp.component.css']
})
export class CheckOtpComponent implements OnInit {
  otp: any;
  sub: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private authenticationService: AuthenService,
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
    let username = localStorage.getItem('username');
    this.twoFaAuthService.checkOtp(this.otp, username).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Validation successful!');
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error('Invalid OTP!');
        }
      }
    );
  }
  ngOnInit(): void {
    let username = localStorage.getItem('username');
    this.sub = Observable.interval(2000).subscribe((val) => {
      this.twoFaAuthService.checkBypassOtp(username).subscribe(
        res => {
          console.log(res);
          if (res) {
            this.sub.unsubscribe();
            this.toast.success('You have bypassed by mobile application!')
            this.router.navigate(['/dashboard']);
          }
        }
      );
    })


  }

}
