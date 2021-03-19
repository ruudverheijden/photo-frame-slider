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

  // Add a photo to the slideshow and start the animation
  addPhoto(id: number, src: string) {
    if (!this.photos.has(id)) {
      this.createPhotoElement(id, src);
      this.addPhotoElementToContainer(id);
    }

    // Start the animation if its not yet running
    if (!this.photos.get(id)?.animationActive) {
      this.animatePhoto(id);
    }
  }

  // Create a new photo html element
  private createPhotoElement(id: number, src: string): void {
    const newElement = document.createElement("img");
    newElement.src = src;
    newElement.dataset.photoId = `${id}`;
    newElement.className = "photo";

    // Store element reference for quick reference
    this.photos.set(id, { element: newElement });
  }

  // Add photo to container
  private addPhotoElementToContainer(id: number): void {
    const photoElement = this.photos.get(id)?.element;

    if (!photoElement) {
      throw new Error("Photo ID does not exist");
    }

    this.container.appendChild(photoElement);
  }

  // Create animation for photo
  animatePhoto(id: number): void {
    if (this.photos.has(id)) {
      const photoReference = this.photos.get(id);

      if (photoReference?.element) {
        this.setPhotoStartPosition(id);

        // Restart animation if it was already ran before and is currently not running
        if (photoReference.animation) {
          photoReference.animation.restart();
        } else {
          const animation = anime({
            targets: photoReference?.element,
            translateX: `${
              this.container.offsetWidth +
              photoReference.element.offsetWidth * 1.3
            }px`, // Make sure photo ends out of the container, even if it's rotated
            rotate: `${slideshowView.randomizeNumber(0, 10)}deg`,
            scale: slideshowView.randomizeNumber(1.0, 0.3, false),
            easing: "easeInOutSine",
            duration: slideshowView.randomizeNumber(30000, 2000),
            delay: slideshowView.randomizeNumber(1000, 1000),
            complete: (anim) => {
              if (
                anim.animatables &&
                anim.animatables[0] &&
                anim.animatables[0].target &&
                anim.animatables[0].target.dataset &&
                anim.animatables[0].target.dataset.photoId
              ) {
                const photoId = parseInt(
                  anim.animatables[0].target.dataset.photoId,
                  10
                );

                const photoElement = this.photos.get(photoId);

                if (!photoElement) {
                  throw new Error("Photo ID does not exist");
                }

                photoElement.animationActive = false;
                this.photos.set(photoId, photoElement);
              }
            },
          });

          // Store animation reference
          photoReference.animation = animation;
        }
        // Store that animation is running
        photoReference.animationActive = true;
        this.photos.set(id, photoReference);
      }
    }
  }

  // Define photo start position by applying some randomisation
  private setPhotoStartPosition(id: number): void {
    const photoElement = this.photos.get(id)?.element;

    if (!photoElement) {
      throw new Error("Photo ID does not exist");
    }

    photoElement.style.left = `-${photoElement.offsetWidth}px`;
    photoElement.style.top = `${slideshowView.randomizeNumber(40, 50)}vh`;
  }

  // Randomise number with a maximum deviation, defaults to convert to integer
  private static randomizeNumber(
    number: number,
    maxDeviation: number,
    toInteger: boolean = true
  ): number {
    const randomised = number + (Math.random() - 0.5) * 2 * maxDeviation;
    return toInteger ? Math.floor(randomised) : randomised;
  }
}
