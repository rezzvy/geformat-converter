export default class Controller {
  constructor(model, view) {
    this.model = model; // Store reference to the model
    this.view = view; // Store reference to the view
  }

  // Initialize event listeners for user interactions
  init() {
    // Handle dragover event to show visual feedback
    this.view.inputBoxElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.view.setInputBoxTextPlaceholder(true, "Drop it here!"); // Update placeholder
      this.view.highlightInputBox(true, ["border-primary", "text-primary"]); // Highlight input box
    });

    // Handle dragleave event to revert visual feedback
    this.view.inputBoxElement.addEventListener("dragleave", (e) => {
      e.preventDefault();
      this.view.setInputBoxTextPlaceholder(false); // Reset placeholder
      if (!this.model.file) {
        this.view.highlightInputBox(false, ["border-primary", "text-primary"]); // Remove highlighting if no file
      }
    });

    // Handle click event to trigger file input dialog
    this.view.inputBoxElement.addEventListener("click", (e) => {
      this.view.inputFileElement.click();
    });

    // Handle drop event for file drop
    this.view.inputBoxElement.addEventListener("drop", (e) => {
      e.preventDefault();
      this.#fileInputHandler(e, "drop"); // Process the dropped file
    });

    // Handle change event for file selection
    this.view.inputFileElement.addEventListener("change", (e) => {
      this.#fileInputHandler(e, "input"); // Process the selected file
    });

    // Handle form submission for conversion
    this.view.conversionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.#conversionHandler(e); // Handle file conversion
    });

    // Handle form reset event
    this.view.conversionForm.addEventListener("reset", (e) => {
      this.#conversionResetHandler(); // Reset the conversion form
    });

    // Handle input change in format selection
    this.view.formatSelectionElement.addEventListener("input", (e) => {
      this.#convertAgainStateHandler(); // Enable convert again button
    });

    // Handle input change in quality range
    this.view.inputRangeElement.addEventListener("input", (e) => {
      this.#convertAgainStateHandler(); // Enable convert again button
      this.view.setInputRangeIndicator(e.currentTarget.value); // Update quality indicator
    });
  }

  // Handle file input from drop or file selection
  #fileInputHandler(event, source) {
    const file = source === "drop" ? event.dataTransfer.files[0] : event.target.files[0];

    // Check if the selected file is an image
    if (!file.type.startsWith("image/")) {
      this.view.setInputBoxTextPlaceholder(true, "Selected file is not an image!");
      this.view.highlightInputBox(true, ["border-danger", "text-danger"]); // Display error

      // Reset error display after a delay
      setTimeout(() => {
        this.view.setInputBoxTextPlaceholder(false);
        this.view.highlightInputBox(false, ["border-danger", "text-danger"]);

        if (!this.model.file) {
          this.view.highlightInputBox(false, ["border-primary", "text-primary"]);
        }
      }, 1000);
      return;
    }

    this.model.clearObjectURL(); // Clear previous object URL

    // Set model file and update view
    this.model.file = file;
    this.view.highlightInputBox(true, ["border-primary", "text-primary"]);
    this.view.setInputBoxText(`Selected file: ${this.model.file.name}`);
    this.view.enableControls(true, ["formatSelectionElement", "conversionFormSubmitButton", "inputRangeElement"]); // Enable form controls
  }

  // Handle form reset, clear all data
  #conversionResetHandler() {
    this.model.clearObjectURL(); // Clear object URL
    this.model.file = ""; // Clear file property in the model

    this.view.clearInputFileValue(); // Clear the file input value in the form (not the model's file property)
    this.view.displayElements(false, ["outputBoxImg", "successAlert"]); // Hide output and success alert
    this.view.highlightInputBox(false, ["border-primary", "text-primary"]); // Remove highlight
    this.view.enableControls(false, [
      "conversionFormSubmitButton",
      "conversionFormResetButton",
      "formatSelectionElement",
      "inputRangeElement",
      "downloadButton",
    ]); // Disable controls

    // Reset placeholders and range indicator
    this.view.setInputBoxText("Click this box to select an image, or simply drag and drop it here.");
    this.view.setDownloadSource("javascript:void(0)", false);
    this.view.setInputRangeIndicator("1");
  }

  // Handle file conversion
  #conversionHandler(event) {
    if (!this.model.file) return console.error("File is empty!"); // Exit if no file selected
    this.model.clearObjectURL(); // Clear previous object URL

    const formData = new FormData(event.currentTarget);
    const format = formData.get("format-selection");
    const quality = formData.get("quality-range");

    const tempImg = URL.createObjectURL(this.model.file); // Create object URL for selected file

    this.view.setConvertButtonText("Converting"); // Update button text

    // Disable form controls during conversion
    this.view.enableControls(false, [
      "conversionFormSubmitButton",
      "conversionFormResetButton",
      "formatSelectionElement",
      "inputRangeElement",
      "downloadButton",
    ]);

    // Create image from file and draw it on a canvas
    this.view.createImage(tempImg, (image) => {
      const canvas = this.view.drawImageToCanvas(image);
      canvas.toBlob(
        (blob) => {
          setTimeout(() => {
            this.model.objectURL = URL.createObjectURL(blob); // Generate object URL for converted image

            // Re-enable controls and update view with results
            this.view.setConvertButtonText("Convert");
            this.view.enableControls(true, ["formatSelectionElement", "inputRangeElement", "conversionFormResetButton", "downloadButton"]);
            this.view.setOutputImageSource(this.model.objectURL);
            this.view.setAlertSuccessFormat(format);
            this.view.displayElements(true, ["outputBoxImg", "successAlert"]);

            // Prepare download link with the new image format
            const splittedOriginalFilename = this.model.file.name.split(".");
            const downloadName = `${splittedOriginalFilename[0]}.${format}`;
            this.view.setDownloadSource(this.model.objectURL, downloadName);

            URL.revokeObjectURL(image.src); // Clean up
          }, this.model.conversionDelay); // Apply conversion delay
        },
        `image/${format}`,
        parseFloat(quality) // Set quality for the output image
      );
    });
  }

  // Enable the "Convert Again" button if form is edited
  #convertAgainStateHandler() {
    if (this.view.conversionFormSubmitButton.disabled) {
      this.view.enableControls(true, ["conversionFormSubmitButton"]);
      this.view.setConvertButtonText("Convert Again");
    }
  }
}
