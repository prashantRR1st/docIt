import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';

/**
 * Generated class for the MediaGridPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-media-grid',
  templateUrl: 'media-grid.html',
})
export class MediaGridPage {

  galleryType = 'regular';
  case: Item;
  caseMedia: Item[] = [];
  vidMedia: Item[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.case = this.navParams.data.case;
    this.caseMedia = this.navParams.data.caseMedia;
    console.log("Media Grid Page case Media",this.case);
    console.log("Media Grid Page case Media",this.caseMedia);
    for (let item of this.caseMedia) {
      if (item.type == "vid") {
        this.vidMedia.push(new Item(item));
      }
    }
  }

  ionViewDidLoad(navCtrl: NavController, navParams: NavParams) {
    console.log('ionViewDidLoad MediaGridPage');

  }

}
