const images = [
  "Img/bau.png",
  "Img/cua.png",
  "Img/tom.png",
  "Img/ca.png",
  "Img/huou.png",
  "Img/ga.png",
];
const resultImages = document
  .getElementById("resultImages")
  .getElementsByTagName("img");
const betImages = document
  .getElementById("betImages")
  .getElementsByTagName("img");
const spinButton = document.getElementById("spinButton");
const resetButton = document.getElementById("resetButton");
let bets = [0, 0, 0, 0, 0, 0];
let totalBets = 0;
let isSpinning = false;
let randomImages = [];

const map = {
  "bau.png": "Bầu",
  "cua.png": "Cua",
  "tom.png": "Tôm",
  "ca.png": "Cá",
  "huou.png": "Hươu",
  "ga.png": "Gà",
};
function getBetImages() {
    const finalImageNames = [];
    bets.forEach((value, index) => {
      if (value > 0) {
        for (let i = 0; i < value; i++) {
          finalImageNames.push(images[index]);
        }
      }
    });
    return finalImageNames;
  }
function randomizeImages() {
  if (isSpinning) return;
  isSpinning = true;
  spinButton.disabled = true;
  resetButton.disabled = true;
  Array.from(betImages).forEach((img) => {
    img.style.pointerEvents = "none";
  }); 

  let count = 0;
  randomImages = []; 

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * images.length);
    randomImages.push(images[randomIndex]);
  }
  const interval = setInterval(() => {
    for (let i = 0; i < resultImages.length; i++) {
      const randomIndex = Math.floor(Math.random() * images.length);
      resultImages[i].src = images[randomIndex];
    }
    count++;
    if (count >= 100) {
      clearInterval(interval);
      for (let i = 0; i < resultImages.length; i++) {
        resultImages[i].src = randomImages[i];
      }
      isSpinning = false;
      spinButton.disabled = false;
      resetButton.disabled = false;
      Array.from(betImages).forEach(
        (img) => (img.style.pointerEvents = "auto")
      );
      checkResult();
    }
  }, 50);
}

function placeBet(index) {
  if (isSpinning) return;
  if (totalBets < 3) {
    bets[index]++;
    totalBets++;
    updateBetsDisplay();
  }
}

function resetBets() {
  if (isSpinning) return;
  bets.fill(0);
  totalBets = 0;
  updateBetsDisplay();
}

function updateBetsDisplay() {
  Array.from(document.querySelectorAll(".bets div")).forEach((div, index) => {
    div.querySelector("span").textContent = bets[index];
  });
}

Array.from(document.querySelectorAll(".bets img")).forEach((img, index) => {
  img.addEventListener("click", () => placeBet(index));
});

spinButton.addEventListener("click", randomizeImages);
resetButton.addEventListener("click", resetBets);

function checkResult() {
  const finalImageSources = getBetImages();
  const finalImageNames = finalImageSources.map((src) => src.split("/").pop()); 
  const randomImageNames = randomImages.map((src) => src.split("/").pop()); 
  const randomImageNamesText = randomImageNames.join(", ");
  const allSame =
    finalImageNames.length === randomImageNames.length &&
    finalImageNames.every((name) => randomImageNames.includes(name)) &&
    randomImageNames.every((name) => finalImageNames.includes(name));
  if (allSame) {
    console.log(
      `Bạn đã chọn đúng so với kết quả: ${getLableAndCount(
        finalImageNames
      )}`
    );
  } else {
    console.log(
      `Bạn đã chọn sai với kết quả: ${getLableAndCount(
        finalImageNames
      )}`
    );
  }
}
function getLableAndCount(selectedImages) {
  const countImage = {};

  selectedImages.forEach((imagesName) => {
    if (countImage[imagesName]) {
      countImage[imagesName]++;
    } else {
      countImage[imagesName] = 1;
    }
  });

  let text = "";
  Object.keys(countImage).forEach((imagesName) => {
    text += map[imagesName] + " " + countImage[imagesName] + " ";
  });
  return text;
}
