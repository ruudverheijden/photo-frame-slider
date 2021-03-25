import anime, { AnimeInstance } from "animejs";
import { PhotoReference } from "../model/models";

export default class slideshowView {
  private container: HTMLElement;

  private backgroundElement: HTMLElement;

  private backgroundAnimation: AnimeInstance | undefined;

  private highlightedPhoto: PhotoReference | undefined;

  private photos: Map<number, PhotoReference>;

  constructor(container: HTMLElement | null) {
    if (!container) {
      throw new Error("Invalid Slideshow container HTML element");
    }

    this.container = container;
    this.backgroundElement = this.createBackgroundElement();
    this.photos = new Map();
  }

  // Add a photo to the slideshow and start the animation
  async addPhoto(id: number, src: string, title: string | undefined) {
    // Don't add photos when highlight is active
    if (!this.highlightedPhoto) {
      if (!this.photos.has(id)) {
        // Await for the image element to have loaded
        const element = await this.createPhotoElement(id, src);

        // Store element reference for quick reference
        this.photos.set(id, { src, title, element });
      }

      // Start the animation if its not yet running
      if (!this.photos.get(id)?.animationActive) {
        this.setPhotoStartPosition(id);
        this.animatePhoto(id);
      }
    }
  }

  // Promise to create new photo html element
  private createPhotoElement(id: number, src: string): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const newElement = document.createElement("img");
      newElement.src = src;
      newElement.dataset.photoId = `${id}`;
      newElement.className = "photo";
      newElement.onload = () => resolve(newElement);
      newElement.onerror = reject;
      newElement.onclick = () => {
        this.highlightPhoto(id);
      };
      this.container.appendChild(newElement);
    });
  }

  // Create animation for photo
  animatePhoto(id: number): void {
    const photoReference = this.photos.get(id);

    if (!photoReference?.element) {
      throw new Error("Missing html element");
    }

    // Restart animation if it was already created before on this photo
    if (photoReference.animation) {
      photoReference.animation.restart();
    } else {
      const animation = this.createSlideAnimation(photoReference?.element);

      // Store animation reference
      photoReference.animation = animation;
    }
    // Store that animation is running
    photoReference.animationActive = true;
    this.photos.set(id, photoReference);
  }

  // Create a slide animation
  private createSlideAnimation(element: HTMLElement) {
    return anime({
      targets: element,
      // Make sure photo ends out of the container, even if it's rotated
      translateX: `${this.container.offsetWidth + element.offsetWidth * 1.3}px`,
      rotate: `${slideshowView.randomizeNumber(0, 10)}deg`,
      scale: slideshowView.randomizeNumber(1.0, 0.3, false),
      easing: "easeInOutSine",
      duration: slideshowView.randomizeNumber(10000, 2000),
      delay: slideshowView.randomizeNumber(1000, 1000),
      complete: (anim) => {
        if (anim.animatables[0]?.target?.dataset?.photoId) {
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
  }

  // Create an element to display the background photo in
  private createBackgroundElement(): HTMLElement {
    const newElement = document.createElement("div");
    newElement.className = "background-photo";
    this.container.appendChild(newElement);
    return newElement;
  }

  // Set background using a random photo that is already in the photos list
  setRandomBackgroundPhoto(): void {
    const randomId: number = Math.floor(Math.random() * this.photos.size);
    const photo = this.photos.get(randomId);

    if (photo?.src) {
      this.backgroundElement.style.backgroundImage = `url("${photo?.src}")`;
      this.backgroundElement.style.opacity = "0";

      this.backgroundAnimation = anime({
        targets: this.backgroundElement,
        opacity: 1,
        easing: "easeInOutSine",
        duration: 10000,
      });
    }
  }

  // Define photo start position by applying some randomisation
  private setPhotoStartPosition(id: number): void {
    const photoElement = this.photos.get(id)?.element;

    if (!photoElement) {
      throw new Error("Photo ID does not exist");
    }

    // Chose random top position within container height, assuming container height is larger that photo height
    const usableHeight =
      this.container.offsetHeight - photoElement.offsetHeight;
    const randomPosition = Math.floor(Math.random() * usableHeight);

    photoElement.style.left = `-${photoElement.offsetWidth}px`;
    photoElement.style.top = `${
      randomPosition + slideshowView.randomizeNumber(0, 50)
    }px`;
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

  // Pause animation of all photos and highlight specific photo
  private highlightPhoto(id: number) {
    const photo = this.photos.get(id);

    if (!photo || !photo.animation) {
      throw new Error("Unknown photo ID");
    }

    if (!this.highlightedPhoto) {
      // Pause all currently animated photos and start highlight animation
      this.photos.forEach((value: PhotoReference) => {
        if (value.animationActive && !value.animation?.paused) {
          value.animation?.pause();
        }
      });

      photo.element.style.zIndex = "999";

      // Remove existing animation
      anime.remove(photo.element);

      // Animate photo and zoom to center of screen
      const newAnimation = anime({
        targets: photo.element,
        scale: 2,
        top: `${
          this.container.offsetHeight / 2 - photo.element.offsetHeight / 2
        }px`,
        left: `${
          this.container.offsetWidth / 2 - photo.element.offsetWidth / 2
        }px`,
        translateX: 0,
        easing: "easeInOutSine",
        duration: 2000,
      });

      // Store new animation
      photo.animation = newAnimation;
      this.photos.set(id, photo);

      this.highlightedPhoto = photo;
    } else {
      // Resume all photo animations and remove highlight animation
      this.highlightedPhoto.element.style.zIndex = "initial";
      this.highlightedPhoto = undefined;

      this.photos.forEach((value: PhotoReference) => {
        value.animation?.play();
      });

      // Start new animation to continue slideshow for this photo
      photo.animation = this.createSlideAnimation(photo.element);
      this.photos.set(id, photo);
    }
  }
}
