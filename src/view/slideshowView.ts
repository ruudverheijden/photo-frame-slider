import anime from "animejs";

export default class slideshowView {
  private container: HTMLElement;

  private photoElements: Map<number, HTMLElement>;

  constructor(container: HTMLElement | null) {
    if (!container) {
      throw new Error("Invalid Slideshow container HTML element");
    }

    this.container = container;
    this.photoElements = new Map();
  }

  // Add a new photo to the slideshow
  addNewPhoto(src: string, id: number) {
    this.createPhotoElement(src, id);
    this.addPhotoElementToContainer(id);
  }

  // Create a new photo html element
  private createPhotoElement(src: string, id: number): void {
    const newElement = document.createElement("img");
    newElement.src = src;
    newElement.className = "photo";

    // Store element reference for quick reference
    this.photoElements.set(id, newElement);
  }

  // Get photo element based on array index id
  getPhotoElementById(id: number): HTMLElement | undefined {
    return this.photoElements.get(id) || undefined;
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
    anime({
      targets: this.getPhotoElementById(id),
      translateX: "100vw",
      easing: "easeInOutSine",
      duration: slideshowView.randomizeNumber(10000, 2000),
      delay: slideshowView.randomizeNumber(1000, 1000),
    });
  }

  // Randomise photo vertically
  setPhotoVerticalPosition(id: number): void {
    const photoElement = this.getPhotoElementById(id);

    if (photoElement) {
      photoElement.style.top = `${slideshowView.randomizeNumber(40, 50)}vh`;
    }
  }

  private static randomizeNumber(number: number, maxDeviation: number): number {
    return Math.floor(number + (Math.random() - 0.5) * 2 * maxDeviation);
  }
}
