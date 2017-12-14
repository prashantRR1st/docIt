import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class SpeechApi {
  urlDefault: string = 'https://example.com/api/v1';
  apiKey: string = "AIzaSyAU8ijQDKJHKGrR0nyaETY_F7a3HZ6jpS8";
  url: string = 'https://speech.googleapis.com/v1/speech:';
  longRecogOperationURL: string = 'https://speech.googleapis.com/v1/operations/';
  convertioApiKey: string = '4ae8196301a90a0b56711766055fc2dc';
  fileTransfer: FileTransferObject;

  constructor(public http: HttpClient, public transfer: FileTransfer, public file: File) {
    const fileTransfer: FileTransferObject = this.transfer.create();
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.urlDefault + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.urlDefault + '/' + endpoint, body, reqOpts);
  }

  postConvertEmptyJob(caseMedia, inputDetails, JSONstringConvertioParams, duration, audioContentB64, GoogleSpeechAPIRequestFn,
    speechApi: SpeechApi, shortRecogCallback, longRecogCallback, longResponseFinal) {
    var postSendBase64Data = this.postSendBase64Data;
    var getStatusFileConvert = this.getStatusFileConvert;
    var downloadConvertedFile = this.downloadConvertedFile;
    var encodeBase64 = this.encodeBase64;
    var fileTransfer = this.fileTransfer;
    var file = this.file;

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', 'http://api2.online-convert.com/jobs', true );
    xhr.setRequestHeader("x-oc-api-key", "3976e9617ef2d06c921b7b4d2c1a069f");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        var response = JSON.parse(this.responseText);
        console.log("Empty Convert Job Post",response);
        postSendBase64Data(response.id, response.server, inputDetails, fileTransfer,
            file, downloadConvertedFile, encodeBase64, getStatusFileConvert, duration, audioContentB64, caseMedia, GoogleSpeechAPIRequestFn,
            speechApi, shortRecogCallback, longRecogCallback, longResponseFinal)
      }
  });

    xhr.onerror = function(error) {
      console.log('Empty Convert Job Post Error: ', error);
    };

    xhr.send(JSONstringConvertioParams);
  }

  postSendBase64Data(id, server, inputDetails, fileTransfer: FileTransferObject, file: File, downloadConvertedFile,
    encodeBase64, getStatusFileConvert, duration, audioContentB64, caseMedia, GoogleSpeechAPIRequestFn,
    speechApi, shortRecogCallback, longRecogCallback, longResponseFinal) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', server + '/upload-base64/' + id, true );
    xhr.withCredentials = true;
    xhr.setRequestHeader("x-oc-api-key", "3976e9617ef2d06c921b7b4d2c1a069f");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    let convertParams: any = {
      content: audioContentB64,
      filename: inputDetails,
    }

    let JSONstringConvertParams: any = JSON.stringify(convertParams);

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        var response = JSON.parse(this.responseText);
        console.log("Send Base64 Data to Job", response);
          getStatusFileConvert(response.id.job, fileTransfer, file, downloadConvertedFile, encodeBase64,
            inputDetails, duration, caseMedia, GoogleSpeechAPIRequestFn,
              speechApi, shortRecogCallback, longRecogCallback, longResponseFinal)
      }
    });

    xhr.onerror = function(error) {
      console.log('Send Base64 Data to Job Error: ', error);
    };

    xhr.send(JSONstringConvertParams);
  }

  getStatusFileConvert(id, fileTransfer: FileTransferObject, file: File, downloadConvertedFile, encodeBase64, inputDetails,
    duration, caseMedia, GoogleSpeechAPIRequestFn, speechApi: SpeechApi, shortRecogCallback, longRecogCallback, longResponseFinal) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api2.online-convert.com/jobs/'+id, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("x-oc-api-key", "3976e9617ef2d06c921b7b4d2c1a069f");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        var response = JSON.parse(xhr.responseText);
        console.log("Get Job Status ",response);
        downloadConvertedFile(response.output[0].uri, fileTransfer, file, encodeBase64,
          inputDetails, duration, GoogleSpeechAPIRequestFn, speechApi, caseMedia,
          shortRecogCallback, longRecogCallback, longResponseFinal)
      }
    };

    xhr.onerror = function(error) {
      console.log('Get Job Status Error: ', error);
    };

    xhr.send(null);
  }

  downloadConvertedFile(responseUri, fileTransfer: FileTransferObject, file: File, encodeBase64, inputDetails, duration, GoogleSpeechAPIRequestFn, speechApi, caseMedia,
    shortRecogCallback, longRecogCallback, longResponseFinal) {
    fileTransfer.download(responseUri, 'file:///storage/emulated/0/'+inputDetails.name+'.flac', true)
      .then((entry) => {
        encodeBase64(file, inputDetails, duration, GoogleSpeechAPIRequestFn, speechApi, caseMedia,
          shortRecogCallback, longRecogCallback, longResponseFinal)
        console.log('download complete: ', entry.toURL());
      }, (error) => {
        console.log('download error: ', error);
      });
    }

  encodeBase64(file: File, inputDetails, duration, GoogleSpeechAPIRequestFn, speechApi, caseMedia,
    shortRecogCallback, longRecogCallback, longResponseFinal) {
    let audioPath: string = 'file:///storage/emulated/0';
    file.readAsDataURL(audioPath, inputDetails.name + ".flac")
    .then(function(base64File) {
      let split: any  = base64File.split("base64,");
      GoogleSpeechAPIRequestFn(duration, split[1], speechApi, caseMedia,
        shortRecogCallback, longRecogCallback, longResponseFinal);
    },  function(err) {
          console.log("error Base 64 Encoding", err);
    });
  }

  postShort(paramsJSONstring, shortRecogCallback, caseMedia) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', this.url+ 'recognize' + '?key='+ this.apiKey, true );
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      shortRecogCallback(response.results[0].alternatives[0], caseMedia);
    };

    xhr.onerror = function(error) {
      console.log('Short Recognize Error: ', error);
    };

    xhr.send(paramsJSONstring);
  }

  postLong(paramsJSONstring, longRecogCallback, getOperationLong, longResponseFinal, caseMedia) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', this.url+ 'longrunningrecognize' + '?key='+ this.apiKey, true );
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      longRecogCallback(response.name, getOperationLong, longResponseFinal, caseMedia);
    };

    xhr.onerror = function(error) {
      console.log('Long Recognize POST Error: ', error);
    };

    xhr.send(paramsJSONstring);
  }

  getOperationLong (operationName, longResponseFinal, caseMedia) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.longRecogOperationURL + operationName + '?key='+ this.apiKey, true );
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      longResponseFinal(response.results[0].alternatives[0], caseMedia)
    };

    xhr.onerror = function(error) {
      console.log('Long Recognize GET Operation Error: ', error);
    };
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.urlDefault + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.urlDefault + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.urlDefault + '/' + endpoint, body, reqOpts);
  }
}
