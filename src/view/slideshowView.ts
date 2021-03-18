import anime from "animejs";

export default class slideshowView {
  private container: HTMLElement;

  private elements: HTMLElement[];

  constructor(container: HTMLElement | null) {
    if (!container) {
      throw new Error("Invalid Slideshow container HTML element");
    }

    this.container = container;
    this.elements = [];
  }

  // Create a new photo element inside a container element
  createPhotoElement(src: string): number {
    const newElement = document.createElement("img");
    newElement.src = src;
    newElement.className = "photo";
    this.container.appendChild(newElement);

    // Store element reference for quick reference
    this.elements.push(newElement);

    // Return index of last added element
    return this.elements.length - 1;
  }

  // Get photo element based on array index id
  getPhotoElementByIndex(index: number): HTMLElement {
    return this.elements[index];
  }

  // Create animation for photo
  animatePhoto(photoIndex: number): void {
    anime({
      targets: this.getPhotoElementByIndex(photoIndex),
      translateX: "100vw",
      easing: "easeInOutSine",
      duration: slideshowView.randomizeNumber(10000, 2000),
      delay: slideshowView.randomizeNumber(1000, 1000),
    });
  }

  // Randomise photo vertically
  setPhotoVerticalPosition(photoIndex: number): void {
    const element = this.getPhotoElementByIndex(photoIndex);
    element.style.top = `${slideshowView.randomizeNumber(40, 50)}vh`;
  }

  private static randomizeNumber(number: number, maxDeviation: number): number {
    return Math.floor(number + (Math.random() - 0.5) * 2 * maxDeviation);
  }
}
