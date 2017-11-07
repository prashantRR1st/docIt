import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Response} from '@angular/http';
import { HttpClient} from '@angular/common/http';

import { Item } from '../../models/item';
import { Api } from '../api/api';


@Injectable()
export class CaseMediaProvider {

  caseMedia: Item[] = [];

  constructor(public http: HttpClient) {
    let caseMedia: Item[];

        this.getData(http).subscribe((data) => {
          caseMedia = data;
          for (let item of caseMedia) {
            this.caseMedia.push(new Item(item));
          }
        });
  }

  query(params?: any) {
    //return this.api.get('/items', params);

    if (!params) {
      return this.caseMedia;
    }

    return this.caseMedia.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(item: Item) {
  }

  delete(item: Item) {
  }

  getData(http: HttpClient) {
    return this.http.get("assets/data/cases.json")
        .map((res:Response) => res);
  }

}
