import { Component, Directive, DirectiveDecorator } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the NotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-note',
  templateUrl: 'note.html',
})
@Directive({
  selector: 'ion-textarea[autosize]'
})
export class NotePage {

  noteName: any;
  noteText: any;
  aboutText: any;
  selectedNote: any;
  words: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedNote = navParams.get('selectedNote');
    this.noteText = this.selectedNote.noteText;
    this.noteName = this.selectedNote.name;
    this.aboutText = this.selectedNote.message;
    this.words = this.selectedNote.words;
    console.log("noteText", this.noteText);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotePage');
  }


}
