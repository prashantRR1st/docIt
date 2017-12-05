import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class SpeechApi {
  urlDefault: string = 'https://example.com/api/v1';
  apiKey: string = "AIzaSyAU8ijQDKJHKGrR0nyaETY_F7a3HZ6jpS8";
  url: string = 'https://speech.googleapis.com/v1/speech:';
  longRecogOperationURL: string = 'https://speech.googleapis.com/v1/operations/';

  constructor(public http: HttpClient) {
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

  postShort(paramsJSONstring, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', this.url+ 'recognize' + '?key='+ this.apiKey, true );
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      callback(response.results[0].alternatives[0]);
    };

    xhr.onerror = function(error) {
      console.log('Short Recognize Error: ', error);
    };

    xhr.send(paramsJSONstring);
  }

  postLong(paramsJSONstring, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', this.url+ 'longrunningrecognize' + '?key='+ this.apiKey, true );
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      callback(response.name);
    };

    xhr.onerror = function(error) {
      console.log('Long Recognize POST Error: ', error);
    };

    xhr.send(paramsJSONstring);
  }

  getOperationLong (operationName, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.longRecogOperationURL + operationName + '?key='+ this.apiKey, true );
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      callback(response.results[0].alternatives[0])
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
