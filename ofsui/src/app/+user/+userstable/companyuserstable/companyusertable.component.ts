import {Component, OnInit} from "@angular/core";
import {UserAPIService} from "../../../core/api/userapi.service";

@Component({
    selector: 'sa-company-user-table',
    templateUrl: './companyusertable.component.html',
})
export class CompanyUserTableComponent implements OnInit {

    options = {
        dom: "Bfrtip",
        ajax: (data, callback, settings) => {
            this.userApi.getUsersByCompanyId().subscribe((data) => {
                    console.log(data);
                    callback({
                        aaData: data.json().items
                    })
                })
        },
        columns: [
            { data: "id" },
            { data: "firstName" },
            { data: "lastName" },
            { data: "role" },
            { data: "userName" },
            { data: "emailAddress" },
            { data: "activeFlag" }
        ],
        buttons: [
            'copy', 'excel', 'pdf', 'print'
        ],
        paginationLength: ["true"]
    };

    constructor(private userApi: UserAPIService) {}

    ngOnInit() {
    }
}