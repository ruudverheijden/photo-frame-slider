import anime from "animejs";
import photos from "../photos.json";
import { Photo } from "./model/photo";

let photoList: Photo[] = photos;

const interval = setInterval(() => {
    const nextPhoto: Photo | undefined = photoList.shift();
    if (nextPhoto) {
        const newPhotoElement: HTMLElement | null = createPhotoElement(nextPhoto.src, 'container');
        if (newPhotoElement){
            setPhotoVerticalPosition(newPhotoElement);
            animatePhoto(newPhotoElement);
        }
    }
}, 2000);

// Create a new photo element inside a container element
function createPhotoElement(src: string, containerId: string): HTMLElement | null {
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
function animatePhoto(photoElement: HTMLElement) {
  anime({
    targets: photoElement,
    translateX: "100vw",
    easing: "easeInOutSine",
    duration: randomizeNumber(10000, 2000),
    delay: randomizeNumber(1000, 1000),
  });
}

// Randomise photo vertically
function setPhotoVerticalPosition(photoElement: HTMLElement) {
  photoElement.style.top = randomizeNumber(40, 50) + "vh";
}

// Randomize an number with a maximum deviation that is either subtracted or added
function randomizeNumber(number: number, maxDeviation: number) {
  return Math.floor(number + (Math.random() - 0.5) * 2 * maxDeviation);
}
