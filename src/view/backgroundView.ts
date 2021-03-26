import anime from "animejs";
import { Photo, PhotoReference } from "../model/models";

export default class backgroundView {
  private container: HTMLElement;

  private photoA: PhotoReference;

  private photoB: PhotoReference;

  /**
   * Creates an instance of backgroundView.
   * @param {(HTMLElement | null)} container Reference to container DOM element
   * @memberof backgroundView
   */
  constructor(container: HTMLElement | null) {
    if (!container) {
      throw new Error("Invalid Background container HTML element");
    }

    this.container = container;
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

    // Toggle photos based on whether animation is still running
    if (!this.photoA.animation) {
      this.photoA.element.style.backgroundImage = `url("${photo?.src}")`;
      this.photoA.element.style.opacity = "0";

      this.photoA.animation = anime({
        targets: this.photoA.element,
        opacity: 1,
        easing: "easeInOutSine",
        duration: 10000,
      });

      // Remove animation reference after its finishes
      this.photoA.animation.finished.then(() => {
        delete this.photoA.animation;
      });
    } else {
      this.photoB.element.style.backgroundImage = `url("${photo?.src}")`;
      this.photoB.element.style.opacity = "0";

      this.photoB.animation = anime({
        targets: this.photoA.element,
        opacity: 1,
        easing: "easeInOutSine",
        duration: 10000,
      });

      // Remove animation reference after its finishes
      this.photoB.animation.finished.then(() => {
        delete this.photoB.animation;
      });
    }
  }
}
