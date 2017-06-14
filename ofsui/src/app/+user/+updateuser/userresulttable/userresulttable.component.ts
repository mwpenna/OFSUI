import { Component, OnInit } from '@angular/core';
import {UserSearchService} from "../searchform/searchform.service";

@Component({
  selector: 'app-userresulttable',
  templateUrl: './userresulttable.component.html'})
export class UserresulttableComponent implements OnInit {

  constructor(private userSearchService: UserSearchService) { }

  public items: any[];
  public count = 0;
  public numPages: number[];

  ngOnInit() {
    this.userSearchService.searchResultAnnounced$.subscribe(
        results => {
          this.items = results.items;
          this.count = results.count;

          if((results.count/results.limit) != Math.floor((results.count/results.limit))) {
              this.numPages= this.setNumPages(Math.floor((results.count/results.limit))+1)
          }
          else {
              this.numPages=this.setNumPages(Math.floor((results.count/results.limit)));
          }

          console.log(this.numPages);
        }
    );
  }

  private setNumPages(length:number){
      var x=[];
      var i=1;
      while(x.push(i++)<length){};
      return x
  }
}
