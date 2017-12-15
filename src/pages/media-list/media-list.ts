import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { File } from '@ionic-native/file';

import { Item } from '../../models/item';
import { Case } from '../../models/case';
import { CaseMedia } from '../../models/caseMedia';
import { Items } from '../../providers/providers';
import { SpeechApi } from '../../providers/api/api';

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

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController,
               public navParams: NavParams, public nativeAudio: NativeAudio, public speechApi: SpeechApi, public file: File) {
    this.case = this.navParams.data.case;
    this.caseMedia = this.navParams.data.caseMedia;
    for (let item of this.caseMedia) {
      if (item.type == "aud") {
        this.audMedia.push(new CaseMedia(item));
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MediaListPage');
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

  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  playOrPause(audioName: string) {
    let audioPath: string = 'assets/data/caseMedia/'+this.case.id.toString()+'/'+audioName;
    let audioId: string = 'currentAudio';
    if(this.PlayPauseIcon == 'play'){
      this.preloadAudio(audioPath, audioId, this.playAudio, this.nativeAudio);
      this.PlayPauseIcon = "pause";
    }
    else if (this.PlayPauseIcon == 'pause'){
      this.stopAudio(audioId, this.unloadAudio, this.nativeAudio);
      this.PlayPauseIcon = "play";
    }
    else {
      console.log("Audio Control Error!");
    }
  }

  preloadAudio(audioPath: string, audioId: string, playAudioFn, nativeAudio: NativeAudio) {
    this.nativeAudio.preloadComplex(audioId, audioPath, 1, 1, 0)
    .then(function (message) {
            console.log("Success Complex Preloading!", message);
            playAudioFn(audioId, nativeAudio);
      },  function (error) {
            console.log("Error Complex Preloading", error);
    });
  }

  playAudio(audioId, nativeAudio: NativeAudio) {
    nativeAudio.play(audioId)
    .then(function (message) {
            console.log("Success Playing!", message);
      },  function (error) {
            console.log("Error Playing", error);
    });
  }

  stopAudio(audioId, unloadAudioFn, nativeAudio: NativeAudio) {
    nativeAudio.stop(audioId)
    .then(function (message) {
            console.log("Success Stopping!", message);
            unloadAudioFn(audioId, nativeAudio);
      },  function (error) {
            console.log("Error Stopping", error);
    });
  }

  unloadAudio(audioId, nativeAudio: NativeAudio) {
    nativeAudio.unload(audioId)
    .then(function (message) {
            console.log("Success Unloading!", message);
      },  function (error) {
            console.log("Error Unloading", error);
    });
  }
}
