import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";

@Component({
    selector: 'sa-company-user-table',
    templateUrl: './companyusertable.component.html',
})
export class CompanyUserTableComponent implements OnInit {
    constructor(private http: Http) {}

    ngOnInit() {
        console.log("OnInit");
    }
}