import anime from "animejs";
import { PhotoReference } from "../model/models";

export default class slideshowView {
  private container: HTMLElement;

  private photoElements: Map<number, PhotoReference>;

  constructor(container: HTMLElement | null) {
    if (!container) {
      throw new Error("Invalid Slideshow container HTML element");
    }

    this.container = container;
    this.photoElements = new Map();
  }

  // Add a new photo to the slideshow
  addNewPhoto(id: number, src: string) {
    if (!this.photoElements.has(id)) {
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
    this.photoElements.set(id, { element: newElement });
  }

  // Get photo element based on array index id
  getPhotoElementById(id: number): HTMLElement | undefined {
    return this.photoElements.get(id)?.element || undefined;
  }

  // Add photo to container
  private addPhotoElementToContainer(id: number): void {
    const photoElement: HTMLElement | undefined = this.getPhotoElementById(id);

    if (photoElement) {
      this.container.appendChild(photoElement);
    }
  }

  // Create animation for photo
  animatePhoto(id: number): void {
    const photo = this.getPhotoElementById(id);
    this.setPhotoStartPosition(id);

    anime({
      targets: photo,
      translateX: "100vw",
      easing: "easeInOutSine",
      duration: slideshowView.randomizeNumber(10000, 2000),
      delay: slideshowView.randomizeNumber(1000, 1000),
    });
  }

  // Define photo start position by applying some randomisation
  private setPhotoStartPosition(id: number): void {
    const photoElement = this.getPhotoElementById(id);

    if (photoElement) {
      photoElement.style.left = `${slideshowView.randomizeNumber(0, 5)}vw`;
      photoElement.style.top = `${slideshowView.randomizeNumber(40, 50)}vh`;
    }
  }

  private static randomizeNumber(number: number, maxDeviation: number): number {
    return Math.floor(number + (Math.random() - 0.5) * 2 * maxDeviation);
  }
}
