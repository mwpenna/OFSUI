import { Component, OnInit } from '@angular/core';
import {UserSearchService} from "../searchform/searchform.service";
import {HttpExceptionHandler} from "../../../core/api/httpexceptionhandler";
import {UserAPIService} from "../../../core/api/userapi.service";
import {Response} from "@angular/http";
import {Observable} from "rxjs";


@Component({
  selector: 'app-userresulttable',
  templateUrl: './userresulttable.component.html'})
export class UserresulttableComponent implements OnInit {

  constructor(private userSearchService: UserSearchService,private userApi: UserAPIService,
              private httpExceptionHandler: HttpExceptionHandler) { }

  public items: any[];
  public count = 0;
  public numPages: number[];
  public maxPage: number;
  public selectedPage:number=1;

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

          console.log(this.maxPage);
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

  private getNextPageData(page:number) {
      this.userApi.search(this.userSearchService.getRequest(), this.userSearchService.getPageLimit(), (this.userSearchService.getPageLimit()*(page-1)))
          .map(this.extractData)
          .catch(this.handleError)
          .subscribe(
              results => {
                  console.log("Results: " );
                  console.log(results);
                  console.log(this.count);
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
}
