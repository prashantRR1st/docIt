import { Injectable } from '@angular/core';
import {Response} from '@angular/http';
import { HttpClient} from '@angular/common/http';

import { Item } from '../../models/item';
import { Case } from '../../models/case';
import { SpeechApi } from '../api/api';

@Injectable()
export class Items {

  items: Case[] = [];
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

  constructor(public http:HttpClient, public api: SpeechApi) {

    let items: any;

    this.getData(http).subscribe((data) => {
      items = data;
      for (let item of items) {
        this.items.push(new Case(item));
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

  add(item, currLength: number) {
    let newItem: any = {
      "id": currLength+1,
      "title": item.name,
      "patientName": item.patientName,
      "date": item.date,
      "notes":0,
      "voiceMemos":0,
      "videos":0,
      "photos":0,
      "profilePic": item.profilePic,
      "about": item.about,
    };

    this.postData(this.http, newItem);
  }

  delete(item: Item) {
  }

  getData(http: HttpClient) {
    return this.http.get("assets/data/cases.json")
        .map((res:Response) => res);
  }

  postData(http: HttpClient, item) {
    // return this.http.post("assets/data/cases.json", item)
    //     .subscribe(data => {
    //       console.log(data);
    //     })
  }

}
