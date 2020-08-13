import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { AccountApiService } from '../api-services/account-api.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  changePasswordForm: FormGroup;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private accountService: AccountApiService,
  ) { }

  ngOnInit(): void {
    const newPassword = new FormControl("", [Validators.required]);
    const confirmNewPassword = new FormControl(
      "",
      CustomValidators.equalTo(newPassword)
    );
    this.changePasswordForm = new FormGroup({
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
      otp: new FormControl("", Validators.required)
    })
  }

  changePassword() {
    const account = {
      username: localStorage.getItem("username"),
      password: this.changePasswordForm.controls['newPassword'].value,
      otp: this.changePasswordForm.controls['otp'].value,
    };
    this.accountService.changePassword(account).subscribe(
      (res) => {
        const status: any = res;
        if (status.status == "success") {
          this.toast.success("Change Password successfully!");
          localStorage.clear();
          this.router.navigate(['/']);
        } else if (status.status == "fail") {
          this.toast.error("Input information again!");
        }
      },
      (error) => {
        this.toast.error("Server is not available!");
      }
    );
  }

}
