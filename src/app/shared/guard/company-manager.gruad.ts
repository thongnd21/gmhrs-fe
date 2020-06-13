import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class CompanyManagerGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (Number.parseInt(localStorage.getItem('roleId')) === 2) {
            return true;
        }

        this.router.navigate(['']);
        return false;
    }
}