import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Items } from '../../providers/providers';

import { Tab1Media } from '../pages';
import { Tab2Media } from '../pages';
import { Tab3Media } from '../pages';
import { Tab4Media } from '../pages';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {

  tab1Root: any = Tab1Media;
  tab2Root: any = Tab2Media;
  tab3Root: any = Tab3Media;
  tab4Root: any = Tab4Media;

  tab1Title = "Photos";
  tab2Title = "Videos";
  tab3Title = "Voice Memos";
  tab4Title = "Notes";
  item: any;

  constructor(public navParams: NavParams, items: Items, public navCtrl: NavController) {
    this.item = navParams.get('item') || items.defaultItem;
  }

}
