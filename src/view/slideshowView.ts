import randomizeNumber from "../helper/helpers";
import { PhotoReference, Config } from "../model/models";

export default class slideshowView {
  private container: HTMLElement;

  private config: Config;

  private highlightedPhoto: PhotoReference | undefined;

  private photos: Map<number, PhotoReference>;

  /**
   * Creates an instance of slideshowView.
   * @param {(HTMLElement | null)} container Reference to container DOM element
   * @memberof slideshowView
   */
  constructor(container: HTMLElement | null, config: Config) {
    if (!container) {
      throw new Error("Invalid Slideshow container HTML element");
    }

    this.container = container;
    this.config = config;
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
        const element = await this.createPhotoElement(id, src, title);

        // Store element reference for quick reference
        this.photos.set(id, { src, title, element, animationActive: false });
      }

      // Start the animation if its not yet running
      if (!this.photos.get(id)?.animationActive) {
        this.setPhotoStartPosition(id);
        this.animatePhoto(id);
      }
    }
  }

  /**
   * Create a new div and img element for the photo and add it to the container
   *
   * @private
   * @param {number} id ID of the photo
   * @param {string} src Source path of the image
   * @param {string | undefined} title Optional title text
   * @returns {Promise<HTMLElement>} Return the newly created HTML element async
   * @memberof slideshowView
   */
  private createPhotoElement(
    id: number,
    src: string,
    title: string | undefined
  ): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const photoElement = document.createElement("div");
      photoElement.className = "photo";
      photoElement.onclick = () => {
        // this.highlightPhoto(id);
      };

      const imgContainerElement = document.createElement("div");
      imgContainerElement.className = "img-container";

      const imgOverlayElement = document.createElement("div");
      imgOverlayElement.className = "img-overlay";

      const imgElement = document.createElement("img");
      imgElement.src = src;
      imgElement.onload = () => resolve(photoElement);
      imgElement.onerror = reject;

      imgContainerElement.appendChild(imgOverlayElement);
      imgContainerElement.appendChild(imgElement);
      photoElement.appendChild(imgContainerElement);

      if (title) {
        const titleElement = document.createElement("div");
        titleElement.className = "title";
        titleElement.innerHTML = title;
        photoElement.appendChild(titleElement);
      }

      this.container.appendChild(photoElement);
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

    photoReference.element = this.createSlideAnimation(photoReference?.element);
    photoReference.animationActive = true;

    // Store animation reference
    this.photos.set(id, photoReference);

    // Cleanup animation after is finished and set back active state
    photoReference.element.addEventListener("transitionend", () => {
      const photo = this.photos.get(id);
      if (photo) {
        slideshowView.removeAnimation(photo.element);
        photo.animationActive = false;
        this.photos.set(id, photo);
      }

      console.log("Transition ended");
    });
  }

  /**
   * Create a slide animation
   *
   * @private
   * @param {HTMLElement} element Reference to DOM element of the photo
   * @returns {HTMLElement} Returns the modified HTML element containing the CSS animations / transitions
   * @memberof slideshowView
   */
  private createSlideAnimation(element: HTMLElement): HTMLElement {
    const animatedElement = element;
    animatedElement.style.transitionProperty = "transform";
    animatedElement.style.transitionTimingFunction = "ease-in-out";
    animatedElement.style.transitionDelay = `${randomizeNumber(1, 1)}`;
    animatedElement.style.transitionDuration = `
      ${randomizeNumber(this.config.photoSlideDuration, 3)}s
    `;
    animatedElement.style.transform = `
      translateX(${this.container.offsetWidth + element.offsetWidth * 1.3}px)
      rotate(${randomizeNumber(0, 10)}deg)
      scale(${randomizeNumber(1.0, 0.3, false)})
    `;

    return animatedElement;
  }

  /**
   * Remove any CSS animations / transitions for an HTML element
   *
   * @private
   * @static
   * @param {HTMLElement} element Reference to DOM element of the photo
   * @returns {HTMLElement} Returns the modified HTML element containing no CSS animations / transitions
   * @memberof slideshowView
   */
  private static removeAnimation(element: HTMLElement): HTMLElement {
    const animatedElement = element;
    animatedElement.style.transition = "initial";
    animatedElement.style.transform = "none";
    return animatedElement;
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

    if (!photo || !photo.animationActive) {
      throw new Error("Unknown photo ID");
    }

    if (!this.highlightedPhoto) {
      // Pause all currently animated photos and start highlight animation
      this.photos.forEach((value: PhotoReference) => {
        slideshowView.pauseAnimation(value.element);
      });

      // Remove existing animation
      slideshowView.removeAnimation(photo.element);

      // Animate photo and zoom to center of screen
      photo.element = this.animatePhotoHighlight(photo.element);

      this.highlightedPhoto = photo;
    } else {
      // Resume all photo animations and remove highlight animation
      this.highlightedPhoto.element.style.zIndex = "initial";
      this.highlightedPhoto = undefined;

      this.photos.forEach((value: PhotoReference) => {
        slideshowView.resumeAnimation(value.element);
      });

      // Start new animation to continue slideshow for this photo
      photo.element = this.createSlideAnimation(photo.element);
    }

    // Store updated photo element
    this.photos.set(id, photo);
  }

  /**
   * Add CSS animation to element to move photo to center of the screen and scale
   *
   * @private
   * @param {HTMLElement} element
   * @returns {HTMLElement}
   * @memberof slideshowView
   */
  private animatePhotoHighlight(element: HTMLElement): HTMLElement {
    const animatedElement = element;
    animatedElement.style.zIndex = "999";
    animatedElement.style.transitionProperty = "transform, top, left";
    animatedElement.style.transitionTimingFunction = "ease-in-out";
    animatedElement.style.transitionDuration = "2s";
    animatedElement.style.top = `${
      this.container.offsetHeight / 2 - element.offsetHeight / 2
    }px`;
    animatedElement.style.left = `${
      this.container.offsetWidth / 2 - element.offsetWidth / 2
    }px`;
    animatedElement.style.transform = "scale(2)";

    return animatedElement;
  }

  /**
   * Pause the CSS animation / transition if it is running
   *
   * @private
   * @param {HTMLElement} element Reference to DOM element of the photo
   * @returns {HTMLElement} Returns the modified HTML element containing no CSS animations / transitions
   * @memberof slideshowView
   */
  private static pauseAnimation(element: HTMLElement): HTMLElement {
    const animatedElement = element;
    // TODO: pause animation
    return animatedElement;
  }

  /**
   * Resume the CSS animation / transition if it is paused
   *
   * @private
   * @param {HTMLElement} element Reference to DOM element of the photo
   * @returns {HTMLElement} Returns the modified HTML element containing no CSS animations / transitions
   * @memberof slideshowView
   */
  private static resumeAnimation(element: HTMLElement): HTMLElement {
    const animatedElement = element;
    // TODO: resume animation
    return animatedElement;
  }
}
