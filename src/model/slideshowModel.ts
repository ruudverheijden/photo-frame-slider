import { Photo } from "./models";

export default class slideshowModel {
  private photoList: Photo[];

  private photoPath: string | undefined;

  constructor() {
    this.photoList = [];
  }

  // Load the list of photos async from the specified path
  public async loadPhotoList(photoPath: string) {
    this.photoPath = photoPath;

    return fetch(`${photoPath}/photos.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.forEach((element: Photo) => {
          if (element.src) {
            this.photoList.push({
              src: this.photoPath + element.src,
              title: element.title || undefined,
            });
          }
        });
      })
      .catch((error) => {
        throw new Error(
          `Cannot load photos config from ${photoPath}/photos.json because of: ${error}`
        );
      });
  }

  // Return a list of with IDs of all photos
  getPhotoListIds(): number[] {
    const photoIds: number[] = [];
    for (let i = 1; i <= this.photoList.length; i += 1) {
      photoIds.push(i);
    }
    return photoIds;
  }

  // Get a specific photo based on it ID
  getPhotoById(id: number): Photo {
    return this.photoList[id];
  }
}
