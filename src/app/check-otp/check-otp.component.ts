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


@Component({
  selector: 'app-check-otp',
  templateUrl: './check-otp.component.html',
  styleUrls: ['./check-otp.component.css']
})
export class CheckOtpComponent implements OnInit {
  otp: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private authenticationService: AuthenService,
    private twoFaAuthService: TwoFaAuthService
  ) { }

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
  }

}
