import "./style.css";

let selectedColor = "";
let selectedTheme = "";

const colorButtons =
  document.querySelectorAll<HTMLButtonElement>(".btn-picker");
const uploadButton = document.querySelector<HTMLDivElement>(".file-label");

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get the background color of the button

    const backgroundColor = getComputedStyle(button).backgroundColor;

    uploadButton?.style.setProperty("background-color", backgroundColor);
  });
});
