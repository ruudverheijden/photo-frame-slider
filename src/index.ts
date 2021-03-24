import "./css/styles.css";
import SlideshowModel from "./model/slideshowModel";
import SlideshowView from "./view/slideshowView";
import SlideshowController from "./controller/slideshowController";

async function initSlideShowModel(): Promise<SlideshowModel> {
  const slideshowModel = new SlideshowModel();
  await slideshowModel.loadPhotoList("./photos/");
  return slideshowModel;
}

async function initSlideshow(): Promise<SlideshowController> {
  return new SlideshowController(
    await initSlideShowModel(),
    new SlideshowView(document.getElementById("container"))
  );
}

initSlideshow();
