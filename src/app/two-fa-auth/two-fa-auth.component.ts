import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../api-services/authen.services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import { TwoFaAuthService } from '../api-services/two-fa-auth.service';

@Component({
  selector: 'app-two-fa-auth',
  templateUrl: './two-fa-auth.component.html',
  styleUrls: ['./two-fa-auth.component.css']
})
export class TwoFaAuthComponent implements OnInit {

  QrCodeLink: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private authenticationService: AuthenService,
    private twoFaAuthService: TwoFaAuthService
  ) {

  }

  ngOnInit(): void {
    let two_fa_status = localStorage.getItem('two_fa_status');
    let username = localStorage.getItem('username');
    this.twoFaAuthService.getQrCode(username).subscribe(
      (res) => {
        this.QrCodeLink = res;
      }
    );
    // this.QrCodeLink = 'https://authy.com/wp-content/uploads/login-with-2fa-flow.png';
  }

}
