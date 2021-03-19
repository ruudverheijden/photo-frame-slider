import { PhotoWithId } from "../model/models";
import slideshowModel from "../model/slideshowModel";
import slideshowView from "../view/slideshowView";

export default class slideshowController {
  private model: slideshowModel;

  private view: slideshowView;

  private photoIds: number[] = [];

  private photoIdsIndexCounter: number = 0;

  constructor(model: slideshowModel, view: slideshowView) {
    this.model = model;
    this.view = view;
    this.photoIds = this.model.getPhotoListIds();
  }

  // Get the next photo based on index counter
  private getNextPhoto(): PhotoWithId {
    const nextPhoto = this.model.getPhotoById(this.photoIdsIndexCounter);
    const result = { photo: nextPhoto, id: this.photoIdsIndexCounter };

    // Set index counter for next run
    this.photoIdsIndexCounter += 1;

    if (this.photoIdsIndexCounter >= this.photoIds.length) {
      this.photoIdsIndexCounter = 0;
    }

    return result;
  }

  // Start the slideshow
  start() {
    setInterval(() => {
      const nextPhoto = this.getNextPhoto();

      if (nextPhoto) {
        this.view.addNewPhoto(nextPhoto.photo.src, nextPhoto.id);
        this.view.setPhotoVerticalPosition(nextPhoto.id);
        this.view.animatePhoto(nextPhoto.id);
      }
    }, 2000);
  }
}
