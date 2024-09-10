export default class View {
  constructor() {
    // Cache DOM elements to interact with the view
    this.inputBoxElement = document.getElementById("input-box");
    this.inputFileElement = document.getElementById("input-file");
    this.inputRangeElement = document.getElementById("input-range");
    this.inputRangeIndicator = document.getElementById("input-range-indicator");
    this.outputBoxElement = document.getElementById("output-box");
    this.outputBoxImg = this.outputBoxElement.querySelector("img");
    this.conversionForm = document.getElementById("conversion-form");
    this.formatSelectionElement = document.getElementById("format-selection");
    this.conversionFormSubmitButton = document.getElementById("submit-btn");
    this.conversionFormResetButton = document.getElementById("reset-btn");
    this.successAlert = document.getElementById("success-alert");
    this.successAlertFormat = this.successAlert.querySelector("span");
    this.downloadButton = document.getElementById("download-btn");
  }

  // Clear the value of the file input element
  clearInputFileValue() {
    this.inputFileElement.value = null;
  }

  // Enable or disable controls based on the boolean value
  enableControls(boolean, controls) {
    controls.forEach((control) => {
      if (control === "downloadButton") {
        if (!boolean) {
          this.downloadButton.classList.add("disabled");
        } else {
          this.downloadButton.classList.remove("disabled");
        }
      } else {
        this[control].disabled = !boolean;
      }
    });
  }

  // Create an image element with the given source and execute the callback on load
  createImage(source, onload) {
    const img = document.createElement("img");
    img.src = source;

    img.onload = () => {
      onload(img);
    };
  }

  // Draw the provided image onto a canvas and return the canvas element
  drawImageToCanvas(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    return canvas;
  }

  // Display or hide elements based on the boolean value
  displayElements(boolean, elements) {
    elements.forEach((element) => {
      if (boolean) {
        this[element].classList.replace("d-none", "d-block");
      } else {
        this[element].classList.replace("d-block", "d-none");
      }
    });
  }

  // Set the source for the output image element
  setOutputImageSource(source) {
    this.outputBoxImg.src = source;
  }

  // Set the text content of the success alert element to the given format
  setAlertSuccessFormat(format) {
    this.successAlertFormat.textContent = format;
  }

  // Set the text for the conversion button
  setConvertButtonText(text) {
    this.conversionFormSubmitButton.value = text;
  }

  // Update the input range indicator with the current value
  setInputRangeIndicator(value) {
    this.inputRangeIndicator.textContent = value;
  }

  // Set the href and download attributes of the download button
  setDownloadSource(source, downloadFileName) {
    this.downloadButton.href = source;

    if (downloadFileName === false) {
      this.downloadButton.removeAttribute("download");
    } else {
      this.downloadButton.download = downloadFileName;
    }
  }

  // Set or clear the placeholder text of the input box
  setInputBoxTextPlaceholder(boolean, text) {
    if (boolean) {
      if (!this.inputBoxElement.dataset.text) {
        this.inputBoxElement.dataset.text = this.inputBoxElement.textContent;
      }

      this.inputBoxElement.textContent = text;
    } else {
      this.inputBoxElement.textContent = this.inputBoxElement.dataset.text;
    }
  }

  // Set the text content of the input box
  setInputBoxText(text) {
    this.inputBoxElement.dataset.text = text;
    this.inputBoxElement.textContent = text;
  }

  // Add or remove CSS classes from the input box element to highlight it
  highlightInputBox(boolean, classes) {
    classes.forEach((className) => {
      if (boolean) {
        this.inputBoxElement.classList.add(className);
      } else {
        this.inputBoxElement.classList.remove(className);
      }
    });
  }
}
