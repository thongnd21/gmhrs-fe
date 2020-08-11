import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "ngx-custom-validators";
import { SelectionModel } from '@angular/cdk/collections';
import { DepartmentApiService } from '../../api-services/department-api.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AccountApiService } from '../../api-services/account-api.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [];
  dataSource: any;

  column = [
    {
      prop: 'count',
    },
    {
      prop: 'departmentName',
      name: 'Department Name'
    },
    {
      prop: 'description',
      name: 'Description'
    },
    {
      prop: 'action',
    }
  ];

  constructor(
    private modalService: NgbModal,
    private depServices: DepartmentApiService,
    private toast: ToastrService,
    private accountService: AccountApiService,

  ) { }

  ngOnInit() {
    this.displayedColumns = this.column.map((c) => c.prop);
    this.getAll();
  }

  accountId = localStorage.getItem('id')
  getAll() {
    const listDepartment = [];
    this.depServices.getAllDepartment(this.accountId).subscribe(
      (res) => {
        const department: any = res;
        department.forEach(element => {
          let item = {};
          item['id'] = element.id;
          item['name'] = element.name;
          item['description'] = element.description;
          item['created_date'] = moment.utc(element.created_date).local().format('LLLL');
          item['modified_date'] = moment.utc(element.modified_date).local().format('LLLL');
          listDepartment.push(item);
        });
        console.log(listDepartment);
        this.dataSource = new MatTableDataSource(listDepartment);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.toast.error('Server is not avaiable!');
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  detailResponse = [];
  departmentName;
  detail(modal, row) {
    console.log(row);
    this.detailResponse = []
    this.departmentName = row.name;
    this.accountService.getAllEmployeeByDepartmentId(row.id).subscribe(
      (res: any) => {
        if (res.length != undefined || res.length > 0 || res != null) {
          for (let i = 0; i < res.length; i++) {
            var element = {};
            element["fullName"] = res[i].first_name + " " + res[i].last_name;
            element["primary_email"] = res[i].primary_email;
            this.detailResponse.push(element);
          }
        }
        this.modalService.open(modal, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });

      },
      (err) => {
        console.log(err);

      }
    )
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
