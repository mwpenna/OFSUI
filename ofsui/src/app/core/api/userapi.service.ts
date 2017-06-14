import { Injectable } from '@angular/core';
import {RequestOptions, Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {UserState} from "../redux/reducers/user.reducer";
import {User} from "../redux/model/user.model";

@Injectable()
export class UserAPIService {

    private currentUser: User;

    constructor(private http: Http, private store: Store<UserState>) {
        this.store.subscribe(
            (u) => {
                  this.currentUser = u.currentUser;
            });
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
        return this.http.get("http://localhost:8082/users/company/id/"+ this.currentUser.companyid + "?limit=50000&start=0", options);
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

    search(request: any, limit:number, start:number):Observable<any> {
        let headers = new Headers({ "Authorization": "Bearer "+ this.currentUser.token,
            "Content-Type" : "application/json"});
        let options = new RequestOptions({ "headers": headers });

        return this.http.post("http://localhost:8082/users/search?limit="+limit+"&start="+start, JSON.stringify(request), options);
    }

    private extractData(res:Response) {
        return res.json();
    }

    private handleError(error:any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
    
}