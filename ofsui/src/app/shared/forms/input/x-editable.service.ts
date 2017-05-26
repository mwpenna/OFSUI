import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class XEditableService {

    private fieldChange = new Subject<any>();

    fieldChangeAnnouced$ = this.fieldChange.asObservable();

    announceFieldChange(field: string, value: string) {
        var fieldChange = {
            "field" : field,
            "value" : value
        };

        console.log("Sending fieldChange value: " + JSON.stringify(fieldChange));
        this.fieldChange.next(fieldChange);
    }
}