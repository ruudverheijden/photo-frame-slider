import "./css/styles.css";
import ConfigModel from "./model/configModel";
import PhotoModel from "./model/photoModel";
import SlideshowView from "./view/slideshowView";
import SlideshowController from "./controller/slideshowController";
import BackgroundView from "./view/backgroundView";
import BackgroundController from "./controller/backgroundController";

/**
 * Initiate photo model via function since async/await is not allowed at top level
 *
 * @returns {Promise<PhotoModel>}
 */
async function init() {
  const configModel = new ConfigModel();
  await configModel.loadConfig("./config.json");

  const photoModel = new PhotoModel();
  await photoModel.loadPhotoList("./photos/");

  // eslint-disable-next-line no-unused-vars
  const slideshow = new SlideshowController(
    photoModel,
    new SlideshowView(
      document.getElementById("slideshow-container"),
      configModel.config
    ),
    configModel.config
  );

  // eslint-disable-next-line no-unused-vars
  const background = new BackgroundController(
    photoModel,
    new BackgroundView(
      document.getElementById("background-container"),
      configModel.config
    ),
    configModel.config
  );
}

init();
