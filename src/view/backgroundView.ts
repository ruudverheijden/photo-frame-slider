import { Config, Photo } from "../model/models";

export default class backgroundView {
  private container: HTMLElement;

  private config: Config;

  private activePhotoA: boolean = true;

  private photoAId: string = "photoA";

  private photoBId: string = "photoB";

  /**
   * Creates an instance of backgroundView.
   * @param {(HTMLElement | null)} container Reference to container DOM element
   * @param {Config} config Reference to config
   * @memberof backgroundView
   */
  constructor(container: HTMLElement | null, config: Config) {
    if (!container) {
      throw new Error("Invalid Background container HTML element");
    }

    this.container = container;
    this.config = config;
  }

  /**
   * Create an element to display the background photo in and add it to the container
   *
   * @private
   * @param {string} imageSrc Source location of photo image
   * @param {string} id DOM Id value of the newly created element
   * @returns {HTMLElement} Reference to the newly created DOM element
   * @memberof backgroundView
   */
  private createBackgroundElement(imageSrc: string, id: string): HTMLElement {
    const newElement = document.createElement("div");
    newElement.className = "background-photo";
    newElement.id = id;
    newElement.style.backgroundImage = `url("${imageSrc}")`;
    this.container.appendChild(newElement);
    return newElement;
  }

  /**
   * Remove an element from the container
   *
   * @private
   * @param {string} id
   * @memberof backgroundView
   */
  private removeBackgroundElement(id: string): void {
    const element = document.getElementById(id);
    if (!element) {
      console.log(`BackgroundView: Element ${id} could not be removed!`);
    } else {
      this.container.removeChild(element);
    }
  }

  /**
   * Set background photo
   *
   * @param {Photo} photo
   * @memberof backgroundView
   */
  setNextBackgroundPhoto(photo: Photo): void {
    if (!photo.src) {
      throw new Error("Invalid photo source");
    }

    // Toggle photos every run to make the photos fade from one to the next
    if (this.activePhotoA) {
      if (this.photoAId) {
        this.removeBackgroundElement(this.photoAId);
      }

      const newPhoto = this.createBackgroundElement(photo.src, this.photoAId);
      this.createFadeInAnimation(newPhoto);
      this.activePhotoA = false;
    } else {
      if (this.photoBId) {
        this.removeBackgroundElement(this.photoBId);
      }

      const newPhoto = this.createBackgroundElement(photo.src, this.photoBId);
      this.createFadeInAnimation(newPhoto);
      this.activePhotoA = true;
    }
  }

  /*
   * Create a fade in animation
   *
   * @private
   * @static
   * @param {HTMLElement} element Reference to DOM element of the background photo which currently has opacity = 0
   * @returns {HTMLElement} Returns the HTMLElement including CSS animation
   * @memberof backgroundView
   */
  private createFadeInAnimation(element: HTMLElement): HTMLElement {
    const animatedElement = element;
    animatedElement.style.animationName = "fadeIn";
    animatedElement.style.animationDuration = `${this.config.backgroundDuration}s`;
    return animatedElement;
  }
}
