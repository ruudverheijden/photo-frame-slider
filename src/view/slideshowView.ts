import anime from "animejs";
import { PhotoReference } from "../model/models";

export default class slideshowView {
  private container: HTMLElement;

  private photos: Map<number, PhotoReference>;

  constructor(container: HTMLElement | null) {
    if (!container) {
      throw new Error("Invalid Slideshow container HTML element");
    }

    this.container = container;
    this.photos = new Map();
  }

  // Add a new photo to the slideshow
  addNewPhoto(id: number, src: string) {
    if (!this.photos.has(id)) {
      this.createPhotoElement(id, src);
      this.addPhotoElementToContainer(id);
    }
  }

  // Create a new photo html element
  private createPhotoElement(id: number, src: string): void {
    const newElement = document.createElement("img");
    newElement.src = src;
    newElement.className = "photo";

    // Store element reference for quick reference
    this.photos.set(id, { element: newElement });
  }

  // Add photo to container
  private addPhotoElementToContainer(id: number): void {
    const photoElement: HTMLElement | undefined =
      this.photos.get(id)?.element || undefined;

    if (photoElement) {
      this.container.appendChild(photoElement);
    }
  }

  // Create animation for photo
  animatePhoto(id: number): void {
    if (this.photos.has(id)) {
      const photoReference = this.photos.get(id);

      if (photoReference?.element) {
        this.setPhotoStartPosition(id);

        // Restart animation if it was already ran before
        if (photoReference.animation) {
          photoReference.animation.restart();
        } else {
          const animation = anime({
            targets: photoReference?.element,
            translateX: "100vw",
            easing: "easeInOutSine",
            duration: slideshowView.randomizeNumber(10000, 2000),
            delay: slideshowView.randomizeNumber(1000, 1000),
          });

          // Store animation reference
          photoReference.animation = animation;
          this.photos.set(id, photoReference);
        }
      }
    }
  }

  // Define photo start position by applying some randomisation
  private setPhotoStartPosition(id: number): void {
    const photoElement = this.photos.get(id)?.element || undefined;

    if (photoElement) {
      photoElement.style.left = `${slideshowView.randomizeNumber(0, 5)}vw`;
      photoElement.style.top = `${slideshowView.randomizeNumber(40, 50)}vh`;
    }
  }

  private static randomizeNumber(number: number, maxDeviation: number): number {
    return Math.floor(number + (Math.random() - 0.5) * 2 * maxDeviation);
  }
}
