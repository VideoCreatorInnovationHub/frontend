import { Component, OnInit } from '@angular/core';
import {VideoService} from "../../services/video.service";
import {VideoAttribute} from "../../models/video-attribute";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";


class VideoSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  public videos: VideoAttribute[] = [];
  constructor(private videoService: VideoService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.videoService.fetchPortfolioVideo().subscribe(
      (next) => {
        this.videos = next;
        this.videos.forEach((v) => {
          const frames = v.bestFrames.split("#");
          v.thumbNail = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64, ${this.randomFrame(frames, frames.length)}`);
        });
      },
      (error) => {
        console.warn(error);
      }
    );
  }

  public upload(image: any) {
    const file: File = image.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {

      const uploadedVideo = new VideoSnippet(event.target.result, file);

      this.videoService.upload(uploadedVideo.file).subscribe(
        (res) => {
          Swal.fire("Upload success", "Your video is currently being processed", "success");
        },
        (err) => {
          Swal.fire("Upload failed", err.error.errors[0], "error");
        });
    });
    reader.readAsDataURL(file);
  }
  public randomFrame(bestFrames: string[], length: number): string {
    const idx = Math.floor(Math.random() * length);
    return bestFrames[idx];
  }
  public delete(video: VideoAttribute): void {
    Swal.fire({
      title: `Delete video with name ${video.videoName}`,
      text: 'Delete will be permanent?',
      showCancelButton: true
    }).then((result: any) => {
      if(result.value){
        this.videoService.deletePortfolioVideo(video.id).subscribe(
          (next) => {
            Swal.fire('Deleted', '', 'success').then(() => {
                const idx: number = this.videos.findIndex(v => v.id == video.id);
                this.videos.splice(idx, 1);
              }
            );
          },
          (error) => {
            console.warn(error);
          }
        );
      }
      else if(result.dismiss == 'cancel'){
        Swal.fire('Cancelled', '', 'error');
      }
    });

  }
}
