export interface Photo {
  src: string; // Source url where the photo is hosted
  title?: string; // Optional title that can be displayed along with the photo
}

export interface PhotoWithId {
  id: number; // Unique id of the photo
  photo: Photo;
}

export interface PhotoReference extends Photo {
  element: HTMLElement;
  animationActive: boolean;
}

export interface Config {
  photoSlideDuration: number; // Time in seconds for sliding a photo from left to right
  photoAddInterval: number; // Number of seconds after which a new photo is added to the slideshow
  backgroundDuration: number; // Time in seconds on how long the background photo is shown
  backgroundFadeDuration: number; // Time in seconds of fading from one background photo to another
}
