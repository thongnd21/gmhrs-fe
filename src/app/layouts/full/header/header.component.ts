import { Component } from '@angular/core';
import {ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SynchronizeService } from '../../../api-services/synchronize-api.service';
import { DepartmentSync } from '../../../model/listSyncDepartment';
import { TeamSync } from '../../../model/listSyncTeam';
import { EmployeeSync } from '../../../model/listSyncEmp';
import { Department } from '../../../model/department';
import { Team } from '../../../model/team';
import { Employee } from '../../../model/employee';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
  
})

export class AppHeaderComponent {
  username;
  loading = false;
  open = (modal) =>
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });

  constructor(
    private modalService: NgbModal,
    private syncService : SynchronizeService,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  synchornizeNow(event,modal){
    let check = localStorage.getItem('is_first_sync');
    console.log(check);
    let accountId= localStorage.getItem('id');
    console.log(accountId);
    this.syncService.getListSynchronize(accountId,check).subscribe(
      (res : any) => {
        if(check){
          const listSync ={
            department : new DepartmentSync,
            team : new TeamSync,
            employee : new EmployeeSync
          }
          console.log(res.departments);
          console.log(res.departments['newDepartment']);
          const dep = res.departments;
          // listSync.department.matchedDepartment = dep.matchedDepartment.map(o=>{
          //   return {
          //     id:o.id, 
          //     name:o.name,
          //     description:o.description,
          //     modified_date : o.modified_date,
          //     created_date:o.created_date
          //   }
          // });
          listSync.department.newDepartment = res.departments.newDepartment.map(o=>{
            return {
              id:o.id, 
              name:o.name,
              description:o.description,
              modified_date : o.modified_date,
              created_date:o.created_date
            }
          });
          listSync.department.outOfHRMS = res.departments.outOfHRMS.map(o=>{
            return { 
              name:o.name,
              description:o.description,
            }
          });
          console.log(listSync);
          // listSync.department.newDepartment.push(res.departments.newDepartment);
          // listSync.department.outOfHRMS.push(res.departments.outOfHRMS);
          // listSync.team.matchedTeam.push(res.teams.matchedTeam);
          // listSync.team.newTeam.push(res.teams.newTeam);
          // listSync.team.outOfHRMS.push(res.teams.outOfHRMS);
          // listSync.employee.matchedEmployee.push(res.employees.matchedEmployee);
          // listSync.employee.newEmployee.push(res.employees.newEmployee);
          // listSync.employee.outOfHRMS.push(res.employees.outOfHRMS);
          this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          
        }else{
          this.loading = true;
          event.stopPropagation();
          setTimeout(() => this.loading = false, 2000);
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

  closeModal() {
    this.modalService.dismissAll();
  }
  doNotClose(event){
    event.stopPropagation();
  }

  signOut(){
    localStorage.clear();
  }
}
