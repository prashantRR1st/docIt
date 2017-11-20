import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Case } from '../../models/case';
import { CaseMedia } from '../../models/caseMedia';

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
  case: Case;
  caseMedia: CaseMedia[] = [];
  imgMedia: CaseMedia[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.case = this.navParams.data.case;
    this.caseMedia = this.navParams.data.caseMedia;
    for (let item of this.caseMedia) {
      if (item.type == "img") {
        this.imgMedia.push(new CaseMedia(item));
      }
    }
    console.log("case", this.case);
    console.log("caseMedia", this.caseMedia);
    console.log("imgMedia", this.imgMedia);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageGridPage');
  }

}
