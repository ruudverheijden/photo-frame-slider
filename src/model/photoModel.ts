import { Photo } from "./models";

export default class photoModel {
  private photoList: Photo[];

  private photoPath: string | undefined;

  constructor() {
    this.photoList = [];
  }

  /**
   * Load the list of photos async from the specified path
   *
   * @param {string} photoPath Path to the photos.json file listing all photos
   * @returns
   * @memberof photoModel
   */
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

  /**
   * Return a list of with IDs of all photos
   *
   * @returns {number[]} Returns an array of all IDs
   * @memberof photoModel
   */
  getPhotoListIds(): number[] {
    const photoIds: number[] = [];
    for (let i = 1; i <= this.photoList.length; i += 1) {
      photoIds.push(i);
    }
    return photoIds;
  }

  /**
   * Get a specific photo based on it ID
   *
   * @param {number} id ID of the photo
   * @returns {Photo}
   * @memberof photoModel
   */
  getPhotoById(id: number): Photo {
    return this.photoList[id];
  }
}
