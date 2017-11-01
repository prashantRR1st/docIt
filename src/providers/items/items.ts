import { Injectable } from '@angular/core';
import {Response} from '@angular/http';
import { HttpClient} from '@angular/common/http';

import { Item } from '../../models/item';
import { Api } from '../api/api';

@Injectable()
export class Items {

  items: Item[] = [];
  response: any;
  defaultItem: any = {
    "id": 1,
    "title": "Percutaneous vertebroplasty",
    "patientName": "Burt Gerald",
    "date": "2017-10-26T18:25:43.511Z",
    "notes":0,
    "voiceMemos":0,
    "videos":0,
    "photos":0,
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt Gerald is a .",
  };

  constructor(public http:HttpClient, public api: Api) {

    let items: Item[];

    this.getData(http).subscribe((data) => {
      items = data;
      for (let item of items) {
        this.items.push(new Item(item));
      }
    });
   }

  query(params?: any) {
    //return this.api.get('/items', params);

    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
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
