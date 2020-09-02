import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
declare var require: any;
import * as moment from 'moment';
const data: any = require('./data.json');
import { AccountApiService } from './../api-services/account-api.service';
import { ToastrService } from 'ngx-toastr';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { SignatureService } from '../api-services/signature.services';
import { formatDistance } from 'date-fns';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

export interface Chart {
	type: ChartType;
	data: Chartist.IChartistData;
	options?: any;
	responsiveOptions?: any;
	events?: ChartEvent;
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	employees: any;
	signatureInvalid: any;
	size: NzButtonSize = 'large';
	disableBtnRevert: boolean = false;
	isSendNotifyRulesLoading = false;
	isSpinning = false;
	employeeSelected: any;
	time = formatDistance(new Date(), new Date('07/07/2020'));
	listActivityLog: any;
	list: any = new Array;
	isNewEmp: boolean = true;
	isLogged: boolean = false;
	isCompletePrimarySetting = false;
	author: string = localStorage.getItem('username');
	panelss = [
		{
			name: 'Employee',
		},
		{
			name: 'Team'
		},
		{
			name: 'Department'
		}
	];

	constructor(
		private employeeApi: AccountApiService,
		private toast: ToastrService,
		private modal: NzModalService,
		private signatureService: SignatureService,
		private router: Router,
	) { }
	// Barchart
	barChart1: Chart = {
		type: 'Bar',
		data: data['Bar'],
		options: {
			seriesBarDistance: 30,
			high: 100,

			axisX: {
				showGrid: true,
				offset: 20
			},
			axisY: {
				showGrid: true,
				offset: 40
			},
			height: 380
		},

		responsiveOptions: [
			[
				'screen and (min-width: 640px)',
				{
					axisX: {
						labelInterpolationFnc: function (
							value: number,
							index: number
						): string {
							return index % 1 === 0 ? `${value}` : null;
						}
					}
				}
			]
		]
	};
	goToSettingPage(): void {
		this.router.navigate(['/company-config-connection']);
	}
	checkCompleteSetting(): void {
		this.isSpinning = true;
		let id = localStorage.getItem('id');
		this.employeeApi.checkPrimarySetting(id).subscribe(
			(res: any) => {
				if (res.status) {
					this.isCompletePrimarySetting = true;
					this.getNewEmployees();
					this.getInvalidSignature();
					this.getActivityLog();
				} else {
					this.isCompletePrimarySetting = false;
				}
				this.isSpinning = false;
			}
		)
	}

	// This is for the donute chart
	donuteChart1: Chart = {
		type: 'Pie',
		data: data['Pie'],
		options: {
			donut: false,
			height: 260,
			showLabel: true,
			animate: true,


		}
	};

	ngOnInit() {
		this.checkCompleteSetting();
	}

	getNewEmployees() {
		const listAccount = [];
		this.employeeApi.getAllEmployee().subscribe((res) => {
			// const employeesData: any = res;
			this.employees = res;
			this.employees.forEach((element => {
				let item = {};
				item['id'] = element.id;
				item['primary_email'] = element.primary_email;
				item['first_name'] = element.first_name;
				item['last_name'] = element.last_name;
				item['created_date'] = moment.utc(element.created_date).local().format('LLLL');
				listAccount.push(item);
			}))
			if (this.employees.length == 0) {
				this.isNewEmp = false;
			}
			this.employees = listAccount;
			console.log(res);
		},
			(error) => {
				this.toast.error('Server is not avaiable!');
			})
	}

	getInvalidSignature() {
		this.employeeApi.getInvalidSignature().subscribe((res) => {
			// const employeesData: any = res;
			this.signatureInvalid = res;
			console.log(res);
			if (!this.signatureInvalid.data || !this.signatureInvalid.data) {
				this.disableBtnRevert = true;
			} else {
				this.disableBtnRevert = false;
				this.signatureInvalid = this.signatureInvalid.data;

			}

		}),
			(error) => {
				this.toast.error("Server is not available")
			}
	}

	showConfirmNotifySignatureRules(): void {
		this.modal.confirm({
			nzTitle: '<i>Do you want to send notify mail?</i>',
			nzContent: '<b>It will send mail notify to all employees by company gmail.</b>',
			nzOkText: "OK, do it!",
			nzOnOk: () => this.sendMailRemind()
		});
	}

