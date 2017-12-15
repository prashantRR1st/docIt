import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { Case } from '../../models/case';
import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Case[];

  constructor(public navCtrl: NavController, public items: Items,
    public modalCtrl: ModalController, public navParams: NavParams) {
    this.currentItems = this.items.query();
  }

  ionViewDidLoad() {
  }

  openSearch() {
    this.navCtrl.push('SearchPage');
  }

  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage', {mode: 'case'});
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item, this.currentItems.length); //Add item to Local JSON
        //this.currentItems = this.items.query();  //Query JSON again
      }
    })
    addModal.present();
  }

  deleteItem(item) {
    this.items.delete(item);
  }

  openItem(item: Case) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
