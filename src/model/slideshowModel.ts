import { Photo } from "./models";

export default class slideshowModel {
  private photoList: any; // Photo[];

  private photoPath: string;

  constructor() {
    this.photoList = [];
  }

  async loadPhotoList(photoPath: string) {
    this.photoPath = photoPath;
    return fetch(`${photoPath}/photos.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.photoList = data;
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
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

  getPhotoById(id: number): Photo {
    return this.photoList[id];
  }
}
