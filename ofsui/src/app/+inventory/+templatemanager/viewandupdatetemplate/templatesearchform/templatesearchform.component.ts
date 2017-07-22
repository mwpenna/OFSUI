import { Component, OnInit } from '@angular/core';
import {Subject, Observable} from "rxjs";
import {TemplateAPIService} from "../../../../core/api/templateapi.service";
import {HttpExceptionHandler} from "../../../../core/api/httpexceptionhandler";
import {TemplateSearchService} from "./templatesearch.service";
import {Response} from "@angular/http";

@Component({
  selector: 'app-templatesearchform',
  templateUrl: './templatesearchform.component.html'
})
export class TemplatesearchformComponent implements OnInit {

  public name: string;
  public propName: string;

  request: Subject<any> = new Subject<any>();

  constructor(private templateAPI: TemplateAPIService, private httpExceptionHandler: HttpExceptionHandler,
              private templateSearchService: TemplateSearchService) { }

  ngOnInit() {
    this.templateSearchService.setPageLimit(10);
    this.request
        .debounceTime(400)
        .distinctUntilChanged()
        .subscribe(
            request => {
              this.templateSearchService.setRequest(request);
              this.templateAPI.search(request, this.templateSearchService.getPageLimit(), 0)
                  .map(this.extractData)
                  .catch(this.handleError)
                  .subscribe(
                      result => {
                        console.log(result);
                        this.templateSearchService.announceSearchResults(result);
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

    if(this.propName === undefined) {
      return {
        name: this.name
      }
    }
    else {
      return {
        name: this.name,
        props: [{
          name: this.propName
        }]
      }
    }
  }

  private setEmptyStringsToUndefined(): void {
    if(this.name === "") {
      this.name = undefined;
    }

    if(this.propName === "") {
      this.propName = undefined;
    }
  }

  private extractData(res:Response) {
    return res.json();
  }

  private handleError(error:any) {
    return Observable.throw(error);
  }

}
