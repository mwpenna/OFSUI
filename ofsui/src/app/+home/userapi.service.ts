import { Injectable } from '@angular/core';
import {RequestOptions, Http, Headers, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";

@Injectable()
export class UserAPIService {
    public user: Subject<any>;

    public userInfo = {
        "href": "",
        "id": "",
        "firstName": "",
        "lastName": "",
        "company": {
            "href": "",
            "name": "",
            "id": ""
        },
        "role": "",
        "userName": "",
        "emailAddress": "",
        "token": "",
        "tokenExpDate": "",
        "activeFlag": false,
    }

    private observableUser: Observable<any>;

    constructor(private http: Http) {
        this.user = new Subject();
    }

    setToken(token: any) {
        this.userInfo.token = token;
    }

    getObservableUser():Observable<any> {

        if(this.observableUser == null) {
            this.observableUser = this.retrieveUser()
                .do((user)=> {
                    this.userInfo = user;
                    this.user.next(user)
                })
        }

        return this.observableUser;
    }

    updateObservableUser():Observable<any> {
        console.log("Updating user");
        this.observableUser = this.retrieveUser()
            .do((user)=> {
                this.userInfo = user;
                this.user.next(user)
            })

        return this.observableUser;
    }

    retrieveUser():Observable<any> {
        let headers = new Headers({ "Authorization": "Bearer "+this.userInfo.token });
        let options = new RequestOptions({ "headers": headers });
        return this.http.get("http://localhost:8082/users/token", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res:Response) {
        return res.json();
    }

    private handleError(error:any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}