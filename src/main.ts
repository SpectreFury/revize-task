import "./style.css";

let selectedColor = "";
let selectedTheme = "";

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

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setButtonColor(button);
    setBackgroundColor(button);

    setUmbrellaColor(button);
  });
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
