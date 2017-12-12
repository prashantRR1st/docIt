import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

/**
 * Generated class for the AudioRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-audio-record',
  templateUrl: 'audio-record.html',
})
export class AudioRecordPage {

  caseId: any;
  inputDetails: any;
  state: any = '';
  audio: MediaObject;
  created: boolean = false;
  fileName: string;
  duration: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private media: Media, private file: File) {
    this.caseId = navParams.get('caseId');
    this.inputDetails = navParams.get('inputDetails');
    this.fileName = this.inputDetails.name + '.wav';
    this.audio = this.media.create(this.fileName);
    this.listDir();
    this.state = 'ready';


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AudioRecordPage');
  }

  fileDidCreate(fileName, file: File, createdBool) {
    file.resolveLocalFilesystemUrl(file.externalRootDirectory + fileName)
      .then(function(result) {
        console.log('TEMP FILE IN', result);
        createdBool = true;
      })
      .catch(error => console.log("ERROR IN TEMP", error));
  }

  listDir() {
    this.file.listDir(this.file.externalRootDirectory, '')
      .then(function(list) {
        console.log("list", list);
      }, function(err) {
        console.log(err);
      });
  }

  startRecord(audio: MediaObject) {
    audio.startRecord();
    console.log('Started Recording');
    this.state = 'recording';
    audio.onStatusUpdate.subscribe(status => console.log("STATUS: Record START Function",status)); // fires when this.audio status changes
    audio.onSuccess.subscribe(() => {
      console.log('Started Recording');
      this.state = 'recording';
    });
    audio.onError.subscribe(error => console.log('Record Start Error!', error));
  }

  stopRecord(audio: MediaObject) {
    audio.stopRecord();
    console.log('Stopped Recording');
    this.state = 'recorded';
    audio.onStatusUpdate.subscribe(status => console.log("STATUS: Record STOP Function", status)); // fires when this.audio status changes
    audio.onSuccess.subscribe(() => {
      console.log('Stopped Recording');
      this.state = 'recorded';
    });
    audio.onError.subscribe(error => console.log('Record Stop Error!', error));
    this.fileDidCreate(this.fileName, this.file, this.created);
  }

  play(audio: MediaObject) {
    audio.play();
    console.log('Playing Audio');
    this.state = 'playing';
    audio.onStatusUpdate.subscribe(status => console.log("STATUS: PLAY Function", status)); // fires when this.audio status changes
    audio.onSuccess.subscribe(() => {
      console.log('Playing Audio');
      this.state = 'playing';
    });
    audio.onError.subscribe(error => console.log('Audio Playback Error!', error));
    this.duration = audio.getDuration();
  }

  pause(audio: MediaObject) {
    audio.pause();
    console.log('Audio Paused');
    this.state = 'paused';
    audio.onStatusUpdate.subscribe(status => console.log("STATUS: PAUSE Function", status)); // fires when this.audio status changes
    audio.onSuccess.subscribe(() => {
      console.log('Audio Paused');
      this.state = 'paused';
    });
    audio.onError.subscribe(error => console.log('Audio Pause Error!', error));
  }

  cancel() {
    this.viewCtrl.dismiss(false);
  }

  done() {
    if (!this.created || this.duration == -1) { return false; }
    let params = {
      "created": true,
      "duration": this.duration
    }
    this.viewCtrl.dismiss(params);
  }

}

