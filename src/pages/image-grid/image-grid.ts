import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';

/**
 * Generated class for the ImageGridPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-grid',
  templateUrl: 'image-grid.html',
})
export class ImageGridPage {

  galleryType = 'regular';
  case: Item;
  caseMedia: Item[] = [];
  imgMedia: Item[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.case = this.navParams.data.case;
    this.caseMedia = this.navParams.data.caseMedia;
    for (let item of this.caseMedia) {
      if (item.type == "img") {
        this.imgMedia.push(new Item(item));
      }
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageGridPage');
  }

}
