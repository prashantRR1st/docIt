import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Item } from '../../models/item';
import { Case } from '../../models/case';
import { CaseMedia } from '../../models/caseMedia';
import { Items } from '../../providers/providers';
import { CaseMediaProvider } from '../../providers/providers';

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

  tab1Title = "Images";
  tab2Title = "Videos";
  tab3Title = "Voice Memos";
  tab4Title = "Notes";

  tabParams: any;

  case: Case;
  caseMedia: CaseMedia[] = [];


  constructor(public navParams: NavParams, caseMediaProvider: CaseMediaProvider,
    public items: Items, public navCtrl: NavController, public modalCtrl: ModalController) {
    this.case = navParams.get('item') || items.defaultItem;
    caseMediaProvider.setCase(this.case);

    this.caseMedia = caseMediaProvider.query();
    this.updateTabParams();
  }

  addItem(mediaType) {
    let addModal = this.modalCtrl.create('ItemCreatePage', {mode: mediaType});
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  updateTabParams() {
    this.tabParams = {
      case: this.case,
      caseMedia: this.caseMedia,
    };
  }

}
