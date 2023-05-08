import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {DataService} from "./DataService";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageGetServiceService {

  images : Map<string, string> = new Map<string, any>();

  constructor(private httpClient : HttpClient, private sanitizer : DomSanitizer, private dataService : DataService) {

  }

  loadImageAsync(id : string) : void {
  }
}
