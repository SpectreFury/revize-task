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

let selectedColor = "rgb(55, 184, 230)";
let selectedButton = "btn-blue";
let umbrellaTimeout: ReturnType<typeof setTimeout> | null = null;
let isEditingPlacement = false;

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
const editPlacementBtn = document.querySelector<HTMLButtonElement>(
  ".edit-placement-btn"
);

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (selectedButton === button.classList[1]) return;
    selectedButton = button.classList[1];

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
    loaderPath?.setAttribute("fill", selectedColor);
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

  selectedColor = backgroundColor;
}

function setBackgroundColor(button: HTMLButtonElement) {
  const backgroundColor = getComputedStyle(button).backgroundColor;
  const mappedColor = colorMap[backgroundColor];

  if (mappedColor) {
    body?.style.setProperty("background-color", mappedColor);
  }
}

function setUmbrellaColor(button: HTMLButtonElement) {
  if (umbrellaTimeout) {
    clearTimeout(umbrellaTimeout);
    umbrellaTimeout = null;
  }

  // Show loader and hide umbrella
  umbrellaImg?.style.setProperty("display", "none");
  loaderPath?.setAttribute("fill", selectedColor);
  loaderContainer?.style.setProperty("display", "flex");
  logoImg?.style.setProperty("display", "none");

  umbrellaTimeout = setTimeout(() => {
    // Hide loader
    loaderContainer?.style.setProperty("display", "none");
    logoImg?.style.setProperty("display", "inline-block");

    // Show umbrella with the selected color
    umbrellaImg?.style.setProperty("display", "flex");

    const backgroundColor = getComputedStyle(button).backgroundColor;
    const mappedColor = umbrellaMap[backgroundColor];

    if (mappedColor) {
      umbrellaImg?.setAttribute("src", mappedColor);
    }
    umbrellaTimeout = null;
  }, 1000);
}

if (editPlacementBtn && logoImg && umbrellaImg) {
  editPlacementBtn.addEventListener("click", () => {
    isEditingPlacement = !isEditingPlacement;
    editPlacementBtn.classList.toggle("active", isEditingPlacement);
    if (isEditingPlacement) {
      editPlacementBtn.textContent = "Done";
      logoImg.style.cursor = "move";
      logoImg.draggable = false;
    } else {
      editPlacementBtn.textContent = "Edit Logo Placement";
      logoImg.style.cursor = "";
    }
  });

  let startX = 0,
    startY = 0,
    origLeft = 0,
    origTop = 0;

  logoImg.addEventListener("mousedown", (e) => {
    if (!isEditingPlacement || !umbrellaImg || !logoImg) return;
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    const rect = logoImg.getBoundingClientRect();
    const parentRect = umbrellaImg.getBoundingClientRect();
    origLeft = rect.left - parentRect.left;
    origTop = rect.top - parentRect.top;
    document.body.style.userSelect = "none";

    function onMouseMove(ev: MouseEvent) {
      if (!isEditingPlacement || !umbrellaImg || !logoImg) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newLeft = origLeft + dx;
      let newTop = origTop + dy;
      // Clamp within umbrella image
      const maxLeft = umbrellaImg.offsetWidth - logoImg.offsetWidth / 2;
      const maxTop = umbrellaImg.offsetHeight - logoImg.offsetHeight / 2;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));
      logoImg.style.left = `${(newLeft / umbrellaImg.offsetWidth) * 100}%`;
      logoImg.style.top = `${(newTop / umbrellaImg.offsetHeight) * 100}%`;
      logoImg.style.transform = "translate(-50%, -50%)";
    }
    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
}
