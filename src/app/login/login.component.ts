import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
    public loading = false;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toast : ToastrService,
        private authenticationService : AuthenService
    ) { }

    ngOnInit() {
    }

    onLogin() {
        let account = {
          username: this.username,
          password: this.password  
        };
        this.authenticationService.login(account) .subscribe(
            (res) => {
                console.log(res);
                const userInfo: any = res;
                localStorage.setItem('isLoggedin', 'true');
                localStorage.setItem('token', userInfo.token);
                this.router.navigate(['/dashboard']);
            },
            (err)=>{
                if (err.status == 0) {
                    this.toast.error('Connection time out');
                }else
                if (err.status == 500) {
                    this.toast.error('Server error');
                }else{
                    this.toast.error('Username or password invalid');
                }
            }
        );
    }

}
