import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoteListPage } from './note-list';

@NgModule({
  declarations: [
    NoteListPage,
  ],
  imports: [
    IonicPageModule.forChild(NoteListPage),
  ],
})
export class NoteListPageModule {}
