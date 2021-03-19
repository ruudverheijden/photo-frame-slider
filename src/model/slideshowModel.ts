import { Photo } from "./models";
import photos from "../../photos.json";

export default class slideshowModel {
  private photoList: Photo[];

  constructor() {
    this.photoList = photos;
  }

  // Return a list of with IDs of all photos
  getPhotoListIds(): number[] {
    const photoIds: number[] = [];
    for (let i = 1; i <= this.photoList.length; i += 1) {
      photoIds.push(i);
    }
    return photoIds;
  }

  getPhotoById(id: number): Photo {
    return this.photoList[id];
  }
}
