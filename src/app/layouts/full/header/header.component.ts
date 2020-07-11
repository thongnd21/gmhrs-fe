import { Component, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
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
import { CheckOtpModule } from '../../../check-otp/check-otp.module';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})

export class AppHeaderComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  username;
  selectedAll: any;
  loading = false;
  panelOpenState = false;
  listItemSynch:any;
  listSyncFinal :any;
  isFirstSync = null;
  open = (modal) =>
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });

  constructor(
    private modalService: NgbModal,
    private syncService: SynchronizeService,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  getListSynchronize(event,first,second) {
    this.loading = true;
    let accountId = localStorage.getItem('id');
    this.syncService.getListSynchronize(accountId).subscribe(
      (res: any) => {
        this.isFirstSync = res.is_first_sync;
        this.listSyncFinal = res;
        const listSync = {
          department: new DepartmentSync,
          team: new TeamSync,
          employee: new EmployeeSync
        }
        console.log(res);
        // department
        listSync.department.matchedDepartment = res.departments.matchedDepartment.map(d => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            modified_date: d.modified_date,
            created_date: d.created_date
          }
        });
        listSync.department.newDepartment = res.departments.newDepartment.map(d => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            modified_date: d.modified_date,
            created_date: d.created_date,
          }
        });
        listSync.department.outOfHRMS = res.departments.outOfHRMS.map(d => {
          return {
            name: d.name,
            description: d.description,
          }
        });
        // team
        listSync.team.matchedTeam = res.teams.matchedTeam.map(o => {
          return {
            id: o.id,
            name: o.name,
            email: o.email,
            description: o.description,
            modified_date: o.modified_date,
            created_date: o.created_date
          }
        });
        listSync.team.newTeam = res.teams.newTeam.map(o => {
          return {
            id: o.id,
            name: o.name,
            email: o.email,
            description: o.description,
            modified_date: o.modified_date,
            created_date: o.created_date
          }
        });
        listSync.team.outOfHRMS = res.teams.outOfHRMS.map(o => {
          return {
            id: o.id,
            name: o.name,
            email: o.email,
            description: o.description,
          }
        });
        // employee
        listSync.employee.matchedEmployee = res.employees.matchedEmployee.map(o => {
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
        listSync.employee.newEmployee = res.employees.newEmployee.map(o => {
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
        listSync.employee.outOfHRMS = res.employees.outOfHRMS.map(o => {
          return {
            id:o.id,
            address: o.address,
            department_id: o.department_id,
            first_name: o.first_name,
            primary_email: o.primaryEmail,
            gsuite_id: o.gsuite_id,
            last_name : o.last_name,
            personal_email:o.personal_email,
            phone:o.phone,
            hrms_id:o.hrms_id
          }
        });
        this.listItemSynch = listSync;
        event.stopPropagation();
        this.loading = false;
        if(this.isFirstSync == true){
          this.modalService.open(first, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          this.trigger.closeMenu()
          event.stopPropagation();
          this.loading = false;
        }else{
          this.modalService.open(second, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          this.trigger.closeMenu()
          event.stopPropagation();
          this.loading = false;
        }
      },
      (err) => {
        if (err.status == 0) {
          this.toast.error('Connection time out');
        } else
          if (err.status == 500) {
            this.toast.error('Server error');
          } else {
            this.toast.error('System is not avaiable!');
          }
      }
    );
  }

  synchronize() {
    let accountId = localStorage.getItem('id');
    if(this.isFirstSync != null ){
      if(this.isFirstSync == true){
        
      }else{

      }
      this.syncService.synchronize(this.listSyncFinal).subscribe(
        (res: any) => {
          this.toast.success('Synchronize success!');
        },
        (err) => {
          if (err.status == 0) {
            this.toast.error('Connection time out');
          } else
            if (err.status == 500) {
              this.toast.error('Server error');
            } else {
              this.toast.error('System is not avaiable!');
            }
        }
      );
    }else{
      this.toast.error('Service is not supported!');
    }
  }


  closeModal() {
    this.modalService.dismissAll();
  }
  doNotClose(event) {
    event.stopPropagation();
  }

  signOut() {
    localStorage.clear();
  }

  selectAll() {
    console.log(this.listItemSynch.department.matchedDepartment);
    if(this.selectedAll){
        this.listItemSynch.department.matchedDepartment.forEach((e, index) =>{
            e.selected = true;
            this.listSyncFinal.department.matchedDepartment[index].selected = true;
        });
    }
    else{
        this.listItemSynch.forEach((e, index)=>{
            e.selected = false;
            this.listSyncFinal.department.matchedDepartment[index].selected = false;
        });
    }
}

  checkSelected(id) {
      var index = this.listItemSynch.department.matchedDepartment.findIndex(x => x.id == id);
      this.listItemSynch.department.matchedDepartment[index].selected = !this.listItemSynch.department.matchedDepartment[index].selected;
      if(this.listItemSynch.department.matchedDepartment[index].selected == false){
        console.log(this.listItemSynch.department.matchedDepartment[index].selected);
        this.listSyncFinal.department.matchedDepartment[index].selected = false;
        this.selectedAll = false;
      }else{
        this.listSyncFinal.department.matchedDepartment[index].selected = true;
        const check = this.listItemSynch.department.matchedDepartment[index].find(x=>x.selected == false);
        console.log(check);
        if(!check){
              this.selectedAll = true;
        }
      }
  }


}
