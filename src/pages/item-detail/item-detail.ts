import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture';

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


  constructor(public navParams: NavParams, public caseMediaProvider: CaseMediaProvider,
    public items: Items, public navCtrl: NavController, public modalCtrl: ModalController,
    public mediaCapture: MediaCapture) {
    this.case = navParams.get('item') || items.defaultItem;
    caseMediaProvider.setCase(this.case);

    this.caseMedia = caseMediaProvider.query();
    this.updateTabParams();
  }

  addItem(mediaType) {
    let addModal = this.modalCtrl.create('ItemCreatePage', {mode: mediaType});
    addModal.onDidDismiss(item => {
      if (item) {
        console.log("media Type: ",mediaType);
        //1. Construct JSON Details of Object
        //OR Just send item to Cse Media Provider and construct JSON details there

        //2. Call Media Recorder
        //3. Record Media
        //4. Send Media (and JSON Details) to Case Media Provider
        if (mediaType == "note") {
            console.log("WTF");
            this.caseMediaProvider.add(item, mediaType, this.caseMedia.length, this.takeNote());
        } else if (mediaType != "note") {
            console.log("reached");
            this.caseMediaProvider.add(item, mediaType, this.caseMedia.length, undefined ,this.record(mediaType));
        }
        //this.items.add(item);
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

  record(mediaType) {
    switch(mediaType) {
      case 'img': {
        return this.captureImage();
      }
      case 'vid': {
        return this.recordVideo();
      }
      case 'aud': {
        return this.recordAudio();
      }
    }
  }

  captureImage() {
    let imageData: MediaFile;
    let options: CaptureImageOptions = { limit: 1 };
    this.mediaCapture.captureImage(options)
      .then(
        (data: MediaFile[]) => {
          console.log(data);
          imageData = data[0];
        },
        (err: CaptureError) => console.error(err)
      );
    return imageData;
  }

  recordVideo() {
    let videoData: MediaFile;
    let options: CaptureVideoOptions = { limit: 1 };
    this.mediaCapture.captureVideo(options)
    .then(
      (data: MediaFile[]) => (data: MediaFile[]) => {
        console.log(data);
        videoData = data[0];
      },
      (err: CaptureError) => console.error(err)
    );
    return videoData;
  }

  recordAudio() {
    let audioData: MediaFile;
    let options: CaptureAudioOptions = { limit: 1 };
    this.mediaCapture.captureAudio(options)
    .then(
      (data: MediaFile[]) => (data: MediaFile[]) => {
        console.log(data);
        audioData = data[0];
      },
      (err: CaptureError) => console.error(err)
    );
    return audioData;
  }

  takeNote() {

  }

}
