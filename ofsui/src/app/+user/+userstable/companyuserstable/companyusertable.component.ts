import {Component, OnInit} from "@angular/core";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {UserAPIService} from "../../../core/api/userapi.service";

@Component({
    selector: 'sa-company-user-table',
    templateUrl: './companyusertable.component.html',
})
export class CompanyUserTableComponent implements OnInit {
    options = {
        dom: "Bfrtip",
        ajax: (data, callback, settings) => {
            let headers = new Headers({ "Authorization": "Bearer "+ this.userApi.getToken(),
                "Content-Type" : "application/json"});
            let options = new RequestOptions({ "headers": headers });
            console.log("Token: " + this.userApi.userInfo.token);
            this.http.get("http://localhost:8082/users/company/id/"+ this.userApi.userInfo.company.id + "?limit=50000&start=0", options)
                .map(this.extractData)
                .catch(this.handleError)
                .subscribe((data) => {
                    console.log('data from rest endpoint', data);
                    callback({
                        aaData: data.items
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


    constructor(private http: Http, private userApi: UserAPIService) {}

    ngOnInit() {}

    private extractData(res: Response) {
        let body = res.json();
        if (body) {
            return body.data || body
        } else {
            return {}
        }
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}