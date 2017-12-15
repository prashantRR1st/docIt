import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Case } from '../../models/case';
import { CaseMedia } from '../../models/caseMedia';

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
  case: Case;
  caseMedia: CaseMedia[] = [];
  vidMedia: CaseMedia[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.case = this.navParams.data.case;
    this.caseMedia = this.navParams.data.caseMedia;
    for (let item of this.caseMedia) {
      if (item.type == "vid") {
        this.vidMedia.push(new CaseMedia(item));
      }
    }
    console.log("media grid page", this.vidMedia);
  }

  ionViewDidLoad(navCtrl: NavController, navParams: NavParams) {
    console.log('ionViewDidLoad MediaGridPage');

  }

}
