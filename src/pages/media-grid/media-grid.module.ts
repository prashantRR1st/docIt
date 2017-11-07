import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MediaGridPage } from './media-grid';

@NgModule({
  declarations: [
    MediaGridPage,
  ],
  imports: [
    IonicPageModule.forChild(MediaGridPage),
  ],
})
export class MediaGridPageModule {}
