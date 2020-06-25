import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import { CompanyServices } from '../api-services/company.services';
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
    login;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toast: ToastrService,
        private authenticationService: AuthenService,
        private companyServices: CompanyServices,
    ) { }

    ngOnInit() {
        this.login = true;
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
            confirmPassword: confirmPassword
        });
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
            (res) => {
                console.log(res);
                const userInfo: any = res;
                localStorage.setItem('two_fa_status', userInfo.profile.two_fa_status);
                if (userInfo.profile.two_fa_status === 1) {
                    this.router.navigate(['/checkotp']);
                } else {
                    localStorage.setItem('isLoggedin', 'true');
                    localStorage.setItem('id', userInfo.profile.id);
                    localStorage.setItem('username', userInfo.profile.username);
                    localStorage.setItem('token', userInfo.token);
                    localStorage.setItem('roleId', userInfo.profile.role.id);
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

    changeToForm() {
        this.login = !this.login;
    }

    register() {
        const account = {
            email: this.registerForm.controls['email'].value,
            username: this.registerForm.controls['username'].value,
            password: this.registerForm.controls['password'].value
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
}
