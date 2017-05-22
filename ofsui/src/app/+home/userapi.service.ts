import { Injectable } from '@angular/core';
import {RequestOptions, Http, Headers} from "@angular/http";

@Injectable()
export class UserAPIService {
    public user: any;

    constructor(private http: Http) {
        this.user = {
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
            "password": ""
        }
    }

    getUser() {
        return this.user;
    }

    setToken(token: any) {
        this.user.token = token;
    }

    retrieveUser() {
        console.log("User Token: " + this.user.token);
        let headers = new Headers({ "Authorization": "Bearer "+this.user.token });
        let options = new RequestOptions({ "headers": headers });
        this.http.get("http://localhost:8082/users/token", options)
            .subscribe(
                result => {
                    this.user = result.json();
                    console.log("User with id: " + this.user.id + " retrieved");
                },
                error => {
                    console.error('\n', error);
                    console.log('\n', 'Unable to get user by token', '\n\n');
                }
            );
    }
}