	sendMailRemind(): void {
		// this.handleCloseModel();
		this.isSendNotifyRulesLoading = true;
		this.isSpinning = true;
		let id = localStorage.getItem('id');
		this.signatureService.sendMailRemindEmployees(id).subscribe(
			(res) => {
				if (res) {
					this.toast.success('Send mails successfully!');
				} else {
					this.toast.error('Some Error!')
				}

				this.isSendNotifyRulesLoading = false;
				this.isSpinning = false;
			}
		)
	}

	setDefault(emp): void {
		this.employeeSelected = emp.message;
		console.log(this.employeeSelected);

	}

	getActivityLog(): void {
		this.employeeApi.getActivityLog().subscribe((res) => {
			this.listActivityLog = res;

			this.listActivityLog.forEach((element => {
				var EmpObject = new Object();
				var TeamObject = new Object();
				var DepartmentObject = new Object();
				let newEmployeeList = [];
				let updateEmployeeList = [];
				let deleteEmployeeList = [];
				let newTeamList = [];
				let updateTeamList = [];
				let deleteTeamList = [];
				let newDepartmentList = [];
				let updateDepartmentList = [];
				let deleteDepartmentList = [];
				var item = new Object();
				item['name'] = element.name;
				item['modified_date'] = moment.utc(element.modified_date).local().format('LLLL');
				item['status'] = element.status == 1;

				/* mapping model employee
				*  author: son
				*/

				element.employee.newEmp.forEach(newEmpItem => {
					let newEmp = new Object();
					newEmp['type'] = newEmpItem.type;
					newEmp['modified_date'] = moment.utc(newEmpItem.modified_date).local().format('LLLL');
					newEmp['primary_email'] = newEmpItem.employee.primary_email;
					newEmp['personal_email'] = newEmpItem.employee.personal_email;
					newEmp['phone'] = newEmpItem.employee.phone;
					newEmp['address'] = newEmpItem.employee.address;
					newEmp['first_name'] = newEmpItem.employee.first_name;
					newEmp['last_name'] = newEmpItem.employee.last_name;
					newEmp['position'] = newEmpItem.employee.position_in_company.name;
					newEmp['department'] = newEmpItem.employee.department.name;
					newEmployeeList.push(newEmp);
				});
				element.employee.updateEmp.forEach(updateEmpItem => {
					let updateEmp = new Object();
					console.log(JSON.stringify(updateEmpItem) + 'llllll');
					
					updateEmp['type'] = updateEmpItem.type;
					updateEmp['modified_date'] = moment.utc(updateEmpItem.modified_date).local().format('LLLL');
					updateEmp['primary_email'] = updateEmpItem.employee.primary_email;
					updateEmp['personal_email'] = updateEmpItem.employee.personal_email;
					updateEmp['phone'] = updateEmpItem.employee.phone;
					updateEmp['address'] = updateEmpItem.employee.address;
					updateEmp['first_name'] = updateEmpItem.employee.first_name;
					updateEmp['last_name'] = updateEmpItem.employee.last_name;
					updateEmp['position'] = updateEmpItem.employee.position_in_company.name;
					updateEmp['department'] = updateEmpItem.employee.department.name;
					updateEmployeeList.push(updateEmp);
				});
				element.employee.deleteEmp.forEach(deleteEmpItem => {
					let deleteEmp = new Object();
					deleteEmp['type'] = deleteEmpItem.type;
					deleteEmp['modified_date'] = moment.utc(deleteEmpItem.modified_date).local().format('LLLL');
					deleteEmp['primary_email'] = deleteEmpItem.employee.primary_email;
					deleteEmp['personal_email'] = deleteEmpItem.employee.personal_email;
					deleteEmp['phone'] = deleteEmpItem.employee.phone;
					deleteEmp['address'] = deleteEmpItem.employee.address;
					deleteEmp['first_name'] = deleteEmpItem.employee.first_name;
					deleteEmp['last_name'] = deleteEmpItem.employee.last_name;
					deleteEmp['position'] = deleteEmpItem.employee.position_in_company.name;
					deleteEmp['department'] = deleteEmpItem.employee.department.name;
					deleteEmployeeList.push(deleteEmp);
				});
				//end
				/* mapping model team
				*  author: son
				*/
				element.team.newTeam.forEach(newTeamItem => {
					let newTeam = new Object();
					newTeam['type'] = newTeamItem.type;
					newTeam['modified_date'] = moment.utc(newTeamItem.modified_date).local().format('LLLL');
					newTeam['email'] = newTeamItem.team.email;
					newTeam['description'] = newTeamItem.team.description;
					newTeam['name'] = newTeamItem.team.name;
					newTeamList.push(newTeam);
				});
				element.team.updateTeam.forEach(updateTeamItem => {
					let updateTeam = new Object();
					updateTeam['type'] = updateTeamItem.type;
					updateTeam['modified_date'] = moment.utc(updateTeamItem.modified_date).local().format('LLLL');
					updateTeam['email'] = updateTeamItem.team.email;
					updateTeam['description'] = updateTeamItem.team.description;
					updateTeam['name'] = updateTeamItem.team.name;
					updateTeamList.push(updateTeam);
				});
				element.team.deleteTeam.forEach(deleteTeamItem => {
					let deleteTeam = new Object();
					deleteTeam['type'] = deleteTeamItem.type;
					deleteTeam['modified_date'] = moment.utc(deleteTeamItem.modified_date).local().format('LLLL');
					deleteTeam['email'] = deleteTeamItem.team.email;
					deleteTeam['description'] = deleteTeamItem.team.description;
					deleteTeam['name'] = deleteTeamItem.team.name;
					deleteTeamList.push(deleteTeam);
				});
				//end
				/* mapping model department
				*  author: son
				*/
				element.department.newDepartment.forEach(newDepItem => {
					let newDepartment = new Object();
					newDepartment['type'] = newDepItem.type;
					newDepartment['modified_date'] = moment.utc(newDepItem.modified_date).local().format('LLLL');
					newDepartment['email'] = newDepItem.department.email;
					newDepartment['description'] = newDepItem.department.description;
					newDepartment['name'] = newDepItem.department.name;
					newDepartmentList.push(newDepartment);
				});
				element.department.updateDepartment.forEach(updateDepItem => {
					let updateDepartment = new Object();
					updateDepartment['type'] = updateDepItem.type;
					updateDepartment['modified_date'] = moment.utc(updateDepItem.modified_date).local().format('LLLL');
					updateDepartment['email'] = updateDepItem.department.email;
					updateDepartment['description'] = updateDepItem.department.description;
					updateDepartment['name'] = updateDepItem.department.name;
					updateDepartmentList.push(updateDepartment);
				});
				element.department.deleteDepartment.forEach(deleteDepItem => {
					let deleteDepartment = new Object();
					deleteDepartment['type'] = deleteDepItem.type;
					deleteDepartment['modified_date'] = moment.utc(deleteDepItem.modified_date).local().format('LLLL');
					deleteDepartment['email'] = deleteDepItem.department.email;
					deleteDepartment['description'] = deleteDepItem.department.description;
					deleteDepartment['name'] = deleteDepItem.department.name;
					deleteDepartmentList.push(deleteDepartment);
				});
				EmpObject['newEmployeeList'] = newEmployeeList;
				EmpObject['updateEmployeeList'] = updateEmployeeList;
				EmpObject['deleteEmployeeList'] = deleteEmployeeList;
				TeamObject['newTeamList'] = newTeamList;
				TeamObject['updateTeamList'] = updateTeamList;
				TeamObject['deleteTeamList'] = deleteTeamList;
				DepartmentObject['newDepartmentList'] = newDepartmentList;
				DepartmentObject['updateDepartmentList'] = updateDepartmentList;
				DepartmentObject['deleteDepartmentList'] = deleteDepartmentList;

				item['employee'] = EmpObject;
				item['team'] = TeamObject;
				item['department'] = DepartmentObject;
				//end
				console.log(this.list);
				this.list.push(item);
			}))
			if (this.list.length == 0) {
				this.isLogged = true;
			}
		})
	}
}
