import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VideoAttribute} from "../models/video-attribute";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private httpClient: HttpClient) { }

  public upload(video: File): Observable<any> {
    let url = `${environment.baseUrl}/content/upload`;
    const formData = new FormData();
    formData.append('video', video);

    return this.httpClient.post(url, formData);
  }

  public fetchPortfolioVideo(): Observable<VideoAttribute[]> {
    let url = `${environment.baseUrl}/content`;
    return this.httpClient.get<VideoAttribute[]>(url);
  }

  public deletePortfolioVideo(videoId: number): Observable<void> {
    let url = `${environment.baseUrl}/content/${videoId}`;
    return this.httpClient.delete<void>(url);
  }
}
