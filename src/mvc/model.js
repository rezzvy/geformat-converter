export default class Model {
  constructor() {
    this.data = {
      file: "", // Stores the selected file
      objectURL: "", // Stores the object URL of the converted image
      conversionDelay: 250, // Delay applied after conversion in milliseconds
    };
  }

  // Getters and setters for file, objectURL, and conversionDelay
  get conversionDelay() {
    return this.data.conversionDelay;
  }

  get file() {
    return this.data.file;
  }

  set file(value) {
    this.data.file = value;
  }

  get objectURL() {
    return this.data.objectURL;
  }

  set objectURL(value) {
    this.data.objectURL = value;
  }

  // Clear the object URL to avoid memory leaks
  clearObjectURL() {
    if (this.data.objectURL) {
      URL.revokeObjectURL(this.data.objectURL);
    }
  }
}
