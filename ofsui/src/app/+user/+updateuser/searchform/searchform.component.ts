import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Subject, Observable} from "rxjs";
import {UserAPIService} from "../../../core/api/userapi.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {Response} from "@angular/http";


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

  @Output() searchResults: EventEmitter<any> = new EventEmitter();

  constructor(private userApi: UserAPIService, private httpExceptionHandler: HttpExceptionHandler) { }

  ngOnInit() {
    this.request
        .debounceTime(400)
        .distinctUntilChanged()
        .subscribe(
            request => {
              console.log(request);
              this.userApi.search(request)
                  .map(this.extractData)
                  .catch(this.handleError)
                  .subscribe(
                  result => {
                      this.searchResults.emit(result);
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
    return {
      firstName: this.firstname,
      lastName: this.lastname,
      emailAddress: this.emailaddress,
      userName: this.username,
      role: this.role,
      activeFlag: (this.activeflag === "true")
    }
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
