import { Photo } from "./photo";
import photos from "../../photos.json";

export default class slideshowModel {
  photoList: Photo[];

  constructor() {
    this.photoList = photos;
  }
}
