import {Component, OnInit} from "@angular/core";
import {UserAPIService} from "../../../core/api/userapi.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {error} from "util";


@Component({
    selector: 'sa-company-user-table',
    templateUrl: './companyusertable.component.html',
})
export class CompanyUserTableComponent implements OnInit {

    options = {
        dom: "Bfrtip",
        ajax: (data, callback, settings) => {
            this.userApi.getUsersByCompanyId()
                .map(this.extractData)
                .catch(this.handleError)
                .subscribe(
                    (data) => {
                        callback({
                            aaData: data.items
                        })
                    },
                    error => {
                        console.log("Inside subscribe error");
                        console.log(error);
                        this.httpExceptionHandler.handleException(error);
                    },
                )
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

    constructor(private userApi: UserAPIService, private httpExceptionHandler: HttpExceptionHandler) {}

    ngOnInit() {
    }

    private extractData(res:Response) {
        return res.json();
    }

    private handleError(error:any) {
        console.log("error");
        console.log(error);
        return Observable.throw(error);
    }

}