import { Photo } from "../model/photo";

export default class slideshowController {
  model;

  view;

  constructor(model: any, view: any) {
    this.model = model;
    this.view = view;
  }

  start() {
    setInterval(() => {
      const nextPhoto: Photo | undefined = this.model.photoList.shift();
      if (nextPhoto) {
        const newPhotoElement: HTMLElement | null = this.view.createPhotoElement(
          nextPhoto.src,
          "container"
        );

        if (newPhotoElement) {
          this.view.setPhotoVerticalPosition(newPhotoElement);
          this.view.animatePhoto(newPhotoElement);
        }
      }
    }, 2000);
  }
}
