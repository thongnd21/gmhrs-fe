import { Component } from '@angular/core';
import {ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
  
})

export class AppHeaderComponent {
  username;
  loading = false;
  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  synchornizeNow(event){
    this.loading = true;
    event.stopPropagation();
    setTimeout(() => this.loading = false, 2000);
  }

  doNotClose(event){
    event.stopPropagation();
  }

  signOut(){
    localStorage.clear();
  }
}
