import { Component, OnInit } from '@angular/core';
import {UserSearchService} from "../searchform/searchform.service";

@Component({
  selector: 'app-userresulttable',
  templateUrl: './userresulttable.component.html'})
export class UserresulttableComponent implements OnInit {

  constructor(private userSearchService: UserSearchService) { }

  public items: any[];
  public count = 0;

  ngOnInit() {
    this.userSearchService.searchResultAnnounced$.subscribe(
        results => {
          this.items = results.items;
          this.count = results.count;
        }
    );
  }

}
