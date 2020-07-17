import { Component, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { CompanyConnectionService } from '../../../api-services/company-connection-api.service';
import { ToastrService } from 'ngx-toastr';
import { OutOfHRMSDep } from './../../../model/outOfHRMSDep';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  selectedAll = true;
  selectedDepMatchAll = true;
  selectedDepNewAll = true;
  selectedDepOutAll = true;
  selectedTeamMatchAll = true;
  selectedTeamNewAll = true;
  selectedTeamOutAll = true;
  selectedEmpMatchAll = true;
  selectedEmpNewAll = true;
  selectedEmpOutAll = true;

  loading = false;
  constructor(
    private companyConnectionService: CompanyConnectionService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private syncService: SynchronizeService,
  ) { }
  panelOpenState = false;
  listItemSynch: any;
  listSyncFinal: any;
  isFirstSync = null;
  open = (modal) =>
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });


  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  synchornizeNow(event) {
    this.loading = true;
    event.stopPropagation();
    this.companyConnectionService.synchonize().subscribe(
      (res) => {
        this.loading = false;
        this.toast.success("Synchronize success!")
      },
      (error) => {
        this.loading = false;
        if (error.status == 0) {
          this.toast.error("Connection timeout!");
        } if (error.status == 400) {
          this.toast.error("Server is not available!");
        }
        this.toast.error("Server is not available!");
      });
  }

  getListSynchronize(event, first, second) {
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
            created_date: d.created_date,
            selected: true
          }
        });
        listSync.department.newDepartment = res.departments.newDepartment.map(d => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            modified_date: d.modified_date,
            created_date: d.created_date,
            selected: true
          }
        });
        listSync.department.outOfHRMS = res.departments.outOfHRMS.map(d => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            selected: true
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
            created_date: o.created_date,
            selected: true
          }
        });
        listSync.team.newTeam = res.teams.newTeam.map(o => {
          return {
            id: o.id,
            name: o.name,
            email: o.email,
            description: o.description,
            modified_date: o.modified_date,
            created_date: o.created_date,
            selected: true
          }
        });
        listSync.team.outOfHRMS = res.teams.outOfHRMS.map(o => {
          return {
            id: o.id,
            name: o.name,
            email: o.email,
            description: o.description,
            selected: true
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
            primary_email: o.primary_email,
            selected: true
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
            primary_email: o.primary_email,
            selected: true
          }
        });
        listSync.employee.outOfHRMS = res.employees.outOfHRMS.map(o => {
          return {
            id: o.id,
            address: o.address,
            department_id: o.department_id,
            first_name: o.first_name,
            primary_email: o.primaryEmail,
            gsuite_id: o.gsuite_id,
            last_name: o.last_name,
            personal_email: o.personal_email,
            phone: o.phone,
            hrms_id: o.hrms_id,
            selected: true
          }
        });
        this.listItemSynch = listSync;
        event.stopPropagation();
        this.loading = false;
        if (this.isFirstSync == true) {
          this.modalService.open(first, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          this.trigger.closeMenu()
          event.stopPropagation();
          this.loading = false;
        } else {
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
    let syncList = {
      accountId: accountId,
      employees: this.listSyncFinal.employees,
      teams: this.listSyncFinal.teams,
      departments: this.listSyncFinal.departments
    }
    console.log(syncList);
    if (this.isFirstSync != null) {
      if (this.isFirstSync == true) {

      } else {

      }
      this.syncService.synchronize(syncList).subscribe(
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
    } else {
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

  // select dep match
  selectAllDepMatch() {
    console.log(this.listItemSynch.department.matchedDepartment);
    if (this.selectedDepMatchAll) {
      this.listItemSynch.department.matchedDepartment.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.departments.matchedDepartment[index].selected = true;
      });
    }
    else {
      this.listItemSynch.department.matchedDepartment.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.departments.matchedDepartment[index].selected = false;
      });
    }
  }

  checkSelectedDepMatch(id) {
    var index = this.listItemSynch.department.matchedDepartment.findIndex(x => x.id == id);
    this.listItemSynch.department.matchedDepartment[index].selected = !this.listItemSynch.department.matchedDepartment[index].selected;
    if (this.listItemSynch.department.matchedDepartment[index].selected == false) {
      console.log(this.listItemSynch.department.matchedDepartment[index].selected);
      this.listSyncFinal.departments.matchedDepartment[index].selected = false;
      this.selectedDepMatchAll = false;
    } else {
      this.listSyncFinal.departments.matchedDepartment[index].selected = true;
      const check = this.listItemSynch.department.matchedDepartment.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedDepMatchAll = true;
      }
    }
  }
  // select dep new
  selectAllDepNew() {
    console.log(this.listItemSynch.department.newDepartment);
    if (this.selectedDepNewAll) {
      this.listItemSynch.department.newDepartment.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.departments.newDepartment[index].selected = true;
      });
    }
    else {
      this.listItemSynch.department.newDepartment.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.departments.newDepartment[index].selected = false;
      });
    }
  }

  checkSelectedDepNew(id) {
    var index = this.listItemSynch.department.newDepartment.findIndex(x => x.id == id);
    this.listItemSynch.department.newDepartment[index].selected = !this.listItemSynch.department.newDepartment[index].selected;
    if (this.listItemSynch.department.newDepartment[index].selected == false) {
      console.log(this.listItemSynch.department.newDepartment[index].selected);
      this.listSyncFinal.departments.newDepartment[index].selected = false;
      this.selectedDepNewAll = false;
    } else {
      this.listSyncFinal.departments.newDepartment[index].selected = true;
      const check = this.listItemSynch.department.newDepartment.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedDepNewAll = true;
      }
    }
  }
  // select dep out
  selectAllDepOut() {
    console.log(this.listItemSynch.department.OutOfHRMS);
    if (this.selectedDepOutAll) {
      this.listItemSynch.department.OutOfHRMSDep.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.departments.OutOfHRMSDep[index].selected = true;
      });
    }
    else {
      this.listItemSynch.department.OutOfHRMS.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.departments.OutOfHRMS[index].selected = false;
      });
    }
  }

  checkSelectedDepOut(id) {
    var index = this.listItemSynch.department.OutOfHRMS.findIndex(x => x.id == id);
    this.listItemSynch.department.OutOfHRMS[index].selected = !this.listItemSynch.department.OutOfHRMS[index].selected;
    if (this.listItemSynch.department.OutOfHRMS[index].selected == false) {
      console.log(this.listItemSynch.department.OutOfHRMS[index].selected);
      this.listSyncFinal.departments.OutOfHRMS[index].selected = false;
      this.selectedDepOutAll = false;
    } else {
      this.listSyncFinal.departments.OutOfHRMS[index].selected = true;
      const check = this.listItemSynch.department.OutOfHRMS.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedDepOutAll = true;
      }
    }
  }

  // select emp match
  selectAllEmpMatch() {
    console.log(this.listItemSynch.employee.matchedEmployee);
    if (this.selectedEmpMatchAll) {
      this.listItemSynch.employee.matchedEmployee.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.employees.matchedEmployee[index].selected = true;
      });
    }
    else {
      this.listItemSynch.employee.matchedEmployee.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.employees.matchedEmployee[index].selected = false;
      });
    }
  }

  checkSelectedEmpMatch(id) {
    var index = this.listItemSynch.employee.matchedEmployee.findIndex(x => x.id == id);
    this.listItemSynch.employee.matchedEmployee[index].selected = !this.listItemSynch.employee.matchedEmployee[index].selected;
    if (this.listItemSynch.employee.matchedEmployee[index].selected == false) {
      console.log(this.listItemSynch.employee.matchedEmployee[index].selected);
      this.listSyncFinal.employees.matchedEmployee[index].selected = false;
      this.selectedEmpMatchAll = false;
    } else {
      this.listSyncFinal.employees.matchedEmployee[index].selected = true;
      const check = this.listItemSynch.employee.matchedEmployee.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedEmpMatchAll = true;
      }
    }
  }
  // select Emp new
  selectAllEmpNew() {
    console.log(this.listItemSynch.employee.newEmployee);
    if (this.selectedEmpNewAll) {
      this.listItemSynch.employee.newEmployee.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.employees.newEmployee[index].selected = true;
      });
    }
    else {
      this.listItemSynch.employee.newEmployee.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.employees.newEmployee[index].selected = false;
      });
    }
  }

  checkSelecteEmpNew(id) {
    var index = this.listItemSynch.employee.newEmployee.findIndex(x => x.id == id);
    this.listItemSynch.employee.newEmployee[index].selected = !this.listItemSynch.employee.newEmployee[index].selected;
    if (this.listItemSynch.employee.newEmployee[index].selected == false) {
      console.log(this.listItemSynch.employee.newEmployee[index].selected);
      this.listSyncFinal.employees.newEmployee[index].selected = false;
      this.selectedEmpNewAll = false;
    } else {
      this.listSyncFinal.employees.newEmployee[index].selected = true;
      const check = this.listItemSynch.employee.newEmployee.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedEmpNewAll = true;
      }
    }
  }
  // select Emp out
  selectAllEmpOut() {
    console.log(this.listItemSynch.employee.outOfHRMS);
    if (this.selectedEmpOutAll) {
      this.listItemSynch.employee.outOfHRMS.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.employees.outOfHRMS[index].selected = true;
      });
    }
    else {
      this.listItemSynch.employee.outOfHRMS.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.employees.outOfHRMS[index].selected = false;
      });
    }
  }

  checkSelectedEmpOut(id) {
    var index = this.listItemSynch.employee.outOfHRMS.findIndex(x => x.id == id);
    this.listItemSynch.employee.outOfHRMS[index].selected = !this.listItemSynch.employee.outOfHRMS[index].selected;
    if (this.listItemSynch.employee.outOfHRMS[index].selected == false) {
      console.log(this.listItemSynch.employee.outOfHRMS[index].selected);
      this.listSyncFinal.employees.outOfHRMS[index].selected = false;
      this.selectedEmpOutAll = false;
    } else {
      this.listSyncFinal.employees.outOfHRMS[index].selected = true;
      const check = this.listItemSynch.employee.outOfHRMS.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedEmpOutAll = true;
      }
    }
  }

  // select team match
  selectAllTeamMatch() {
    console.log(this.listItemSynch.team.matchedTeam);
    if (this.selectedTeamMatchAll) {
      this.listItemSynch.team.matchedTeam.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.teams.matchedTeam[index].selected = true;
      });
    }
    else {
      this.listItemSynch.team.matchedTeam.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.teams.matchedTeam[index].selected = false;
      });
    }
  }
  checkSelectedTeamMatch(id) {
    var index = this.listItemSynch.team.matchedTeam.findIndex(x => x.id == id);
    this.listItemSynch.team.matchedTeam[index].selected = !this.listItemSynch.team.matchedTeam[index].selected;
    if (this.listItemSynch.team.matchedTeam[index].selected == false) {
      console.log(this.listItemSynch.team.matchedTeam[index].selected);
      this.listSyncFinal.teams.matchedTeam[index].selected = false;
      this.selectedTeamMatchAll = false;
    } else {
      this.listSyncFinal.teams.matchedTeam[index].selected = true;
      const check = this.listItemSynch.team.matchedTeam.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedTeamMatchAll = true;
      }
    }
  }

  // select team new
  selectAllTeamNew() {
    console.log(this.listItemSynch.team.newTeam);
    if (this.selectedTeamNewAll) {
      this.listItemSynch.team.newTeam.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.teams.newTeam[index].selected = true;
      });
    }
    else {
      this.listItemSynch.team.newTeam.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.teams.newTeam[index].selected = false;
      });
    }
  }

  checkSelecteTeamNew(id) {
    var index = this.listItemSynch.team.newTeam.findIndex(x => x.id == id);
    this.listItemSynch.team.newTeam[index].selected = !this.listItemSynch.team.newTeam[index].selected;
    if (this.listItemSynch.team.newTeam[index].selected == false) {
      console.log(this.listItemSynch.team.newTeam[index].selected);
      this.listSyncFinal.teams.newTeam[index].selected = false;
      this.selectedTeamNewAll = false;
    } else {
      this.listSyncFinal.teams.newTeam[index].selected = true;
      const check = this.listItemSynch.team.newTeam.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedTeamNewAll = true;
      }
    }
  }
  // select Team out
  selectAllTeamOut() {
    console.log(this.listItemSynch.team.outOfHRMS);
    if (this.selectedTeamOutAll) {
      this.listItemSynch.team.outOfHRMS.forEach((e, index) => {
        e.selected = true;
        this.listSyncFinal.teams.outOfHRMS[index].selected = true;
      });
    }
    else {
      this.listItemSynch.team.outOfHRMS.forEach((e, index) => {
        e.selected = false;
        this.listSyncFinal.teams.outOfHRMS[index].selected = false;
      });
    }
  }

  checkSelectedTeamOut(id) {
    var index = this.listItemSynch.team.outOfHRMS.findIndex(x => x.id == id);
    this.listItemSynch.team.outOfHRMS[index].selected = !this.listItemSynch.team.outOfHRMS[index].selected;
    if (this.listItemSynch.team.outOfHRMS[index].selected == false) {
      console.log(this.listItemSynch.team.outOfHRMS[index].selected);
      this.listSyncFinal.teams.outOfHRMS[index].selected = false;
      this.selectedTeamOutAll = false;
    } else {
      this.listSyncFinal.teams.outOfHRMS[index].selected = true;
      const check = this.listItemSynch.team.outOfHRMS.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedTeamOutAll = true;
      }
    }
  }


}
