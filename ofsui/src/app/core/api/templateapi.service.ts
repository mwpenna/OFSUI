import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Store} from "@ngrx/store";
import {UserState} from "../redux/reducers/user.reducer";
import {User} from "../redux/model/user.model";
import {Observable} from "rxjs";

@Injectable()
export class TemplateAPIService{
    private currentUser: User;

    constructor(private http: Http, private store: Store<UserState>) {
        this.store.subscribe(
            (u) => {
                this.currentUser = u.currentUser;
            });
    }

    createTemplate(template: any): Observable<any> {
        let headers = new Headers({ "Authorization": "Bearer "+ this.currentUser.token,
            "Content-Type" : "application/json"});
        let options = new RequestOptions({"headers": headers});
        return this.http.post("http://localhost:8083/inventory/template", JSON.stringify(template), options);
    }

    getTemplateByCompanyId():Observable<any> {
        let headers = new Headers({ "Authorization": "Bearer "+ this.currentUser.token,
            "Content-Type" : "application/json"});
        let options = new RequestOptions({ "headers": headers });
        return this.http.get("http://localhost:8083/inventory/template/company/id/"+ this.currentUser.companyid + "?limit=50000&start=0", options);
    }
}