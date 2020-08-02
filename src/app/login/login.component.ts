import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import { CompanyServices } from '../api-services/company.services';
import {AccountApiService } from '../api-services/account-api.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username;
    password;
    public loading = false;
    registerForm: FormGroup;
    resetPasswordForm: FormGroup;
    login;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toast: ToastrService,
        private authenticationService: AuthenService,
        private companyServices: CompanyServices,
        private accountServices: AccountApiService
    ) { }

    ngOnInit() {
        this.login = 0;
        console.log(this.login);
        const accPassword = new FormControl("", [Validators.required]);
        const confirmPassword = new FormControl(
            "",
            CustomValidators.equalTo(accPassword)
        );

        this.registerForm = new FormGroup({
            username: new FormControl("", [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(9)
            ]),
            email: new FormControl("", [Validators.required, Validators.email]),
            password: accPassword,
            confirmPassword: confirmPassword,
            phone: new FormControl("", [
                Validators.required,
                Validators.pattern(new RegExp(/((09|03|07|08|05)+([0-9]{8})\b)/g))
            ]),
            address: new FormControl("")
        });
        this.createFormResetPassword();
    }

    keyDownFunction(event) {
        if (event.keyCode === 13) {
            this.onLogin();
        }
    }

    onLogin() {
        let account = {
            username: this.username,
            password: this.password
        };
        this.authenticationService.login(account).subscribe(
            (res: any) => {
                const userInfo: any = res;
                console.log(res);
                localStorage.setItem('isLoggedin', 'true');
                localStorage.setItem('id', userInfo.profile.id);
                localStorage.setItem('username', userInfo.profile.username);
                localStorage.setItem('two_fa_status', userInfo.profile.two_fa_status);
                localStorage.setItem('last_sync_at', moment.utc(userInfo.profile.last_sync_date).local().format('LLLL'));
                localStorage.setItem('token', userInfo.token);
                localStorage.setItem('is_first_sync', userInfo.profile.is_first_sync === true ? 'true' : 'false');
                localStorage.setItem('roleId', userInfo.profile.role.id);
                localStorage.setItem('api_enpoint', userInfo.profile.api_endpoint);
                if (userInfo.profile.two_fa_status === 1) {
                    this.router.navigate(['/checkotp']);
                } else {
                    localStorage.setItem('isLoggedin', 'true');
                    this.router.navigate(['/dashboard']);
                }
            },
            (err) => {
                if (err.status == 0) {
                    this.toast.error('Connection time out');
                } else
                    if (err.status == 500) {
                        this.toast.error('Server error');
                    } else {
                        this.toast.error('Username or password invalid');
                    }
            }
        );
    }

    changeToForm(change) {
        this.login = change; console.log(this.login);
    }

    sendMail() {
        const account = {
            username: this.resetPasswordForm.controls['username'].value,
            email: this.resetPasswordForm.controls['email'].value,
            phone: this.resetPasswordForm.controls['phone'].value
        };
        this.accountServices.sendMailToChangPassword(account).subscribe(
            (res) => {
                const status: any = res;
                if (status.status == "success") {
                    localStorage.setItem('username', account.username);
                    this.toast.success("Reset Password success!");
                    this.router.navigate(['/resetPassword']);
                } else if (status.status == "fail") {
                    this.toast.error("Input information again!");
                }
                this.resetPasswordForm.reset();

            },
            (error) => {
                this.toast.error("Server is not available!");
            }
        )
    }

    register() {
        const account = {
            email: this.registerForm.controls['email'].value,
            username: this.registerForm.controls['username'].value,
            password: this.registerForm.controls['password'].value,
            phone: this.registerForm.controls['phone'].value,
            address: this.registerForm.controls['address'].value
        };
        this.companyServices.createAccountCompany(account).subscribe(
            (res) => {
                this.registerForm.reset();
                this.toast.success("Create Account success!");
            },
            (error) => {
                this.toast.error("Server is not available!");
            }
        );
    }

    createFormResetPassword() {
        this.resetPasswordForm = new FormGroup({

            username: new FormControl("", [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
            ]),
            //   email: new FormControl(data.email , [Validators.required, Validators.email]),
            phone: new FormControl("", [
                Validators.required,
                Validators.pattern(new RegExp(/((09|03|07|08|05)+([0-9]{8})\b)/g))
            ]),
            email: new FormControl("", [Validators.required, Validators.email]),
        });
    }



}
