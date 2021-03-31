import anime, { AnimeInstance } from "animejs";
import { Config, Photo, PhotoReference } from "../model/models";

export default class backgroundView {
  private container: HTMLElement;

  private config: Config;

  private photoA: PhotoReference;

  private photoB: PhotoReference;

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
    this.photoA = {
      src: "",
      element: this.createBackgroundElement(),
    };
    this.photoB = {
      src: "",
      element: this.createBackgroundElement(),
    };
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
      this.photoA.element.style.backgroundImage = `url("${photo?.src}")`;
      this.photoA.element.style.opacity = "0";

      this.photoA.element.style.zIndex = "initial";
      this.photoB.element.style.zIndex = "-1";

      this.photoA.animation = this.createSlideAnimation(this.photoA.element);

      this.activePhotoA = false;

      // Remove animation reference after its finishes
      this.photoA.animation.finished.then(() => {
        delete this.photoA.animation;
      });
    } else {
      this.photoB.element.style.backgroundImage = `url("${photo?.src}")`;
      this.photoB.element.style.opacity = "0";

      this.photoA.element.style.zIndex = "-1";
      this.photoB.element.style.zIndex = "initial";

      this.photoB.animation = this.createSlideAnimation(this.photoB.element);
      this.activePhotoA = true;

      // Remove animation reference after its finishes
      this.photoB.animation.finished.then(() => {
        delete this.photoB.animation;
      });
    }
  }

  /*
   * Create a fade animation
   *
   * @private
   * @static
   * @param {HTMLElement} element Reference to DOM element of the background photo
   * @returns {AnimeInstance} Returns an instance of the Animejs animation
   * @memberof backgroundView
   */
  private createSlideAnimation(element: HTMLElement): AnimeInstance {
    return anime({
      targets: element,
      opacity: 1,
      easing: "easeInOutSine",
      duration: this.config.backgroundFadeDuration * 1000,
    });
  }
}
