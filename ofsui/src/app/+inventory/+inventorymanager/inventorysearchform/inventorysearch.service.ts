import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class InventorySearchService {
    private searchResultStream = new Subject<any>();
    private pageLimit = 1;
    private request: any;

    public searchResultAnnounced$ = this.searchResultStream.asObservable();

    public announceSearchResults(results: any) {
        this.searchResultStream.next(results);
    }

    public setPageLimit(limit: number):void {
        this.pageLimit = limit;
    }

    public getPageLimit():number {
        return this.pageLimit;
    }

    public setRequest(request:any):void {
        this.request = request;
    }

    public getRequest():any {
        return this.request;
    }

}