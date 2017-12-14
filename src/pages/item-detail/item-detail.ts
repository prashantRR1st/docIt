import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';

import { Item } from '../../models/item';
import { Case } from '../../models/case';
import { CaseMedia } from '../../models/caseMedia';
import { Items } from '../../providers/providers';
import { CaseMediaProvider } from '../../providers/providers';
import { SpeechApi } from '../../providers/api/api';

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
    public mediaCapture: MediaCapture, public file: File, public speechApi: SpeechApi) {
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
        this.AudioRecord(item, this.caseMedia, mediaType, this.addAudio, this.getBase64encoding, this.fileConvertAPIRequest,
          this.GoogleSpeechAPIRequest, this.speechApi, this.file, this.shortRecogCallback, this.longRecogCallback, this.longResponseFinal)
        //this.recordAudio(mediaType, item, this.IVAcallback);
        break;
      }
    }
  }

  AudioRecord(inputDetails, caseMedia: CaseMedia[], mediaType, addAudio, getBase64encoding,
    fileConvertAPIRequest, GoogleSpeechAPIRequestFn, speechApi: SpeechApi, file: File, shortRecogCallback,
    longRecogCallback, longResponseFinal) {
    let addModal = this.modalCtrl.create('AudioRecordPage',
    { caseId: this.case.id,
      inputDetails: inputDetails
    });
    addModal.onDidDismiss(item => {
      if (item.created) {
        console.log('audio added');
        addAudio(inputDetails, caseMedia, mediaType, item.duration, getBase64encoding,
          fileConvertAPIRequest, GoogleSpeechAPIRequestFn, speechApi, file, shortRecogCallback, longRecogCallback, longResponseFinal)
      } else {
        console.log('audio not added');
      }
    })
    addModal.present();
  }

  addAudio(inputDetails, caseMedia: CaseMedia[], mediaType, duration, getBase64encoding, fileConvertAPIRequest, GoogleSpeechAPIRequestFn,
    speechApi: SpeechApi, file: File, shortRecogCallback, longRecogCallback, longResponseFinal) {
    let newItemAudio: any = {
      "id": caseMedia.length+1,
      "name": inputDetails.name,
      "type": mediaType,
      "fullPath": "file:///storage/emulated/0/" + inputDetails.name + ".aac",
      "time": inputDetails.time,
      "date": inputDetails.date,
      "fileName": inputDetails.name + ".aac",
      "duration": duration,
      "message": inputDetails.about,
      "imgUrl": inputDetails.profilePic
    }

    getBase64encoding(caseMedia, duration, inputDetails, fileConvertAPIRequest, GoogleSpeechAPIRequestFn, speechApi,
      file, shortRecogCallback, longRecogCallback, longResponseFinal)

    let newItemNote: any = {
      "id": caseMedia.length+2,
      "name": inputDetails.name + ' - note',
      "type": 'note',
      "fullPath": "file:///storage/emulated/0/" + inputDetails.name + ".aac",
      "time": inputDetails.time,
      "date": inputDetails.date,
      "fileName": inputDetails.name + ".aac",
      "message": inputDetails.about,
      "noteText": "",
      "imgUrl": inputDetails.profilePic
    }
  }

  getBase64encoding (caseMedia: CaseMedia[], duration, inputDetails, fileConvertAPIRequest, GoogleSpeechAPIRequestFn, speechApi: SpeechApi,
    file: File, shortRecogCallback, longRecogCallback, longResponseFinal) {
    let audioPath: string = 'file:///storage/emulated/0';
    file.readAsDataURL(audioPath, inputDetails.name + ".aac")
      .then(function(base64File) {
            let split: any  = base64File.split("base64,");
            fileConvertAPIRequest(caseMedia, inputDetails, duration, base64File, GoogleSpeechAPIRequestFn,
               speechApi, shortRecogCallback, longRecogCallback, longResponseFinal)
            //GoogleSpeechAPIRequestFn(duration, split[1], speechApi, shortRecogCallback, longRecogCallback, longResponseFinal);
      },  function(err) {
            console.log("error Base 64 Encoding", err);
      });
  }

  fileConvertAPIRequest (caseMedia: CaseMedia[], inputDetails, duration, audioContentB64, GoogleSpeechAPIRequestFn,
    speechApi: SpeechApi, shortRecogCallback, longRecogCallback, longResponseFinal) {
      let fileConvertParams: any = {
        conversion: [ {
            category: "audio",
            target: "flac",
            options: { frequency: 16000 }
          } ]
      }

      let JSONstringConvertParams: any = JSON.stringify(fileConvertParams);

      speechApi.postConvertEmptyJob(caseMedia, inputDetails, JSONstringConvertParams, duration, audioContentB64, GoogleSpeechAPIRequestFn,
        speechApi, shortRecogCallback, longRecogCallback, longResponseFinal);
  }

  GoogleSpeechAPIRequest (duration, audioContentB64, speechApi: SpeechApi, caseMedia: CaseMedia[], shortRecogCallback, longRecogCallback, longResponseFinal) {

    let config: any = {
      encoding:"FLAC", //May be optional
      sampleRateHertz: 16000, //May be optional
      languageCode: "en-US",
      enableWordTimeOffsets: true
    };

    let audio: any =  {
      content: audioContentB64
    };

    let params: any =  {
      config: config,
      audio: audio
    };

    let paramsJSONstring: any = JSON.stringify(params);

    if (duration <= 59) {
      speechApi.postShort(paramsJSONstring, shortRecogCallback, caseMedia);
    } else {
      speechApi.postLong(paramsJSONstring, longRecogCallback, speechApi.getOperationLong, longResponseFinal, caseMedia);
    }
  }

  shortRecogCallback(response, caseMedia: CaseMedia[]) {
    console.log("shortRecogCallback",response);
    console.log("Global Scope", caseMedia);
    let transcript: any  = response.transcript;
    let words: any = response.words;
  }

  longRecogCallback(response, getOperationLong, longResponseFinal, caseMedia: CaseMedia[]) {
    console.log("longRecogCallback",response);
    setTimeout(getOperationLong(response, longResponseFinal, caseMedia), 30000);
  }

  longResponseFinal(response, caseMedia: CaseMedia[]) {
    console.log("longResponseFinal",response);
    let transcript: any  = response.transcript;
    let words: any = response.words;
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
