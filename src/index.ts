import "./css/styles.css";
import SlideshowModel from "./model/slideshowModel";
import SlideshowView from "./view/slideshowView";
import SlideshowController from "./controller/slideshowController";

async function initSlideshow(): Promise<SlideshowController> {
  const slideshowModel = new SlideshowModel();
  await slideshowModel.loadPhotoList("./photos/");

  return new SlideshowController(
    slideshowModel,
    new SlideshowView(document.getElementById("container"))
  );
}

initSlideshow();
