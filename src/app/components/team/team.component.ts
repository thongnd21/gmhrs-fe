import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "ngx-custom-validators";
import {SelectionModel} from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TeamApiService} from '../../api-services/team-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = [];
  dataSource: any;
  grpForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  column = [
    {
      prop: 'count'
    },
    {
      prop: 'name',
      name: 'Group Name'
    },
    {
      prop: 'email',
      name: 'Email'
    },
    {
      prop: 'description',
      name: 'Description'
    }
  ];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toast : ToastrService,
    private teamService :TeamApiService
    ) { }

  ngOnInit() {
    this.displayedColumns = this.column.map((c) => c.prop);
    this.getAll();
  }

  getAll() {
    const listTeam = [];
    this.teamService.getAllTeam().subscribe(
      (res)=>{
        const data:any = res;
        data.forEach(element => {
          let item ={};
          item['id'] = element.id;
          item['name'] = element.name;
          item['email'] = element.email;
          item['description'] = element.description;
          item['created_date'] = moment.utc(element.created_date).local().format('LLLL');
          item['modified_date'] = moment.utc(element.modified_date).local().format('LLLL');
          listTeam.push(item);
        });
        this.dataSource = new MatTableDataSource(listTeam);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error)=>{
        this.toast.error("Server is not avaiable!");
      }
    );
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
