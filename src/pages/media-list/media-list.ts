import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

import { Item } from '../../models/item';
import { Case } from '../../models/case';
import { CaseMedia } from '../../models/caseMedia';
import { Items } from '../../providers/providers';

/**
 * Generated class for the MediaListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-media-list',
  templateUrl: 'media-list.html',
})
export class MediaListPage {

  case: Case;
  caseMedia: CaseMedia[] = [];
  audMedia: CaseMedia[] = [];
  PlayPauseIcon: String = "play";

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, public navParams: NavParams, private nativeAudio: NativeAudio) {
    this.case = this.navParams.data.case;
    this.caseMedia = this.navParams.data.caseMedia;
    for (let item of this.caseMedia) {
      if (item.type == "aud") {
        this.audMedia.push(new CaseMedia(item));
      }
    }

    this.nativeAudio.preloadSimple('currentAudio', 'assets/data/caseMedia/'+this.case.id.toString()+'/'+'test.mp3')
    .then(function (message) {
            console.log("Success PreLoading!", message);
      },  function (error) {
            console.log("Error PreLoading", error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MediaListPage');
  }

  openSearch() {
    this.navCtrl.push('SearchPage');
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  playOrPause(fileName: String) {
    if(this.PlayPauseIcon == 'play'){
      this.nativeAudio.play('currentAudio')
      .then(function (message) {
              console.log("Success Playing!", message);
        },  function (error) {
              console.log("Error Playing", error);
      });
      this.PlayPauseIcon = "pause";
    }
    else{
      this.nativeAudio.stop('currentAudio')
      .then(function (message) {
              console.log("Success Stopping!", message);
        },  function (error) {
              console.log("Error Stopping", error);
      });
      this.nativeAudio.unload('currentAudio')
      .then(function (message) {
              console.log("Success Unloading!", message);
        },  function (error) {
              console.log("Error Unloading", error);
      });
      this.PlayPauseIcon = "play";
    }


  }

}
