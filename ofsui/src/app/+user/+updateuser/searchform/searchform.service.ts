import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class UserSearchService {
    private searchResultStream = new Subject<any>();

    public searchResultAnnounced$ = this.searchResultStream.asObservable();

    public announceSearchResults(results: any) {
        this.searchResultStream.next(results);
    }
}