import { Component, AfterViewInit, OnInit } from '@angular/core';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
declare var require: any;

const data: any = require('./data.json');
import { AccountApiService } from './../api-services/account-api.service';
import { ToastrService } from 'ngx-toastr';
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

	constructor(
		private employeeApi: AccountApiService,
		private toast: ToastrService
	) {}
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
						labelInterpolationFnc: function(
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

	ngOnInit(){
		this.getNewEmployees();
	}

	getNewEmployees(){
		this.employeeApi.getAllEmployee().subscribe((res) => {
			const employeesData: any = res;
			this.employees = res;
		// 	employeesData.forEach(element => {
		// 	console.log(element);
		// 		let item = {};
		// 		item['first_name'] = element.first_name;
		// 		item['primary_email'] = element.primary_email;
		// 		this.employees.push(item);
		// 	});
		// 	console.log(this.employees);
		},
		(error) => {
		  this.toast.error('Server is not avaiable!');
		})
	}
}
