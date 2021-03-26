import anime from "animejs";
import { Photo } from "../model/models";

export default class backgroundView {
  private container: HTMLElement;

  private backgroundElement: HTMLElement;

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
    this.backgroundElement = this.createBackgroundElement();
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

    this.container.style.backgroundImage = `url("${photo?.src}")`;
    this.container.style.opacity = "0";

    anime({
      targets: this.container,
      opacity: 1,
      easing: "easeInOutSine",
      duration: 10000,
    });
  }
}
