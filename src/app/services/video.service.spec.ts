import { TestBed } from '@angular/core/testing';

import { VideoService } from './video.service';
import {AuthService} from "./auth.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {VideoAttribute} from "../models/video-attribute";
import {environment} from "../../environments/environment";

describe('VideoService', () => {
  let videoService: VideoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VideoService],
    });

    videoService = TestBed.inject(VideoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(videoService).toBeTruthy();
  });

  describe('upload', () => {
    it('should send a POST request with the video file', () => {
      const file = new File([''], 'testVideo.mp4', { type: 'video/mp4' });
      const expectedResponse = 'success';

      videoService.upload(file).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/content/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();

      req.flush(expectedResponse);
    });

    it('should handle Internal Server Error when processing the video file', () => {
      const file = new File([''], 'testVideo.mp4', { type: 'video/mp4' });
      const errorMessage = "Unknown error while processing the video";

      videoService.upload(file).subscribe((response) => {
        fail("Should have failed with an error");
      }, (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
        expect(error.statusText).toBe(errorMessage);
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/content/upload`);
      expect(req.request.method).toBe('POST');

      req.flush(errorMessage, {status: 500, statusText: "Unknown error while processing the video"});
    });
  });

  describe('fetchPortfolioVideo', () => {
    it('should send a GET request to fetch portfolio videos', () => {
      const expectedVideos: VideoAttribute[] = [
        { id: 1, videoName: 'Video 1', videoUrl: 'video1.mp4', bestFrames: "f1", thumbNail: 'url' },
        { id: 2, videoName: 'Video 2', videoUrl: 'video2.mp4', bestFrames: "f2", thumbNail: 'url' },
      ];

      videoService.fetchPortfolioVideo().subscribe((videos) => {
        expect(videos).toEqual(expectedVideos);
        expect(videos).toHaveSize(2);
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/content`);
      expect(req.request.method).toBe('GET');

      req.flush(expectedVideos);
    });

    it('should handle unauthorized status when fetching portfolio videos', () => {
      const errorMessage = "User Is Unauthorized"

      videoService.fetchPortfolioVideo().subscribe(
        (videos) => {
          fail('Should have failed with an error');
        },(error) => {
          expect(error).toBeTruthy();
          expect(error.error).toBe(errorMessage);
          expect(error.status).toBe(401);
          expect(error.statusText).toBe(errorMessage);
        }
      );

      const req = httpTestingController.expectOne(`${environment.baseUrl}/content`);
      expect(req.request.method).toBe('GET');

      req.flush(errorMessage, {status: 401, statusText: errorMessage});
    });
  });

  describe('deletePortfolioVideo', () => {
    it('should send a DELETE request to delete a portfolio video', () => {
      const videoToDelete: VideoAttribute = {
        id: 1,
        videoName: 'Video 1',
        videoUrl: 'video1.mp4',
        bestFrames: "f",
        thumbNail: ''
      };

      videoService.deletePortfolioVideo(videoToDelete.id).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/content/${videoToDelete.id}`);
      expect(req.request.method).toBe('DELETE');

      req.flush(null, { status: 204, statusText: 'No Content' });
    });

    it('should handle resource not found for deleting portfolio video', () => {
      const videoToDelete: VideoAttribute = {
        id: 1,
        videoName: 'Video 1',
        videoUrl: 'video1.mp4',
        bestFrames: "f",
        thumbNail: ''
      };
      const errorMessage = "Resource with id - 1 is not found";

      videoService.deletePortfolioVideo(videoToDelete.id).subscribe(
        () => {
          fail('Should have failed with an error');
        },
        (error) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(400);
          expect(error.statusText).toBe(errorMessage);
          expect(error.error).toBe(errorMessage);
        }
      );

      const req = httpTestingController.expectOne(`${environment.baseUrl}/content/${videoToDelete.id}`);
      expect(req.request.method).toBe('DELETE');

      req.flush(errorMessage, { status: 400, statusText: 'Resource with id - 1 is not found' });
    });
  });
});
