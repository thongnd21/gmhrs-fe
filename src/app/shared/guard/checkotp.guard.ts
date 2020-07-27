import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class CheckOTPGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('two_fa_status')) {
            return true;
        }

        this.router.navigate(['']);
        return false;
    }
}