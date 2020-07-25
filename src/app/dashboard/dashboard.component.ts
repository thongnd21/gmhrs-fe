import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
declare var require: any;

const data: any = require('./data.json');
import { AccountApiService } from './../api-services/account-api.service';
import { ToastrService } from 'ngx-toastr';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { SignatureService } from '../api-services/signature.services';
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
	employees: any;
	signatureInvalid: any;
	size: NzButtonSize = 'large';
	disableBtnRevert: boolean= false;
	isSendNotifyRulesLoading = false;
	isSpinning= false;

	constructor(
		private employeeApi: AccountApiService,
		private toast: ToastrService,
		private modal: NzModalService,
		private signatureService: SignatureService
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
		this.getNewEmployees();
		this.getInvalidSignature();
	}

	getNewEmployees() {
		this.employeeApi.getAllEmployee().subscribe((res) => {
			// const employeesData: any = res;
			this.employees = res;
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
			if(this.signatureInvalid.length === 0){
				this.disableBtnRevert = true;
			} else {
				this.disableBtnRevert = false;

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
		  nzOnOk: () => this.sendMailNotifyRules()
		});
	  }

	  sendMailNotifyRules(): void {
		this.isSendNotifyRulesLoading = true;
		this.isSpinning = true;
		let username = localStorage.getItem('username');
		this.signatureService.sendMailRulesChanges(username).subscribe(
		  (res) => {
			if (res) {
			  this.toast.success('Send mail notify to all of the employees successfully!')
			} else {
			console.log(res);
			
			  this.toast.error('Some error occurs!')
			}
			this.isSendNotifyRulesLoading = false;
			this.isSpinning = false;
		  }
		)
	  }
}
