const inputBoxElement = document.getElementById("input-box");
const inputFileElement = document.getElementById("input-file");

const outputBoxElement = document.getElementById("output-box");
const outputBoxImg = outputBoxElement.querySelector("img");

const conversionForm = document.getElementById("conversion-form");
const inputRangeElement = document.getElementById("input-range");
const inputRangeIndicator = document.getElementById("input-range-indicator");
const formatSelectionElement = document.getElementById("format-selection");

const conversionFormSubmitButton = document.getElementById("submit-btn");
const conversionFormResetButton = document.getElementById("reset-btn");

const successAlert = document.getElementById("success-alert");
const successAlertFormat = successAlert.querySelector("span");

const downloadButton = document.getElementById("download-btn");

let inputBoxTextContent = "";

let selectedFile = "";
let generatedBlobUrl = "";

const conversionDelay = 500;

// Functions
function fileHandler(event, source) {
  const file = source === "drop" ? event.dataTransfer.files[0] : event.target.files[0];

  if (!file.type.startsWith("image/")) {
    inputBoxElement.textContent = "Selected file is not an image!";
    inputBoxElement.classList.add("border-danger", "text-danger");

    setTimeout(() => {
      inputBoxElement.textContent = "Click this box to select an image, or simply drag and drop it here.";
      inputBoxElement.classList.remove("border-primary", "text-primary", "border-danger", "text-danger");
    }, 1000);

    return console.error("Invalid selected file!");
  }

  clearGeneratedBlobUrl();
  selectedFile = file;

  formatSelectionElement.disabled = false;
  inputRangeElement.disabled = false;
  conversionFormSubmitButton.disabled = false;

  inputBoxElement.classList.add("border-primary", "text-primary");
  inputBoxElement.textContent = `Selected file : ${file.name}`;
  inputBoxTextContent = inputBoxElement.textContent;
}

function clearGeneratedBlobUrl() {
  if (generatedBlobUrl !== "") {
    URL.revokeObjectURL(generatedBlobUrl);
  }
}

// Event listeners
inputBoxElement.addEventListener("dragover", (e) => {
  e.preventDefault();

  if (inputBoxTextContent === "") {
    inputBoxTextContent = e.currentTarget.textContent;
  }

  e.currentTarget.classList.add("border-primary", "text-primary");
  e.currentTarget.textContent = "Drop it here!";
});
inputBoxElement.addEventListener("dragleave", (e) => {
  e.preventDefault();

  e.currentTarget.textContent = inputBoxTextContent;

  if (selectedFile === "") {
    e.currentTarget.classList.remove("border-primary", "text-primary");
  }

  if (inputBoxTextContent !== "") {
    inputBoxTextContent = "";
  }
});
inputBoxElement.addEventListener("drop", (e) => {
  e.preventDefault();
  fileHandler(e, "drop");
});

inputBoxElement.addEventListener("click", () => {
  inputFileElement.click();
});

inputFileElement.addEventListener("change", (e) => {
  fileHandler(e, "input");
});

formatSelectionElement.addEventListener("input", (e) => {
  if (conversionFormSubmitButton.disabled) {
    conversionFormSubmitButton.disabled = false;
    conversionFormSubmitButton.value = "Convert Again";
  }
});

inputRangeElement.addEventListener("input", (e) => {
  inputRangeIndicator.textContent = e.currentTarget.value;

  if (conversionFormSubmitButton.disabled) {
    conversionFormSubmitButton.disabled = false;
    conversionFormSubmitButton.value = "Convert Again";
  }
});

conversionForm.addEventListener("reset", (e) => {
  clearGeneratedBlobUrl();
  inputRangeIndicator.textContent = "1";
  outputBoxImg.src = "#";
  outputBoxImg.classList.replace("d-block", "d-none");
  successAlert.classList.replace("d-block", "d-none");
  downloadButton.classList.add("disabled");

  conversionFormSubmitButton.disabled = true;
  conversionFormResetButton.disabled = true;
  formatSelectionElement.disabled = true;
  inputRangeElement.disabled = true;

  conversionFormSubmitButton.value = "Convert";

  inputBoxElement.classList.remove("border-primary", "text-primary");
  inputBoxElement.textContent = "Click this box to select an image, or simply drag and drop it here.";

  downloadButton.href = "javascript:void(0)";
  downloadButton.removeAttribute("download");

  inputFileElement.value = "";
});

conversionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (selectedFile === "") return console.error("Select a file first!");

  clearGeneratedBlobUrl();

  const formData = new FormData(e.currentTarget);
  const img = document.createElement("img");

  conversionFormSubmitButton.value = "Converting";
  conversionFormSubmitButton.disabled = true;

  img.src = URL.createObjectURL(selectedFile);
  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        setTimeout(() => {
          generatedBlobUrl = URL.createObjectURL(blob);
          successAlert.classList.replace("d-none", "d-block");

          outputBoxImg.classList.replace("d-none", "d-block");
          outputBoxImg.src = generatedBlobUrl;

          downloadButton.href = generatedBlobUrl;

          const originalFileName = selectedFile.name.split(".")[0];
          const newExtension = formData.get("format-selection");

          conversionFormResetButton.disabled = false;

          downloadButton.download = `${originalFileName}.${newExtension}`;
          downloadButton.classList.remove("disabled");

          successAlertFormat.textContent = formData.get("format-selection");
          conversionFormSubmitButton.value = "Convert";

          URL.revokeObjectURL(img.src);
        }, conversionDelay);
      },
      `image/${formData.get("format-selection")}`,
      parseFloat(formData.get("quality-range"))
    );
  };
});
