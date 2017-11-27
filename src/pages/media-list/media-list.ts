import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Base64 } from '@ionic-native/base64';

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
  user: any;
  google_api_key: any = "AIzaSyAU8ijQDKJHKGrR0nyaETY_F7a3HZ6jpS8";

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController,
               public navParams: NavParams, private nativeAudio: NativeAudio, private base64: Base64) {
    this.case = this.navParams.data.case;
    this.caseMedia = this.navParams.data.caseMedia;
    for (let item of this.caseMedia) {
      if (item.type == "aud") {
        this.audMedia.push(new CaseMedia(item));
      }
    }

    // this.nativeAudio.preloadSimple('currentAudio', 'assets/data/caseMedia/'+this.case.id.toString()+'/'+'test.mp3')
    // .then(function (message) {
    //         console.log("Success PreLoading!", message);
    //   },  function (error) {
    //         console.log("Error PreLoading", error);
    // });
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

  playOrPause(audioPath: string) {
    if(this.PlayPauseIcon == 'play'){
      this.nativeAudio.preloadComplex('currentAudio', audioPath, 1, 1, 0)
      .then(function (message) {
              console.log("Success Complex Preloading!", message);
        },  function (error) {
              console.log("Error Complex Preloading", error);
      });
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

  GoogleSpeechAPIRequest () {
    var xhr = new XMLHttpRequest();

    let audioPath: string = '../../assets/data/caseMedia/1/test.wav';

    let audioContentB64: any = this.getBase64encoding(audioPath);


    let apiKey: String = "AIzaSyAU8ijQDKJHKGrR0nyaETY_F7a3HZ6jpS8";
    let config: any = {encoding:"LINEAR16",
    sampleRateHertz: 8000,
    languageCode: "en-US",
    enableWordTimeOffsets: false};
    let audio: any =  { content: audioContentB64
                        //uri:"gs://cloud-samples-tests/speech/brooklyn.flac"
                      };
    let requestURL: String = 'https://speech.googleapis.com/v1/speech:recognize';
    let params: any =  {  config: config,
                          audio: audio,  };

    // convert the javascript object to a Json string
    let paramsjasonString: any = JSON.stringify(params);
    console.log("paramsjasonString = " + paramsjasonString);

    //CORS POST Request - Short Running Recognize
    xhr.open('POST', requestURL + '?key='+apiKey, true );

    // Specify the http content-type as json
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Response handlers
    xhr.onload = function() {
      var responseText = xhr.responseText;
      console.log(responseText);
      // process the response.
    };

    xhr.onerror = function() {
      console.log('There was an error!');
    };

    xhr.send(paramsjasonString);
  }

  getBase64encoding (audioPath: string) {

    this.base64.encodeFile(audioPath)
    .then((base64File: string) => {
      console.log(base64File);
      return base64File;
    }, (err) => {
      console.log(err);
      return err;
    });
    // var reader = new FileReader();
    // reader.onload = function (event) {
    //   let target: any = event.target;
    //   var data = target.result.split(',')
    //     , decodedImageData = btoa(data[1]);
    //   //callback(decodedImageData);
    // };
    // reader.readAsDataURL(audioFile);

  }

}
