import {Component, OnInit, ViewChild} from '@angular/core';
import {UserSearchService} from "../searchform/searchform.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {UserAPIService} from "../../../core/api/userapi.service";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {ModalDirective} from "ngx-bootstrap";


@Component({
  selector: 'app-userresulttable',
  templateUrl: './userresulttable.component.html'})
export class UserresulttableComponent implements OnInit {

  @ViewChild('lgModal') public lgModal:ModalDirective;

  constructor(private userSearchService: UserSearchService,private userApi: UserAPIService,
              private httpExceptionHandler: HttpExceptionHandler) { }

  public items: any[];
  public count = 0;
  public numPages: number[];
  public maxPage: number;
  public selectedPage:number=1;
  public updaateUserId: string;
  public user: any;

  public role;
  public activeflag;
  public passwordConfirm;
  public password1;
  public email;
  public lastname;
  public firstname;

    
  isPasswordConfirmError: boolean = false;
  passWordConfirmMessage: string = "";

  isEmailError: boolean = false;
  emailErrorMessage: string = "";

  ngOnInit() {
    this.userSearchService.searchResultAnnounced$.subscribe(
        results => {
          this.defaultPaginationValues();
          this.items = results.items;
          this.count = results.count;

          if((results.count/results.limit) != Math.floor((results.count/results.limit))) {
              this.numPages= this.setNumPages(Math.floor((results.count/results.limit))+1)
          }
          else {
              this.numPages=this.setNumPages(Math.floor((results.count/results.limit)));
          }
        }
    );
  }


  private defaultPaginationValues() {
      this.selectedPage=1;
      this.count=0;
  }

  private setNumPages(length:number){
      var x=[];
      var i=1;
      while(x.push(i++)<length){};
      this.maxPage = length;
      return x
  }

  public goToPage(page:number) {
      this.selectedPage = page;
      this.getNextPageData(this.selectedPage);
  }

  public previous() {
      this.selectedPage = this.selectedPage-1;
      this.getNextPageData(this.selectedPage);
  }

  public next() {
      this.selectedPage = this.selectedPage+1;
      this.getNextPageData(this.selectedPage);
  }

  public showUpdateUserModal(user:any) {
      this.user = user;
      this.updaateUserId = user.id;
      this.role=user.role;
      this.activeflag=user.activeFlag;
      this.email = user.emailAddress;
      this.lastname = user.lastName;
      this.firstname = user.firstName;
      this.password1 = undefined;
      this.passwordConfirm = undefined;
      this.isPasswordConfirmError = false;
      this.passWordConfirmMessage= "";
      this.lgModal.show();
  }

  public updateUser() {
      if(this.validatePasswordUpdate()) {
          console.log(JSON.stringify(this.generateUpdateRequest()));
          this.userApi.updateUserById(this.generateUpdateRequest(), this.updaateUserId)
              .subscribe(
                  result => {
                      this.getNextPageData(this.selectedPage);
                      this.lgModal.hide();
                  },
                  error => {
                      this.httpExceptionHandler.handleException(error);
                      var errors = error.json().errors;

                      for(var i = 0; i< errors.length; i++) {
                          console.log(errors[i].code);

                          if(errors[i].code == "user.emailaddress.exists") {
                              console.log("Email Address Exists");
                              this.isEmailError = true;
                              this.emailErrorMessage = "Email address already exists. Please try a different one.";
                              this.email = undefined;
                          }
                      }
                  }
              );
      }
  }

  private generateUpdateRequest():any {
    var role = undefined;
    var activeflag = undefined;
    var password = undefined;
    var email = undefined;
    var lastname = undefined;
    var firstname = undefined;

      if(this.user.role != this.role) {
          role = this.role;
      }

      if(this.user.activeFlag != this.activeflag) {
          activeflag = (this.activeflag === "true")
      }

      if(this.user.password != this.password1) {
          password = this.password1;
      }

      if(this.user.emailAddress != this.email) {
          email = this.email;
      }

      if(this.user.lastName != this.lastname) {
          lastname = this.lastname;
      }

      if(this.user.firstName != this.firstname) {
          firstname = this.firstname;
      }

      return {
          firstName: firstname,
          lastName: lastname,
          emailAddress: email,
          password: password,
          role: role,
          activeFlag: activeflag
      }

  }

  private validatePasswordUpdate():boolean {
      if(this.isFieldPresent(this.password1)) {
          if(this.isFieldPresent(this.passwordConfirm)) {
            if(this.passwordConfirm===this.password1) {
                return true;
            }
            else {
                this.isPasswordConfirmError = true;
                this.passWordConfirmMessage = "The passwords do not match please try again.";
                this.passwordConfirm = undefined;
                return false;
            }
          }
          else {
              this.isPasswordConfirmError = true;
              this.passWordConfirmMessage = "You must confirm the password."
            return false;
          }
      }

      return true;
  }

  private getNextPageData(page:number) {
      this.userApi.search(this.userSearchService.getRequest(), this.userSearchService.getPageLimit(), (this.userSearchService.getPageLimit()*(page-1)))
          .map(this.extractData)
          .catch(this.handleError)
          .subscribe(
              results => {
                  this.items = results.items;
                  this.count = results.count;
              },
              error => {
                  this.httpExceptionHandler.handleException(error);
              }
          );
  }

  private extractData(res:Response) {
      return res.json();
  }

  private handleError(error:any) {
      return Observable.throw(error);
  }

  private isFieldPresent(field: any):boolean {
    if(field == null || field == "") {
        return false;
    }

    return true;
  }
}
