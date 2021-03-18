import SlideshowModel from "./model/slideshowModel";
import SlideshowView from "./view/slideshowView";
import SlideshowController from "./controller/slideshowController";

const slideshow = new SlideshowController(
  new SlideshowModel(),
  new SlideshowView(document.getElementById("container"))
);

slideshow.start();
