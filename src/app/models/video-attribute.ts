import {SafeResourceUrl} from "@angular/platform-browser";

export class VideoAttribute {
  id: number = -1;
  bestFrames: string = "";
  videoUrl: string = "";
  videoName: string = "";
  thumbNail: SafeResourceUrl = "";
}
