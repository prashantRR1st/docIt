import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Response} from '@angular/http';
import { HttpClient} from '@angular/common/http';
//import { MediaCapture, MediaFile, MediaFileData, CaptureError, CaptureImageOptions, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture';

import { Item } from '../../models/item';
import { Case } from '../../models/case';
import { CaseMedia } from '../../models/caseMedia';
//import { SpeechApi } from '../api/api';


@Injectable()
export class CaseMediaProvider {

  case: Case;
  caseMedia: CaseMedia[] = [];

  constructor(public http: HttpClient) {
  }

  query(params?: any) {
    //return this.api.get('/items', params);

    if (!params) {
      return this.caseMedia;
    }

    return this.caseMedia.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(inputDetails, mediaType, currLength: number, noteFile?: any ,mediaFile?) {//: MediaFile) {

    // let newItem: any = {
    //   "id": currLength+1,
    //   "name": inputDetails.name,
    //   "type": mediaType,
    //   "fullPath": "",
    //   "time": inputDetails.time,
    //   "date": inputDetails.date,
    //   "fileName": "",
    //   "duration": "",
    //   "message": "",
    //   "imgUrl": ""
    //   //MEDIAFILE
    //   // "name": mediaFile.name,                            O
    //   // "fullPath": mediaFile.fullPath,                    O
    //   // "type": mediaFile.type,                            O
    //   // "lastModifiedDate": mediaFile.lastModifiedDate,    X
    //   // "size": mediaFile.size,                            O
    //   //MEDIAFILEDATA
    //   // "codecs": mediaFileData.codecs,        X //Not supported
    //   // "bitrate": mediaFileData.bitrate,      X //Only iOS4 Audio
    //   // "height": mediaFileData.height,        X //Image and Video Only (0 for aud)
    //   // "width": mediaFileData.width,          X //Image and Video Only (0 for aud)
    //   // "duration":mediaFileData."duration,    O //Aud and Vid Only (0 for Img)

    // }
    // if (mediaFile && !noteFile) {
    //   let mediaFileDuration: any; //0 For Img
    //   mediaFile.getFormatData(function(formatData){
    //     mediaFileDuration = formatData.duration;
    //   }, function(error) {
    //     console.log("MediaFileData Retrieval Error: ", error);
    //   });

    // } else if (noteFile && !mediaFile) {

    // } else {

    // }
  }

  delete(item: Item) {
  }

  setCase(item: Case) {
    this.caseMedia = [];
    this.case = item;
    let caseMedia: any;
    this.getData(this.case.id.toString()).subscribe((data) => {
      caseMedia = data;
      for (let item of caseMedia) {
        this.caseMedia.push(new CaseMedia(item));
      }
    });
  }

  getData(id) {
    return this.http.get("assets/data/caseMedia/"+id+"/"+id+".json")
        .map((res:Response) => res);
  }

}
