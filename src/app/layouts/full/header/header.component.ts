import { Component, ViewChild } from '@angular/core';
import { CompanyConnectionService } from '../../../api-services/company-connection-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SynchronizeService } from '../../../api-services/synchronize-api.service';
import { DepartmentSync } from '../../../model/listSyncDepartment';
import { TeamSync } from '../../../model/listSyncTeam';
import { EmployeeSync } from '../../../model/listSyncEmp';
import { MatMenuTrigger } from '@angular/material';
import { PositionSync } from '../../../model/listSyncPosition';
import * as moment from 'moment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})

export class AppHeaderComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  role = Number.parseInt(localStorage.getItem('roleId'));
  username;
  lastSyncTime = localStorage.getItem('last_sync_at');
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
  selectedAllPosition = true;
  employee_new_match = {};
  employee_out_match = {};
  loading = false;
  constructor(
    private companyConnectionService: CompanyConnectionService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private syncService: SynchronizeService
  ) { }
  panelOpenState = false;
  listItemSynch: any;
  listNewEmp = [];
  listOutEmp = [];
  listSyncFinal: any;
  isFirstSync = null;
  listSynchonize = {
    employees: {
      matchedEmployee: [],
      newEmployee: [],
      outOfHRMS: [],
    },
    departments: {
      matchedDepartment: [],
      newDepartment: [],
      outOfHRMS: [],
    },
    teams: {
      matchedTeam: [],
      newTeam: [],
      outOfHRMS: [],
    },
    positions: {
      matchedPosition: [],
      newPosition: [],
    }
  };
  listNewMember: [];
  listRemoveMember: [];

  open = (modal) =>
    this.modalService.open(modal, { windowClass: 'my-class', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });


  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  getListSynchronize(event, first, second) {
    this.loading = true;
    let accountId = localStorage.getItem('id');
    this.syncService.getListSynchronize(accountId).subscribe(
      (res: any) => {
        if(res.status == "fail"){
          this.toast.error("Connection method having problem. Can not request your system!");
          this.loading = false;
          return;
        }
        this.isFirstSync = res.is_first_sync;
        this.listItemSynch = res;
        const listSync = {
          department: new DepartmentSync,
          team: new TeamSync,
          employee: new EmployeeSync,
          position: new PositionSync
        }
        console.log(res);
        // department
        listSync.department.matchedDepartment = res.departments.matchedDepartment.map(d => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            modified_date: moment.utc(d.modified_date).local().format('LLLL'),
            created_date: moment.utc(d.created_date).local().format('LLLL'),
            gsuite_id: d.gsuite_id,
            email: d.email,
            selected: true
          }
        });
        listSync.department.newDepartment = res.departments.newDepartment.map(d => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            modified_date: moment.utc(d.modified_date).local().format('LLLL'),
            created_date: moment.utc(d.created_date).local().format('LLLL'),
            email: d.email,
            selected: true
          }
        });
        listSync.department.outOfHRMS = res.departments.outOfHRMS.map(d => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            modified_date: moment.utc(d.modified_date).local().format('LLLL'),
            created_date: moment.utc(d.created_date).local().format('LLLL'),
            email: d.email,
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
            modified_date: moment.utc(o.modified_date).local().format('LLLL'),
            created_date: moment.utc(o.created_date).local().format('LLLL'),
            gsuite_id: o.gsuite_id,
            selected: true,
            newMember: o.memberUpdated.newMember ? o.memberUpdated.newMember : [],
            outOfHRMS: o.memberUpdated.outOfHRMS ? o.memberUpdated.outOfHRMS : [],
          }
        });
        listSync.team.newTeam = res.teams.newTeam.map(o => {
          return {
            id: o.id,
            name: o.name,
            email: o.email,
            description: o.description,
            modified_date: moment.utc(o.modified_date).local().format('LLLL'),
            created_date: moment.utc(o.created_date).local().format('LLLL'),
            gsuite_id: o.gsuite_id,
            selected: true,
            newMember: o.members ? o.members : []
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
            modified_date: moment.utc(o.modified_date).local().format('LLLL'),
            personal_email: o.personal_email,
            phone: o.phone,
            primary_email: o.primary_email,
            position_id: o.position_id,
            vacation_start_date: moment.utc(o.vacation_start_date).local().format('LLLL'),
            vacation_end_date: moment.utc(o.vacation_end_date).local().format('LLLL'),
            position: o.position.name,
            department: o.department.name,
            selected: true
          }
        });
        listSync.employee.newEmployee = res.employees.newEmployee.map(o => {
          return {
            address: o.address,
            first_name: o.first_name,
            id: o.id,
            last_name: o.last_name,
            modified_date: moment.utc(o.modified_date).local().format('LLLL'),
            personal_email: o.personal_email,
            phone: o.phone,
            primary_email: o.primary_email,
            position_id: o.position_id,
            vacation_start_date: moment.utc(o.vacation_start_date).local().format('LLLL'),
            vacation_end_date: moment.utc(o.vacation_end_date).local().format('LLLL'),
            position: o.position.name,
            department: o.department.name,
            selected: true
          }
        });
        listSync.employee.outOfHRMS = res.employees.outOfHRMS.map(o => {
          if (this.isFirstSync == true) {
            return {
              id: o.id,
              address: o.addresses[0].formatted,
              fullName: o.name.fullName,
              primary_email: o.primaryEmail,
              gsuite_id: o.gsuite_id,
              last_name: o.last_name,
              personal_email: o.emails[0].address,
              phone: o.phones[0].value,
              selected: true
            }
          } else {
            return {
              id: o.id,
              address: o.address,
              department_id: o.department_id,
              first_name: o.first_name,
              primary_email: o.primary_email,
              gsuite_id: o.gsuite_id,
              last_name: o.last_name,
              personal_email: o.personal_email,
              phone: o.phone,
              hrms_id: o.hrms_id,
              selected: true
            }
          }
        });
        // position
        listSync.position.newPosition = res.positions.newPosition.map(o => {
          return {
            id: o.id,
            name: o.name,
            selected: true
          }
        });
        listSync.position.matchedPosition = res.positions.matchedPosition.map(o => {
          return {
            id: o.id,
            name: o.name,
            selected: true
          }
        });
        listSync.position.outOfHRMS = res.positions.outOfHRMSPosition.map(o => {
          return {
            id: o.id,
            name: o.name,
            selected: true
          }
        });
        this.listSyncFinal = listSync;
        this.listItemSynch = res;
        this.selectAllDepMatch(true);
        this.selectAllDepNew(true);
        this.selectAllDepOut(true);
        this.selectAllTeamMatch(true);
        this.selectAllTeamNew(true);
        this.selectAllTeamOut(true);
        this.selectAllEmpMatch(true);
        this.selectAllEmpNew(true);
        this.selectAllEmpOut(true);
        this.selectAllPosition(true);
        event.stopPropagation();
        this.loading = false;
        if (this.isFirstSync == true) {
          this.modalService.open(first, { windowClass: 'my-class', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          this.trigger.closeMenu()
          event.stopPropagation();
          this.loading = false;
        } else {
          this.modalService.open(second, { windowClass: 'my-class', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
          this.trigger.closeMenu()
          event.stopPropagation();
          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;
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
    this.loading = true;
    let syncList = {
      accountId: accountId,
      is_first_sync: this.isFirstSync,
      employees: this.listSynchonize.employees,
      teams: this.listSynchonize.teams,
      departments: this.listSynchonize.departments,
      positions: this.listSynchonize.positions
    }
    console.log(JSON.stringify(syncList));
    if (this.isFirstSync != null) {
      this.syncService.synchronize(syncList).subscribe(
        (res: any) => {
          this.loading = false;
          this.lastSyncTime = moment.utc(res.last_sync_date).local().format('LLLL');
          this.toast.success('Synchronize successfully!');
          // this.dashBoard.getActivityLog();
          localStorage.setItem('last_sync_at', this.lastSyncTime);
          this.closeModal();
        },
        (err) => {
          this.loading = false;
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
    this.listSynchonize = {
      employees: {
        matchedEmployee: [],
        newEmployee: [],
        outOfHRMS: [],
      },
      departments: {
        matchedDepartment: [],
        newDepartment: [],
        outOfHRMS: [],
      },
      teams: {
        matchedTeam: [],
        newTeam: [],
        outOfHRMS: [],
      },
      positions: {
        matchedPosition: [],
        newPosition: [],
      }
    };
    this.modalService.dismissAll();
  }
  doNotClose(event) {
    event.stopPropagation();
  }

  signOut() {
    localStorage.clear();
  }

  // select dep match
  selectAllDepMatch(selectAll = null) {
    if (selectAll != null) {
      this.selectedDepMatchAll = true;
    }
    if (this.selectedDepMatchAll) {
      this.listSyncFinal.department.matchedDepartment.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.departments.matchedDepartment.push(this.listItemSynch.departments.matchedDepartment[index]);
      });
    }
    else {
      this.listSynchonize.departments.matchedDepartment = [];
      this.listSyncFinal.department.matchedDepartment.forEach((e, index) => {
        e.selected = false;
      });
    }
  }

  checkSelectedDepMatch(id) {
    var index = this.listSyncFinal.department.matchedDepartment.findIndex(x => x.id == id);
    this.listSyncFinal.department.matchedDepartment[index].selected = !this.listSyncFinal.department.matchedDepartment[index].selected;
    if (this.listSyncFinal.department.matchedDepartment[index].selected == false) {
      this.listSynchonize.departments.matchedDepartment.splice(index, 1);
      this.selectedDepMatchAll = false;
    } else {
      this.listSynchonize.departments.matchedDepartment.push(this.listItemSynch.departments.matchedDepartment[index]);
      const check = this.listSyncFinal.department.matchedDepartment.find(x => x.selected == false);
      if (!check) {
        this.selectedDepMatchAll = true;
      }
    }
  }
  // select dep new
  selectAllDepNew(selectAll = null) {
    if (selectAll != null) {
      this.selectedAllPosition = true;
    }
    if (this.selectedAllPosition) {
      this.listSyncFinal.department.newDepartment.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.departments.newDepartment.push(this.listItemSynch.departments.newDepartment[index]);
      });
    }
    else {
      this.listSynchonize.departments.newDepartment = [];
      this.listSyncFinal.department.newDepartment.forEach((e, index) => {
        e.selected = false;

      });
    }
  }

  selectAllPosition(selectAll = null) {
    if (selectAll != null) {
      this.selectedDepNewAll = true;
    }
    if (this.selectedDepNewAll) {
      this.listSyncFinal.position.newPosition.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.positions.newPosition.push(this.listItemSynch.positions.newPosition[index]);
      });
    }
    else {
      this.listSynchonize.positions.newPosition = [];
      this.listSyncFinal.position.newPosition.forEach((e, index) => {
        e.selected = false;

      });
    }
  }

  checkSelectedDepNew(id) {
    var index = this.listSyncFinal.department.newDepartment.findIndex(x => x.id == id);
    this.listSyncFinal.department.newDepartment[index].selected = !this.listSyncFinal.department.newDepartment[index].selected;
    if (this.listSyncFinal.department.newDepartment[index].selected == false) {
      this.listSynchonize.departments.newDepartment.splice(index, 1);
      this.listSyncFinal.departments.newDepartment[index].selected = false;
      this.selectedDepNewAll = false;
    } else {
      this.listSynchonize.departments.newDepartment.push(this.listItemSynch.departments.newDepartment[index]);
      this.listSyncFinal.departments.newDepartment[index].selected = true;
      const check = this.listSyncFinal.department.newDepartment.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedDepNewAll = true;
      }
    }
  }
  // select dep out
  selectAllDepOut(selectAll = null) {
    if (selectAll != null) {
      this.selectedDepOutAll = true;
    }
    if (this.selectedDepOutAll) {
      this.listSyncFinal.department.outOfHRMS.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.departments.outOfHRMS.push(this.listItemSynch.departments.outOfHRMS[index]);

      });
    }
    else {
      this.listSynchonize.departments.outOfHRMS = [];
      this.listSyncFinal.department.outOfHRMS.forEach((e, index) => {
        e.selected = false;
      });
    }
  }

  checkSelectedDepOut(id) {
    var index = this.listSyncFinal.department.OutOfHRMS.findIndex(x => x.id == id);
    this.listSyncFinal.department.OutOfHRMS[index].selected = !this.listSyncFinal.department.OutOfHRMS[index].selected;
    if (this.listSyncFinal.department.OutOfHRMS[index].selected == false) {
      this.listSynchonize.departments.outOfHRMS.splice(index, 1);
      this.selectedDepOutAll = false;
    } else {
      this.listSynchonize.departments.outOfHRMS.push(this.listItemSynch.departments.OutOfHRMSDep[index]);
      const check = this.listSyncFinal.department.OutOfHRMS.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedDepOutAll = true;
      }
    }
  }

  // select emp match
  selectAllEmpMatch(selectAll = null) {
    if (selectAll != null) {
      this.selectedEmpMatchAll = true;
    }
    if (this.selectedEmpMatchAll) {
      this.listSyncFinal.employee.matchedEmployee.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.employees.matchedEmployee.push(this.listItemSynch.employees.matchedEmployee[index]);
      });
    }
    else {
      this.listSynchonize.employees.matchedEmployee = [];
      this.listSyncFinal.employee.matchedEmployee.forEach((e, index) => {
        e.selected = false;
      });
    }
  }

  checkSelectedEmpMatch(id) {
    var index = this.listSyncFinal.employee.matchedEmployee.findIndex(x => x.id == id);
    this.listSyncFinal.employee.matchedEmployee[index].selected = !this.listSyncFinal.employee.matchedEmployee[index].selected;
    if (this.listSyncFinal.employee.matchedEmployee[index].selected == false) {
      this.listSynchonize.employees.matchedEmployee.splice(index, 1);
      this.selectedEmpMatchAll = false;
    } else {
      this.listSynchonize.employees.matchedEmployee.push(this.listItemSynch.employees.matchedEmployee[index]);
      const check = this.listSyncFinal.employee.matchedEmployee.find(x => x.selected == false);
      if (!check) {
        this.selectedEmpMatchAll = true;
      }
    }
  }
  // select Emp new
  selectAllEmpNew(selectAll = null) {
    if (selectAll != null) {
      this.selectedEmpNewAll = true;
    }
    if (this.selectedEmpNewAll) {
      this.listSyncFinal.employee.newEmployee.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.employees.newEmployee.push(this.listItemSynch.employees.newEmployee[index]);
      });
    }
    else {
      this.listSynchonize.employees.newEmployee = [];
      this.listSyncFinal.employee.newEmployee.forEach((e, index) => {
        e.selected = false;
      });
    }
  }

  checkSelecteEmpNew(id) {
    var index = this.listSyncFinal.employee.newEmployee.findIndex(x => x.id == id);
    this.listSyncFinal.employee.newEmployee[index].selected = !this.listSyncFinal.employee.newEmployee[index].selected;
    console.log(this.listSyncFinal.employee.newEmployee[index].selected);
    if (this.listSyncFinal.employee.newEmployee[index].selected == false) {
      console.log(this.listSynchonize.employees.newEmployee);
      console.log(index);
      this.listSynchonize.employees.newEmployee.splice(index, 1);
      console.log(this.listSynchonize.employees.newEmployee);
      this.selectedEmpNewAll = false;
    } else {
      this.listSynchonize.employees.newEmployee.push(this.listItemSynch.employees.newEmployee[index]);
      const check = this.listSyncFinal.employee.newEmployee.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedEmpNewAll = true;
      }
    }
  }
  // select Emp out
  selectAllEmpOut(selectAll = null) {
    if (selectAll != null) {
      this.selectedEmpOutAll = true;
    }
    if (this.selectedEmpOutAll) {
      this.listSyncFinal.employee.outOfHRMS.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.employees.outOfHRMS.push(this.listItemSynch.employees.outOfHRMS[index]);
      });
    }
    else {
      this.listSynchonize.employees.outOfHRMS = [];
      this.listSyncFinal.employee.outOfHRMS.forEach((e, index) => {
        e.selected = false;
      });
    }
  }

  checkSelectedEmpOut(id) {
    var index = this.listSyncFinal.employee.outOfHRMS.findIndex(x => x.id == id);
    this.listSyncFinal.employee.outOfHRMS[index].selected = !this.listSyncFinal.employee.outOfHRMS[index].selected;
    if (this.listSyncFinal.employee.outOfHRMS[index].selected == false) {
      this.listSynchonize.employees.outOfHRMS.splice(index, 1);
      this.selectedEmpOutAll = false;
    } else {
      this.listSynchonize.employees.outOfHRMS.push(this.listItemSynch.employee.outOfHRMS[index]);
      const check = this.listSyncFinal.employee.outOfHRMS.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedEmpOutAll = true;
      }
    }
  }

  // select team match
  selectAllTeamMatch(selectAll = null) {
    if (selectAll != null) {
      this.selectedTeamMatchAll = true;
    }
    if (this.selectedTeamMatchAll) {
      this.listSyncFinal.team.matchedTeam.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.teams.matchedTeam.push(this.listItemSynch.teams.matchedTeam[index]);
      });
    }
    else {
      this.listSynchonize.teams.matchedTeam = [];
      this.listSyncFinal.team.matchedTeam.forEach((e, index) => {
        e.selected = false;
      });
    }
  }
  checkSelectedTeamMatch(id) {
    var index = this.listSyncFinal.team.matchedTeam.findIndex(x => x.id == id);
    this.listSyncFinal.team.matchedTeam[index].selected = !this.listSyncFinal.team.matchedTeam[index].selected;
    if (this.listSyncFinal.team.matchedTeam[index].selected == false) {
      this.listSynchonize.teams.matchedTeam.splice(index, 1);
      this.selectedTeamMatchAll = false;
    } else {
      this.listSynchonize.teams.matchedTeam.push(this.listItemSynch.teams.matchedTeam[index]);
      const check = this.listSyncFinal.team.matchedTeam.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedTeamMatchAll = true;
      }
    }
  }

  // select team new
  selectAllTeamNew(selectAll = null) {
    if (selectAll != null) {
      this.selectedTeamNewAll = true;
    }
    if (this.selectedTeamNewAll) {
      this.listSyncFinal.team.newTeam.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.teams.newTeam.push(this.listItemSynch.teams.newTeam[index]);
      });
    }
    else {
      this.listSynchonize.teams.newTeam = [];
      this.listSyncFinal.team.newTeam.forEach((e, index) => {
        e.selected = false;
      });
    }
  }

  checkSelectedTeamNew(id) {
    var index = this.listSyncFinal.team.newTeam.findIndex(x => x.id == id);
    this.listSyncFinal.team.newTeam[index].selected = !this.listSyncFinal.team.newTeam[index].selected;
    if (this.listSyncFinal.team.newTeam[index].selected == false) {
      this.listSynchonize.teams.newTeam.splice(index, 1);
      this.selectedTeamNewAll = false;
    } else {
      this.listSynchonize.teams.newTeam.push(this.listItemSynch.teams.newTeam[index]);
      const check = this.listSyncFinal.team.newTeam.find(x => x.selected == false);
      if (!check) {
        this.selectedTeamNewAll = true;
      }
    }
  }
  // select Team out
  selectAllTeamOut(selectAll = null) {
    if (selectAll != null) {
      this.selectedTeamOutAll = true;
    }
    if (this.selectedTeamOutAll) {
      this.listSyncFinal.team.outOfHRMS.forEach((e, index) => {
        e.selected = true;
        this.listSynchonize.teams.outOfHRMS.push(this.listItemSynch.teams.outOfHRMS[index]);
      });
    }
    else {
      this.listSynchonize.teams.outOfHRMS = [];
      this.listSyncFinal.team.outOfHRMS.forEach((e, index) => {
        e.selected = false;
      });
    }
  }

  checkSelectedTeamOut(id) {
    var index = this.listSyncFinal.team.outOfHRMS.findIndex(x => x.id == id);
    this.listSyncFinal.team.outOfHRMS[index].selected = !this.listSyncFinal.team.outOfHRMS[index].selected;
    if (this.listSyncFinal.team.outOfHRMS[index].selected == false) {
      this.listSynchonize.teams.outOfHRMS.splice(index, 1);
      this.selectedTeamOutAll = false;
    } else {
      this.listSynchonize.teams.outOfHRMS.push(this.listItemSynch.teams.outOfHRMS[index]);
      const check = this.listSyncFinal.team.outOfHRMS.find(x => x.selected == false);
      console.log(check);
      if (!check) {
        this.selectedTeamOutAll = true;
      }
    }
  }

  rowFirstNewSelected(item) {
    if (this.listNewEmp.length > 0) {
      if (this.listNewEmp[0].id === item.id) {
        this.listNewEmp = [];
      } else {
        let emp = this.listItemSynch.employees.newEmployee.find(x => x.id == item.id);
        this.listNewEmp[0] = emp;
      }
    } else {
      let emp = this.listItemSynch.employees.newEmployee.find(x => x.id == item.id);
      this.listNewEmp[0] = emp;
    }
    console.log(item.id);
    console.log(this.listNewEmp[0].id);
  }

  rowFirstOutSelected(item) {
    if (this.listOutEmp.length > 0) {
      if (this.listOutEmp[0].id === item.id) {
        this.listOutEmp = [];
      } else {
        let emp = this.listItemSynch.employees.outOfHRMS.find(x => x.id == item.id);
        this.listOutEmp[0] = emp;
      }
    } else {
      let emp = this.listItemSynch.employees.outOfHRMS.find(x => x.id == item.id);
      this.listOutEmp[0] = emp;
    }
    console.log(item.id);
    console.log(this.listOutEmp[0].id);
  }

  matchFirstNewAndOut() {
    this.listNewEmp[0]['gsuite_id'] = this.listOutEmp[0].gsuite_id;
    const index_new: number = this.listSyncFinal.employee.newEmployee.findIndex(x => x.id = this.listNewEmp[0].id);
    if (index_new !== -1) {
      this.listSyncFinal.employee.newEmployee.splice(index_new, 1);
      this.listSynchonize.employees.newEmployee.splice(index_new, 1);
    }
    const index_out: number = this.listSyncFinal.employee.outOfHRMS.findIndex(x => x.id = this.listOutEmp[0].id);
    if (index_out !== -1) {
      this.listSyncFinal.employee.outOfHRMS.splice(index_out, 1);
      this.listSynchonize.employees.outOfHRMS.splice(index_out, 1);
    }
    this.listSyncFinal.employee.matchedEmployee.push(this.listNewEmp[0]);
    this.listSynchonize.employees.matchedEmployee.push(this.listNewEmp[0]);
    console.log(this.listSynchonize);
    this.listNewEmp = [];
    this.listOutEmp = [];
  }

  rowNewSelected(item) {
    if (this.listNewEmp.length > 0) {
      if (this.listNewEmp[0].id === item.id) {
        this.listNewEmp = [];
      } else {
        let emp = this.listItemSynch.employees.newEmployee.find(x => x.id == item.id);
        this.listNewEmp[0] = emp;
      }
    } else {
      let emp = this.listItemSynch.employees.newEmployee.find(x => x.id == item.id);
      this.listNewEmp.push(emp);
    }
    console.log(this.listNewEmp);
  }

  rowOutSelected(item) {
    if (this.listOutEmp.length > 0) {
      if (this.listOutEmp[0].id === item.id) {
        this.listOutEmp = [];
      } else {
        let emp = this.listItemSynch.employees.outOfHRMS.find(x => x.id == item.id);
        this.listOutEmp[0] = emp;
      }
    } else {
      let emp = this.listItemSynch.employees.outOfHRMS.find(x => x.id == item.id);
      this.listOutEmp.push(emp);
    }
    console.log(this.listOutEmp);
  }

  matchNewAndOut() {
    this.listNewEmp[0]['gsuite_id'] = this.listOutEmp[0].gsuite_id;
    const index_new: number = this.listSyncFinal.employee.newEmployee.findIndex(x => x.id = this.listNewEmp[0].id);
    if (index_new !== -1) {
      this.listSyncFinal.employee.newEmployee.splice(index_new, 1);
      this.listSynchonize.employees.newEmployee.splice(index_new, 1);
    }
    const index_out: number = this.listSyncFinal.employee.outOfHRMS.findIndex(x => x.id = this.listOutEmp[0].id);
    if (index_out !== -1) {
      this.listSyncFinal.employee.outOfHRMS.splice(index_out, 1);
      this.listSynchonize.employees.outOfHRMS.splice(index_out, 1);
    }
    this.listSyncFinal.employee.matchedEmployee.push(this.listNewEmp[0]);
    this.listSynchonize.employees.matchedEmployee.push(this.listNewEmp[0]);
    this.listNewEmp = [];
    this.listOutEmp = [];
  }

  openDialog(item) {

  }
}
