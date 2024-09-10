const inputBoxElement = document.getElementById("input-box");
const inputFileElement = document.getElementById("input-file");

const outputBoxElement = document.getElementById("output-box");
const outputBoxImg = outputBoxElement.querySelector("img");

const conversionForm = document.getElementById("conversion-form");

const inputRangeElement = document.getElementById("input-range");
const inputRangeIndicator = document.getElementById("input-range-indicator");

const successAlert = document.getElementById("success-alert");
const successAlertFormat = successAlert.querySelector("span");

const downloadButton = document.getElementById("download-btn");

let selectedFile = "";
let generatedBlobUrl = "";

// Functions
function fileHandler(event, source) {
  const file = source === "drop" ? event.dataTransfer.files[0] : event.target.files[0];
  if (!file.type.startsWith("image/")) return console.error("Invalid selected file!");

  clearGeneratedBlobUrl();
  selectedFile = file;
}

function clearGeneratedBlobUrl() {
  if (generatedBlobUrl !== "") {
    URL.revokeObjectURL(generatedBlobUrl);
  }
}

// Event listeners
inputBoxElement.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.currentTarget.classList.add("border-primary", "text-primary");
});
inputBoxElement.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.currentTarget.classList.remove("border-primary", "text-primary");
});
inputBoxElement.addEventListener("drop", (e) => {
  e.preventDefault();
  e.currentTarget.classList.add("border-primary", "text-primary");
  fileHandler(e, "drop");
});

inputBoxElement.addEventListener("click", () => {
  inputFileElement.click();
});

inputFileElement.addEventListener("change", (e) => {
  fileHandler(e, "input");
});

inputRangeElement.addEventListener("input", (e) => {
  inputRangeIndicator.textContent = e.currentTarget.value;
});

conversionForm.addEventListener("reset", (e) => {
  clearGeneratedBlobUrl();
  inputRangeIndicator.textContent = "1";
  outputBoxImg.src = "#";
  outputBoxImg.classList.replace("d-block", "d-none");

  downloadButton.href = "javascript:void(0)";
  downloadButton.removeAttribute("download");
});

conversionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (selectedFile === "") return console.error("Select a file first!");

  clearGeneratedBlobUrl();

  const formData = new FormData(e.currentTarget);
  const img = document.createElement("img");
  img.src = URL.createObjectURL(selectedFile);
  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        generatedBlobUrl = URL.createObjectURL(blob);
        outputBoxImg.classList.replace("d-none", "d-block");
        outputBoxImg.src = generatedBlobUrl;

        downloadButton.href = generatedBlobUrl;

        const originalFileName = selectedFile.name.split(".")[0];
        const newExtension = formData.get("format-selection");

        downloadButton.download = `${originalFileName}.${newExtension}`;
        successAlertFormat.textContent = formData.get("format-selection");

        URL.revokeObjectURL(img.src);
      },
      `image/${formData.get("format-selection")}`,
      parseFloat(formData.get("quality-range"))
    );
  };
});
