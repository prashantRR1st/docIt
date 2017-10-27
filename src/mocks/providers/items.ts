import { Injectable } from '@angular/core';

import { Item } from '../../models/item';

@Injectable()
export class Items {
  items: Item[] = [];

  defaultItem: any = {
    "title": "title1",
    "patientName": "Burt Gerald",
    "date": "2017-10-26T18:25:43.511Z",
    "notes":0,
    "voiceMemos":0,
    "videos":0,
    "photos":0,
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt Gerald is a .",
  };


  constructor() {
    let items = [
      {
        "title": "Percutaneous vertebroplasty",
        "patientName": "Burt Gerald",
        "date": "2017-10-26T18:25:43.511Z",
        "notes":0,
        "voiceMemos":0,
        "videos":0,
        "photos":0,
        "profilePic": "assets/img/speakers/bear.jpg",
        "about": "Burt Gerald is ill ."
      },
      {
        "title": "Interspinous process decompression",
        "patientName": "Charlie Sheen",
        "date": "2017-10-26T18:25:43.511Z",
        "notes":0,
        "voiceMemos":0,
        "videos":0,
        "photos":0,
        "profilePic": "assets/img/speakers/cheetah.jpg",
        "about": "Charlie Sheen is ill."
      },
      {
        "title": "Krukenberg procedure",
        "patientName": "Donald Trump",
        "date": "2017-10-26T18:25:43.511Z",
        "notes":0,
        "voiceMemos":0,
        "videos":0,
        "photos":0,
        "profilePic": "assets/img/speakers/duck.jpg",
        "about": "Donald Trump is ill."
      },
      {
        "title": "Microfracture surgery",
        "patientName": "Eva Mendez",
        "date": "2017-10-26T18:25:43.511Z",
        "notes":0,
        "voiceMemos":0,
        "videos":0,
        "photos":0,
        "profilePic": "assets/img/speakers/eagle.jpg",
        "about": "Eva is ill."
      },
      {
        "title": "Taylor Spatial Frame",
        "patientName": "Ellie Goldbloom",
        "date": "2017-10-26T18:25:43.511Z",
        "notes":0,
        "voiceMemos":0,
        "videos":0,
        "photos":0,
        "profilePic": "assets/img/speakers/elephant.jpg",
        "about": "Ellie is ill."
      },
      {
        "title": "Vertebral fixation",
        "patientName": "Molly Weasley",
        "date": "2017-10-26T18:25:43.511Z",
        "notes":0,
        "voiceMemos":0,
        "videos":0,
        "photos":0,
        "profilePic": "assets/img/speakers/mouse.jpg",
        "about": "Molly is ill."
      },
      {
        "title": "Olecranon fracture",
        "patientName": "Paul Penrose",
        "date": "2017-10-26T18:25:43.511Z",
        "notes":0,
        "voiceMemos":0,
        "videos":0,
        "photos":0,
        "profilePic": "assets/img/speakers/puppy.jpg",
        "about": "Paul is is ill."
      }
    ];

    for (let item of items) {
      this.items.push(new Item(item));
    }
  }

  query(params?: any) {
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
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}
