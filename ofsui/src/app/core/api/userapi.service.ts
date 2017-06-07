import { Injectable } from '@angular/core';
import {RequestOptions, Http, Headers, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";
import {Store} from "@ngrx/store";
import {UserState} from "../redux/reducers/user.reducer";
import {User} from "../redux/model/user.model";

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

    private token: string = "";
    private observableUser: Observable<any>;
    private currentUser: User;

    constructor(private http: Http, private store: Store<UserState>) {
        this.user = new Subject();
        this.store.subscribe(
            (u) => {
                  this.currentUser = u.currentUser;
            });
    }

    setToken(token: any) {
        this.userInfo.token = token;
        this.token = token;
    }

    getToken():string {
        return this.token;
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
        let headers = new Headers({ "Authorization": "Bearer "+this.currentUser.token });
        let options = new RequestOptions({ "headers": headers });
        return this.http.get("http://localhost:8082/users/token", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createUser(user: any):Observable<any> {
        let headers = new Headers({ "Authorization": "Bearer "+ this.currentUser.token,
            "Content-Type" : "application/json"});
        let options = new RequestOptions({ "headers": headers });
        return this.http.post("http://localhost:8082/users", JSON.stringify(user), options)
    }

    getUsersByCompanyId():Observable<any> {
        let headers = new Headers({ "Authorization": "Bearer "+ this.currentUser.token,
            "Content-Type" : "application/json"});
        let options = new RequestOptions({ "headers": headers });
        return this.http.get("http://localhost:8082/users/company/id/"+ this.currentUser.companyid + "?limit=50000&start=0", options)
            .map(this.extractData)
            .catch(this.handleError)
    }

    getUserByToken():Observable<any> {
        let headers = new Headers({ "Authorization": "Bearer "+this.currentUser.token });
        let options = new RequestOptions({ "headers": headers });
        return this.http.get("http://localhost:8082/users/token", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserToken(username: any, password: any):Observable<any> {
        var encodedString = btoa(username + ":"+ password);

        let headers = new Headers({ "Authorization": "Basic "+encodedString });
        let options = new RequestOptions({ "headers": headers });
        return this.http.get("http://localhost:8082/users/getToken", options);
    }

    updateUser(request: any):Observable<any> {
        let headers = new Headers({ "Authorization": "Bearer "+ this.currentUser.token,
            "Content-Type" : "application/json"});
        let options = new RequestOptions({ "headers": headers });

        return this.http.post("http://localhost:8082/users/id/" + this.currentUser.id, JSON.stringify(request), options);
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