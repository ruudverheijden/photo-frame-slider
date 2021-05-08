import { Photo, Config } from "../model/models";
import PhotoModel from "../model/photoModel";
import BackgroundView from "../view/backgroundView";

export default class slideshowController {
  private model: PhotoModel;

  private view: BackgroundView;

  private config: Config;

  /**
   * Creates an instance of backgroundController.
   * @param {photoModel} model Reference to instance of photoModel
   * @param {backgroundView} view Reference to instance of backgroundView
   * @memberof slideshowController
   */
  constructor(model: PhotoModel, view: BackgroundView, config: Config) {
    this.model = model;
    this.view = view;
    this.config = config;

    this.start();
  }

  /**
   * Get a random photo
   *
   * @private
   * @returns {Photo}
   * @memberof backgroundController
   */
  private getRandomPhoto(): Photo {
    const photosIds = this.model.getPhotoListIds();
    const randomId: number = Math.floor(Math.random() * photosIds.length);
    return this.model.getPhotoById(randomId);
  }

  /**
   * Trigger view to render the background photo
   *
   * @private
   * @memberof slideshowController
   */
  private setBackgroundPhoto(): void {
    const photo = this.getRandomPhoto();

    if (photo) {
      this.view.setNextBackgroundPhoto(photo);
    }
  }

  // Rotate background every 10 seconds
  start() {
    this.setBackgroundPhoto(); // Run first time immediately

    setInterval(() => {
      this.setBackgroundPhoto();
    }, this.config.backgroundDuration * 1000);
  }
}
