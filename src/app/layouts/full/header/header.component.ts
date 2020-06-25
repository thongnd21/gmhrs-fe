import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  username;

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  synchornizeNow(){
    
  }

  signOut(){
    localStorage.clear();
  }
}
