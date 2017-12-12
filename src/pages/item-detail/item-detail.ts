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
            this.caseMediaProvider.add(item, mediaType, this.caseMedia.length, this.takeNote());
        } else if (mediaType != "note") {
            //this.caseMediaProvider.add(item, mediaType, this.caseMedia.length, undefined ,this.record(mediaType));
            this.record(mediaType, item, this.caseMedia.length, this.addAudio);
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

  record(mediaType, item, caseMediaLength, addAudio) {
    switch(mediaType) {
      case 'img': {
        this.captureImage(mediaType, item, this.IVAcallback);
        break;
      }
      case 'vid': {
        this.recordVideo(mediaType, item, this.IVAcallback);
        break;
      }
      case 'aud': {
        this.AudioRecord(item, caseMediaLength, mediaType, addAudio)
        //this.recordAudio(mediaType, item, this.IVAcallback);
        break;
      }
    }
  }

  AudioRecord(inputDetails, caseMediaLength, mediaType, addAudio) {
    let addModal = this.modalCtrl.create('AudioRecordPage',
    { caseId: this.case.id,
      inputDetails: inputDetails
    });
    addModal.onDidDismiss(item => {
      if (item.created) {
        console.log('audio added');
        addAudio(inputDetails, caseMediaLength, mediaType, item.duration)
      } else {
        console.log('audio not added');
      }
    })
    addModal.present();
  }

  addAudio(inputDetails, currLength, mediaType, duration) {
    let newItemAudio: any = {
      "id": currLength+1,
      "name": inputDetails.name,
      "type": mediaType,
      "fullPath": "file:///storage/emulated/0/" + inputDetails.name + ".wav",
      "time": inputDetails.time,
      "date": inputDetails.date,
      "fileName": inputDetails.name + ".wav",
      "duration": duration,
      "message": inputDetails.about,
      "imgUrl": inputDetails.profilePic
    }

    let newItemNote: any = {
      "id": currLength+2,
      "name": inputDetails.name + ' - note',
      "type": 'note',
      "fullPath": "file:///storage/emulated/0/" + inputDetails.name + ".wav",
      "time": inputDetails.time,
      "date": inputDetails.date,
      "fileName": inputDetails.name + ".wav",
      "message": inputDetails.about,
      "noteText": "",
      "imgUrl": inputDetails.profilePic
    }
  }

  IVAcallback(mediaType, item, mediaFile: MediaFile) {
    this.caseMediaProvider.add(item, mediaType, this.caseMedia.length, undefined , mediaFile);
  }

  captureImage(mediaType, item, callback) {
    let imageData: MediaFile;
    let options: CaptureImageOptions = { limit: 1 };
    this.mediaCapture.captureImage(options)
      .then(
        (data: MediaFile[]) => {
          console.log(data);
          callback(mediaType, item, data[0]);
        },
        (err: CaptureError) => console.error(err)
      );
  }

  recordVideo(mediaType, item, callback) {
    let videoData: MediaFile;
    let options: CaptureVideoOptions = { limit: 1 };
    this.mediaCapture.captureVideo(options)
    .then(
      (data: MediaFile[]) => (data: MediaFile[]) => {
        console.log(data);
        callback(mediaType, item, data[0]);
      },
      (err: CaptureError) => console.error(err)
    );
  }

  recordAudio(mediaType, item, callback) {
    let audioData: MediaFile;
    let options: CaptureAudioOptions = { limit: 1 };
    this.mediaCapture.captureAudio(options)
    .then(
      (data: MediaFile[]) => (data: MediaFile[]) => {
        console.log(data);
        callback(mediaType, item, data[0]);
      },
      (err: CaptureError) => console.error(err)
    );
  }

  takeNote() {

  }

}
