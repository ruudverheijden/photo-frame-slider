import { PhotoWithId, Config } from "../model/models";
import PhotoModel from "../model/photoModel";
import SlideshowView from "../view/slideshowView";

export default class slideshowController {
  private model: PhotoModel;

  private view: SlideshowView;

  private config: Config;

  private photoIds: number[] = [];

  private photoIdsIndexCounter: number = 0;

  /**
   * Creates an instance of slideshowController.
   * @param {photoModel} model Reference to instance of photoModel
   * @param {slideshowView} view Reference to instance of slideshowView
   * @memberof slideshowController
   */
  constructor(model: PhotoModel, view: SlideshowView, config: Config) {
    this.model = model;
    this.view = view;
    this.config = config;
    this.photoIds = this.model.getPhotoListIds();

    this.start();
  }

  /**
   * Get the next photo based on index counter
   *
   * @private
   * @returns {PhotoWithId}
   * @memberof slideshowController
   */
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

  /**
   * Trigger view to render the photo
   *
   * @private
   * @memberof slideshowController
   */
  private setPhoto(): void {
    const nextPhoto = this.getNextPhoto();

    if (nextPhoto) {
      this.view.addPhoto(
        nextPhoto.id,
        nextPhoto.photo.src,
        nextPhoto.photo.title
      );
    }
  }

  // Start the slideshow
  start() {
    this.setPhoto(); // Run first time immediately

    setInterval(() => {
      this.setPhoto();
    }, this.config.photoAddInterval * 1000);
  }
}
