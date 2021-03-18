import anime from "animejs";
import randomizeNumber from "../helper/helpers";

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
      duration: randomizeNumber(10000, 2000),
      delay: randomizeNumber(1000, 1000),
    });
  }

  // Randomise photo vertically
  static setPhotoVerticalPosition(photoElement: HTMLElement) {
    const element = photoElement;
    element.style.top = `${randomizeNumber(40, 50)}vh`;
  }
}
