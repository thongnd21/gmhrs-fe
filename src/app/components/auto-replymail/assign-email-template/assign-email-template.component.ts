import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-email-template',
  templateUrl: './assign-email-template.component.html',
  styleUrls: ['./assign-email-template.component.css']
})
export class AssignEmailTemplateComponent implements OnInit {

  displayedColumns: string[] = [];

  dataSource: any = [
    { department: 'Yogurt', template_default: 159, template_assign_role: 6, },
    { department: 'Yogurt123', template_default: 1591, template_assign_role: 6, },
  ]

  column = [
    {
      prop: 'department',
      name: 'Department'
    },
    {
      prop: 'template_default',
      name: 'Template Default'
    },
    {
      prop: 'template_assign_role',
      name: 'Template Assign For role'
    },
    {
      prop: 'action',
      name: 'Action'
    }
  ];

  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.column.map((c) => c.prop);
  }

  openAssignTemplateMailModal(modal) {
    this.modalService.open(modal, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' });
  }

  fieldChang(event)
  {
    if(event.isUserInput) {
      console.log(event.source.value, event.source.selected);
    }
  }

}
