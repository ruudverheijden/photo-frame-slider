import { Config } from "./models";
import configDefaults from "../configDefaults.json";

export default class configModel {
  config: Config;

  constructor() {
    this.config = <Config>configDefaults;
  }

  /**
   * Load the config file async from the specified path or use default config
   *
   * @param {string} configPath Path to the config json file
   * @returns
   * @memberof configModel
   */
  public async loadConfig(configPath: string) {
    return fetch(configPath)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.config = data;
        console.log(`Using config: ${JSON.stringify(data)}`);
      })
      .catch(() => {
        console.log(
          `Cannot load config from ${configPath}, using defaults instead`
        );
        console.log(`Using config: ${JSON.stringify(this.config)}`);
      });
  }
}
