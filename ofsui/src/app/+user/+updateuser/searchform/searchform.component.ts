import { Component, OnInit } from '@angular/core';
import {User} from "../../../core/redux/model/user.model";
import {Subject} from "rxjs";
import {UserAPIService} from "../../../core/api/userapi.service";

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

  constructor(private userApi: UserAPIService) { }

  ngOnInit() {
    this.request
        .debounceTime(400)
        .distinctUntilChanged()
        .subscribe(
            request => {
              console.log(request);
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

}
