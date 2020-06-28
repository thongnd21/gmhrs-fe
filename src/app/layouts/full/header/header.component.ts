import { Component } from '@angular/core';
import {ViewEncapsulation } from '@angular/core';
import { CompanyConnectionService } from '../../../api-services/company-connection-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
  
})

export class AppHeaderComponent {
  username;
  loading = false;
  constructor(
    private companyConnectionService : CompanyConnectionService,
    private toast : ToastrService,
    ) { }
  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  synchornizeNow(event){
    this.loading = true;
    event.stopPropagation();
    this.companyConnectionService.synchonize().subscribe(
      (res)=>{
        this.loading = false;
        this.toast.success("Synchronize success!")
      },
      (error)=>{
        this.loading = false;
        if(error.status == 0){
          this.toast.error("Connection timeout!");
        }if(error.status == 400){
          this.toast.error("Server is not available!");
        }
          this.toast.error("Server is not available!");
      });
  }

  doNotClose(event){
    event.stopPropagation();
  }

  signOut(){
    localStorage.clear();
  }
}
