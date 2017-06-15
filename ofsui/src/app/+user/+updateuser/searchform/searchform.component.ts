import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Subject, Observable} from "rxjs";
import {UserAPIService} from "../../../core/api/userapi.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {Response} from "@angular/http";
import {UserSearchService} from "./searchform.service";


@Component({
  selector: 'app-searchform',
  templateUrl: './searchform.component.html'
})
export class SearchformComponent implements OnInit {

  public username: string;
  public role: string;
  public emailaddress: string;
  public firstname: string;
  public lastname: string;
  public activeflag: string;

  request: Subject<any> = new Subject<any>();

  constructor(private userApi: UserAPIService, private httpExceptionHandler: HttpExceptionHandler,
              private userSearchService: UserSearchService) { }

  ngOnInit() {
    this.userSearchService.setPageLimit(10);
    this.request
        .debounceTime(400)
        .distinctUntilChanged()
        .subscribe(
            request => {
              this.userSearchService.setRequest(request);
              this.userApi.search(request,this.userSearchService.getPageLimit(),0)
                  .map(this.extractData)
                  .catch(this.handleError)
                  .subscribe(
                  result => {
                      this.userSearchService.announceSearchResults(result);
                  },
                  error => {
                    this.httpExceptionHandler.handleException(error);
                  }
              );
            }
        )
  }

  public changed(text: string) {
    this.request.next(this.generateRequest());
  }

  private generateRequest(): any {

    this.setEmptyStringsToUndefined();

    var af = undefined;

    if(this.activeflag) {
      console.log("ActiveFlag isn't undefined");
      af = (this.activeflag === "true")
    }

    return {
      firstName: this.firstname,
      lastName: this.lastname,
      emailAddress: this.emailaddress,
      userName: this.username,
      role: this.role,
      activeFlag: af
    }
  }

  private setEmptyStringsToUndefined():void {
    if(this.firstname === "") {
      this.firstname = undefined;
    }

    if(this.lastname === "") {
      this.lastname = undefined;
    }

    if(this.emailaddress === "") {
      this.emailaddress = undefined;
    }

    if(this.username === "") {
      this.username = undefined;
    }

    if(this.role === "") {
      this.role = undefined;
    }

    if(this.activeflag === "") {
      console.log("activeFlag is empty string");
      this.activeflag = undefined;
    }
  }

  private extractData(res:Response) {
    return res.json();
  }

  private handleError(error:any) {
    return Observable.throw(error);
  }

}
