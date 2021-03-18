import anime from "animejs";

export default class slideshowView {
  // Create a new photo element inside a container element
  static createPhotoElement(
    src: string,
    containerId: string
  ): HTMLElement | null {
    const container: HTMLElement | null = document.getElementById(containerId);

    if (container) {
      const newElement = document.createElement("img");
      newElement.src = src;
      newElement.className = "photo";
      container.appendChild(newElement);

      return newElement;
    }
    return null;
  }

  // Create animation for photo
  static animatePhoto(photoElement: HTMLElement) {
    anime({
      targets: photoElement,
      translateX: "100vw",
      easing: "easeInOutSine",
      duration: this.randomizeNumber(10000, 2000),
      delay: this.randomizeNumber(1000, 1000),
    });
  }

  // Randomise photo vertically
  static setPhotoVerticalPosition(photoElement: HTMLElement) {
    const element = photoElement;
    element.style.top = `${this.randomizeNumber(40, 50)}vh`;
  }

  private static randomizeNumber(number: number, maxDeviation: number) {
    return Math.floor(number + (Math.random() - 0.5) * 2 * maxDeviation);
  }
}
