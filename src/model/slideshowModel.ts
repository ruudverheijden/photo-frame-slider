import { Photo } from "./models";

export default class slideshowModel {
  private photoList: Photo[];

  private photoPath: string | undefined;

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
        data.forEach((element: Photo) => {
          if (element.src) {
            this.photoList.push({
              src: this.photoPath + element.src,
              title: element.title || undefined,
            });
          }
        });
        console.log(this.photoList);
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
