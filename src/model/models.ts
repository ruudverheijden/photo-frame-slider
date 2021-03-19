import { AnimeInstance } from "animejs";

export interface Photo {
  src: string; // Source url where the photo is hosted
  title?: string; // Optional title that can be displayed along with the photo
}

export interface PhotoWithId {
  id: number; // Unique id of the photo
  photo: Photo;
}

export interface PhotoReference {
  element: HTMLElement;
  animation?: AnimeInstance;
  animationActive?: boolean;
}
