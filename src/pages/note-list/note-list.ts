import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Case } from '../../models/case';
import { CaseMedia } from '../../models/caseMedia';
import { Items } from '../../providers/providers';

/**
 * Generated class for the NoteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-note-list',
  templateUrl: 'note-list.html',
})
export class NoteListPage {

  case: Case;
  caseMedia: CaseMedia[] = [];
  noteMedia: CaseMedia[] = [];

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, public navParams: NavParams) {
    this.case = this.navParams.data.case;
    this.caseMedia = this.navParams.data.caseMedia;
    for (let item of this.caseMedia) {
      if (item.type == "note") {
        this.noteMedia.push(new CaseMedia(item));
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteListPage');
  }

  openSearch() {
    this.navCtrl.push('SearchPage');
  }

  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        //this.items.add(item);
      }
    })
    addModal.present();
  }

  deleteItem(item) {
    this.items.delete(item);
  }

  openItem(selectedNote: CaseMedia) {
    this.navCtrl.push('NotePage', {
      selectedNote: selectedNote
    });
  }

}
