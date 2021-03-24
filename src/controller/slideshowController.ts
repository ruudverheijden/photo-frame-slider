import { PhotoWithId } from "../model/models";
import slideshowModel from "../model/slideshowModel";
import slideshowView from "../view/slideshowView";

export default class slideshowController {
  private model: slideshowModel;

  private view: slideshowView;

  private photoIds: number[] = [];

  private photoIdsIndexCounter: number = 0;

  private intervalCounter: number = 0;

  constructor(model: slideshowModel, view: slideshowView) {
    this.model = model;
    this.view = view;
    this.photoIds = this.model.getPhotoListIds();

    this.start();
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
        this.view.addPhoto(
          nextPhoto.id,
          nextPhoto.photo.src,
          nextPhoto.photo.title
        );
      }

      // Change background every 5 intervals
      if (this.intervalCounter === 1 || this.intervalCounter % 5 === 0) {
        this.view.setRandomBackgroundPhoto();
      }

      this.intervalCounter += 1;
    }, 2000);
  }
}
