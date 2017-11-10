import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageGridPage } from './image-grid';

@NgModule({
  declarations: [
    ImageGridPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageGridPage),
  ],
})
export class ImageGridPageModule {}
