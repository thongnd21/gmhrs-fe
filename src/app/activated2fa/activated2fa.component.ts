import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import { TwoFaAuthService } from '../api-services/two-fa-auth.service';

@Component({
  selector: 'app-activated2fa',
  templateUrl: './activated2fa.component.html',
  styleUrls: ['./activated2fa.component.css']
})
export class Activated2faComponent implements OnInit {
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

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSubmitOtp();
    }
  }

  onSubmitOtp() {
    let username = localStorage.getItem('username');
    this.twoFaAuthService.deactivated2FA(this.otp, username).subscribe(
      (res) => {
        if (res) {
          this.toast.success('Deactive 2FA successful!');
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
