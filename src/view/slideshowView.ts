import anime, { AnimeInstance } from "animejs";
import randomizeNumber from "../helper/helpers";
import { PhotoReference } from "../model/models";

export default class slideshowView {
  private container: HTMLElement;

  private highlightedPhoto: PhotoReference | undefined;

  private photos: Map<number, PhotoReference>;

  /**
   * Creates an instance of slideshowView.
   * @param {(HTMLElement | null)} container Reference to container DOM element
   * @memberof slideshowView
   */
  constructor(container: HTMLElement | null) {
    if (!container) {
      throw new Error("Invalid Slideshow container HTML element");
    }

    this.container = container;
    this.photos = new Map();
  }

  /**
   * Add a photo to the slideshow and start the animation
   *
   * @param {number} id ID of the photo
   * @param {string} src Source path to photo
   * @param {(string | undefined)} title Optional title of the photo
   * @memberof slideshowView
   */
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
      if (!this.photos.get(id)?.animation) {
        this.setPhotoStartPosition(id);
        this.animatePhoto(id);
      }
    }
  }

  /**
   * Create a new photo html element and add it to the container
   *
   * @private
   * @param {number} id ID of the photo
   * @param {string} src Source path of the image
   * @returns {Promise<HTMLElement>} Return the newly created HTML element async
   * @memberof slideshowView
   */
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

  /**
   * Create animation for a photo
   *
   * @param {number} id ID of the photo
   * @memberof slideshowView
   */
  animatePhoto(id: number): void {
    const photoReference = this.photos.get(id);

    if (!photoReference?.element) {
      throw new Error("Missing html element");
    }

    const animation = this.createSlideAnimation(photoReference?.element);

    // Store animation reference
    photoReference.animation = animation;
    this.photos.set(id, photoReference);

    // Remove animation from photo Map after its finishes
    animation.finished.then(() => {
      delete photoReference.animation;
      this.photos.set(id, photoReference);
      anime.remove(photoReference.element);
    });
  }

  /**
   * Create a slide animation
   *
   * @private
   * @param {HTMLElement} element Reference to DOM element of the photo
   * @returns {AnimeInstance} Returns an instance of the Animejs animation
   * @memberof slideshowView
   */
  private createSlideAnimation(element: HTMLElement): AnimeInstance {
    return anime({
      targets: element,
      // Make sure photo ends out of the container, even if it's rotated
      translateX: `${this.container.offsetWidth + element.offsetWidth * 1.3}px`,
      rotate: `${randomizeNumber(0, 10)}deg`,
      scale: randomizeNumber(1.0, 0.3, false),
      easing: "easeInOutSine",
      duration: randomizeNumber(10000, 2000),
      delay: randomizeNumber(1000, 1000),
    });
  }

  /**
   * Define photo start position by applying some randomisation
   *
   * @private
   * @param {number} id ID of the photo
   * @memberof slideshowView
   */
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
    photoElement.style.top = `${randomPosition + randomizeNumber(0, 50)}px`;
    photoElement.style.transform = "none";
  }

  /**
   * Pause animation of all photos and highlight specific photo
   *
   * @private
   * @param {number} id ID of the photo
   * @memberof slideshowView
   */
  private highlightPhoto(id: number) {
    const photo = this.photos.get(id);

    if (!photo || !photo.animation) {
      throw new Error("Unknown photo ID");
    }

    if (!this.highlightedPhoto) {
      // Pause all currently animated photos and start highlight animation
      this.photos.forEach((value: PhotoReference) => {
        if (value.animation && !value.animation?.paused) {
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
