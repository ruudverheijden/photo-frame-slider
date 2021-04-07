import { Config, Photo } from "../model/models";

export default class backgroundView {
  private container: HTMLElement;

  private config: Config;

  private photoA: HTMLElement;

  private photoB: HTMLElement;

  private activePhotoA: boolean = true;

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
    this.photoA = this.createBackgroundElement();
    this.photoB = this.createBackgroundElement();
  }

  /**
   * Create an element to display the background photo in
   *
   * @private
   * @returns {HTMLElement} Reference to the newly created DOM element
   * @memberof backgroundView
   */
  private createBackgroundElement(): HTMLElement {
    const newElement = document.createElement("div");
    newElement.className = "background-photo";
    this.container.appendChild(newElement);
    return newElement;
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
      this.photoA.style.backgroundImage = `url("${photo?.src}")`;
      this.photoA.style.opacity = "1";

      this.photoA.style.zIndex = "initial";
      this.photoB.style.zIndex = "-1";

      this.photoA = this.createFadeAnimation(this.photoA);

      this.activePhotoA = false;
    } else {
      this.photoB.style.backgroundImage = `url("${photo?.src}")`;
      this.photoA.style.opacity = "0";

      this.photoA.style.zIndex = "-1";
      this.photoB.style.zIndex = "initial";

      this.photoB = this.createFadeAnimation(this.photoB);
      this.activePhotoA = true;
    }
  }

  /*
   * Create a fade animation
   *
   * @private
   * @static
   * @param {HTMLElement} element Reference to DOM element of the background photo
   * @returns {HTMLElement} Returns the HTMLElement including CSS animation
   * @memberof backgroundView
   */
  private createFadeAnimation(element: HTMLElement): HTMLElement {
    const animatedElement = element;
    animatedElement.style.transitionProperty = "opacity";
    animatedElement.style.transitionTimingFunction = "ease-in-out";
    animatedElement.style.transitionDuration = `${this.config.backgroundDuration}s`;

    return animatedElement;
  }
}
