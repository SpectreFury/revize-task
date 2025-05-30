const colorMap: Record<string, string> = {
  "rgb(55, 184, 230)": "var(--blue-bg)",
  "rgb(217, 54, 141)": "var(--pink-bg)",
  "rgb(254, 209, 72)": "var(--yellow-bg)",
};

const umbrellaMap: Record<string, string> = {
  "rgb(55, 184, 230)": "blue-umbrella.png",
  "rgb(217, 54, 141)": "pink-umbrella.png",
  "rgb(254, 209, 72)": "yellow-umbrella.png",
};

const colorButtons =
  document.querySelectorAll<HTMLButtonElement>(".btn-picker");
const uploadButton = document.querySelector<HTMLDivElement>(".file-label");
const body = document.querySelector<HTMLBodyElement>("body");
const umbrellaImg = document.querySelector<HTMLImageElement>(".umbrella-image");
const logoImg = document.querySelector<HTMLImageElement>(".logo-icon");
const input = document.getElementById("file-input") as HTMLInputElement;
const inputText = document.querySelector<HTMLSpanElement>(".input-text");
const uploadImg = document.querySelector<HTMLImageElement>(".upload-icon");
const loaderImg = document.querySelector<HTMLImageElement>(".loader-icon");
const loaderContainer =
  document.querySelector<HTMLDivElement>(".loader-container");
const loaderPath = document.getElementById("loader-path");

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setButtonColor(button);
    setBackgroundColor(button);

    setUmbrellaColor(button);
  });
});

input.addEventListener("change", () => {
  const file = input.files?.[0];
  if (!file || !inputText) return;

  // Simulate a loading state
  loaderImg?.style.setProperty("display", "inline-block");
  uploadImg?.style.setProperty("display", "none");

  setTimeout(() => {
    inputText.textContent = file.name;

    loaderImg?.style.setProperty("display", "none");
    uploadImg?.style.setProperty("display", "inline-block");

    // Hide umbrella and show loader

    umbrellaImg?.style.setProperty("display", "none");
    loaderContainer?.style.setProperty("display", "flex");
    loaderPath?.setAttribute("fill", "rgb(55, 184, 230)");
    logoImg?.setAttribute("src", "");

    setTimeout(() => {
      // Show the umbrella and hide loader
      umbrellaImg?.style.setProperty("display", "flex");
      loaderContainer?.style.setProperty("display", "none");

      loaderPath?.setAttribute("fill", "rgb(55, 184, 230)");

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        if (logoImg) {
          logoImg.setAttribute("src", fileReader.result as string);
        }
      };
    }, 2000);
  }, 1000);
});

function setButtonColor(button: HTMLButtonElement) {
  const backgroundColor = getComputedStyle(button).backgroundColor;
  uploadButton?.style.setProperty("background-color", backgroundColor);
}

function setBackgroundColor(button: HTMLButtonElement) {
  const backgroundColor = getComputedStyle(button).backgroundColor;
  const mappedColor = colorMap[backgroundColor];

  if (mappedColor) {
    body?.style.setProperty("background-color", mappedColor);
  }
}

function setUmbrellaColor(button: HTMLButtonElement) {
  const backgroundColor = getComputedStyle(button).backgroundColor;
  const mappedColor = umbrellaMap[backgroundColor];

  if (mappedColor) {
    umbrellaImg?.setAttribute("src", mappedColor);
  }
}
