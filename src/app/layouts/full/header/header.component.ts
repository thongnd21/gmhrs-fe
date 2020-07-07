import { Component, ViewChild } from '@angular/core';
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
import { MatMenuTrigger } from '@angular/material';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
  
})

export class AppHeaderComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  username;
  loading = false;
  panelOpenState = false;
  listItemSynch = {};
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
    this.loading = true;
    let check = localStorage.getItem('is_first_sync');
    let accountId= localStorage.getItem('id');
    this.syncService.getListSynchronize(accountId,check).subscribe(
      (res : any) => {
        if(check == 'true'){
          const listSync ={
            department : new DepartmentSync,
            team : new TeamSync,
            employee : new EmployeeSync
          }
          console.log(res);
          // department
          listSync.department.matchedDepartment = res.departments.matchedDepartment.map(d=>{
            return {
              id:d.id, 
              name:d.name,
              description:d.description,
              modified_date : d.modified_date,
              created_date:d.created_date
            }
          });
          listSync.department.newDepartment = res.departments.newDepartment.map(d=>{
            return {
              id:d.id, 
              name:d.name,
              description:d.description,
              modified_date : d.modified_date,
              created_date:d.created_date
            }
          });
          listSync.department.outOfHRMS = res.departments.outOfHRMS.map(d=>{
            return { 
              name:d.name,
              description:d.description,
            }
          });
          // team
          listSync.team.matchedTeam = res.teams.matchedTeam.map(o=>{
            return {
              id:o.id, 
              name:o.name,
              email:o.email,
              description:o.description,
              modified_date : o.modified_date,
              created_date:o.created_date
            }
          });
          listSync.team.newTeam = res.teams.newTeam.map(o=>{
            return {
              id:o.id, 
              name:o.name,
              email:o.email,
              description:o.description,
              modified_date : o.modified_date,
              created_date:o.created_date
            }
          });
          listSync.team.outOfHRMS = res.teams.outOfHRMS.map(o=>{
            return { 
              id: o.id,
              name:o.name,
              email:o.email,
              description:o.description,
            }
          });
          // employee
          listSync.employee.matchedEmployee = res.employees.matchedEmployee.map(o=>{
            return {
              address: o.address,
              first_name: o.first_name,
              id: o.id,
              last_name: o.last_name,
              modified_date: o.modified_date,
              personal_email: o.personal_email,
              phone: o.phone,
              primary_email: o.primary_email
            }
          });
          listSync.employee.newEmployee = res.employees.newEmployee.map(o=>{
            return {
              address: o.address,
              first_name: o.first_name,
              id: o.id,
              last_name: o.last_name,
              modified_date: o.modified_date,
              personal_email: o.personal_email,
              phone: o.phone,
              primary_email: o.primary_email
            }
          });
          listSync.employee.outOfHRMS = res.employees.outOfHRMS.map(o=>{
            return { 
              familyName:o.name.familyName,
              fullName:o.name.fullName,
              givenName:o.name.givenName,
              primary_email: o.primaryEmail
            }
          });
          this.listItemSynch = listSync;
          event.stopPropagation();
          this.loading = false;
          this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          this.trigger.closeMenu()
        }else{
          event.stopPropagation();
          this.loading = false;
          this.toast.success(res.status);
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
  synchornize(){
    localStorage.setItem('is_first_sync', 'false');
    let check = localStorage.getItem('is_first_sync');
    let accountId= localStorage.getItem('id');
    this.loading = true;
    this.syncService.getListSynchronize(accountId,check).subscribe(
      (res : any) => {
        this.loading = false;
        this.toast.success(res.status);
        this.closeModal();
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
