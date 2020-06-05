import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CompanyServices } from '../../api-services/company.services';
import * as moment from 'moment';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  isLoading = true;
  column = [
    {
      prop: 'email',
      name: 'email'
    },
    {
      prop: 'username',
      name: 'username'
    },
    {
      prop: 'created_date',
      name: 'created_date'
    },
    {
      prop: 'modified_date',
      name: 'modified_date'
    },
    {
      prop: 'action',
      name: 'action'
    },
  ];
  dataSource;
  constructor(
    private companyServices: CompanyServices,
    public dialog: MatDialog,
    // private dialogRef : MatDialogRef<dialog>
  ) {

  }

  ngOnInit(): void {
    this.displayedColumns = this.column.map((c) => c.prop);
    this.getAllCompany();
  }

  getAllCompany() {
    this.companyServices.getAllCompany().subscribe(
      (data: any) => {
        let list = [];
        data.forEach(company => {
          let item = {};
          item['id'] = company.id;
          item['email'] = company.email;
          item['username'] = company.username;
          item['created_date'] = moment.utc(company.created_date).local().format('LLLL');
          item['modified_date'] = moment.utc(company.modified_date).local().format('LLLL');
          item['role_id'] = company.role_id;
          item['status_id'] = company.status_id;
          list.push(item);
          console.log(item);
        });
        console.log(list);
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  openDialog(dialog): void {
    const dialogRef = this.dialog.open(dialog, {
      width: '250px',
    });
  }

  onNoClick(): void {
    this.dialog.closeAll;
  }

  ngAfterViewInit() {

  }

  setPage(event) {

  }

}
