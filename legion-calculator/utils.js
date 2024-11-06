import {
  characters,
  legionRank,
  legionClass,
  legionGrid,
  allChar,
} from "./constants.js";

window.onload = function () {
  initializeCharacterInputs();
  initializeLegionRankDisplay();
  initializeLegionClassDisplay();
  initializeLegionGridDisplay();

  document
    .getElementById("calculate")
    .addEventListener("click", calculateLegion);

  document.getElementById("reset").addEventListener("click", resetData);
  document.getElementById("mode1").addEventListener("change", calculateLegion);
  document.getElementById("mode2").addEventListener("change", calculateLegion);
};

function initializeCharacterInputs() {
  const storedValue = JSON.parse(localStorage.getItem("data")) || {};

  characters.sort((a, b) => a.name.localeCompare(b.name));
  const classGroupElement = document.getElementById("classGroup");
  classGroupElement.innerHTML = characters
    .map(
      (char) => `
      <div class="col-lg-2 col-md-4 col-sm-6 col-6 mb-1 fw-semibold">
        <span>${char.name}</span>
        <input type="number" class="form-control" id='${char.name}' value=${
        storedValue[char.name] || char.level
      } min="1" max="300">
      </div>
    `
    )
    .join("");
}
function initializeLegionRankDisplay() {
  const legionRankElement = document.getElementById("legionrank");
  legionRankElement.innerHTML = legionRank
    .map(
      (rnk) => `
      <div>
        <span class="fw-semibold">${rnk.rank === "Unrank" ? "" : "Rank"} ${
        rnk.rank
      } Lvl. ${rnk.min}-${rnk.max} / ${rnk.zmin}-${rnk.zmax} (Zero):</span>
        <span id='${rnk.rank}'>${rnk.count}</span>
      </div>
    `
    )
    .join("");
}

function initializeLegionClassDisplay() {
  const legionClassElement = document.getElementById("legionclass");
  legionClassElement.innerHTML = legionClass
    .map(
      (cls) => `
      <div><span class="fw-semibold">${cls.class}:</span> <span id='${cls.class}'>${cls.count}</span></div>
    `
    )
    .join("");
}

function initializeLegionGridDisplay() {
  // legionGrid.forEach((grd) => {
  //   const level = legionRank
  //     .filter((rnk) => rnk.rank === grd.baseRank)
  //     .map((rnk) => rnk.min);
  //   const job =
  //     level > 100
  //       ? grd.jobSpecific.length > 0 && grd.nameSpecific == null
  //         ? grd.jobSpecific
  //         : grd.nameSpecific
  //       : "";
  //   const element = `<div><span class="fw-semibold">Lv. ${level} ${job}:</span> <span id='${grd.grid}'>${grd.count}</span> </div>`;
  //   document.getElementById("legiongrid").innerHTML += element;
  // });
  const legionGridElement = document.getElementById("legiongrid");
  legionGridElement.innerHTML = legionGrid
    .map(
      (grd) => `
      <div><span class="fw-semibold">${grd.grid}:</span> <span id='${grd.grid}'>${grd.count}</span></div>
    `
    )
    .join("");
}

function calculateLegion() {
  let characterData = {};
  characters.forEach((character) => {
    const element = document.getElementById(character.name);
    character.level = parseInt(element?.value) || 0;
    characterData[character.name] = character.level;
  });
  localStorage.setItem("data", JSON.stringify(characterData));

  const selectedChars = !document.getElementById("mode1").checked
    ? characters
    : characters
        .filter((character) => character.level > 0)
        .sort((a, b) => b.level - a.level)
        .slice(0, 42); // top42Chars

  updateLegionClass(selectedChars);
  updateLegionRank(selectedChars);
  updateLegionGrid(selectedChars);

  const legionLevel = getLegionLevel(selectedChars);
  const legionCount = getLegionCount(selectedChars);

  document.getElementById("legionlevel").textContent = legionLevel;
  document.getElementById("legioncount").textContent = legionCount;

  updateDisplayValues(legionRank, "rank");
  updateDisplayValues(legionClass, "class");
  updateDisplayValues(legionGrid, "grid");
}

function updateDisplayValues(array, type) {
  array.forEach((item) => {
    document.getElementById(item[type]).textContent = item.count;
  });
}

function updateLegionClass(chars) {
  legionClass.forEach((cls) => {
    cls.count = chars.reduce(
      (count, char) =>
        char.level > 0 && char.job === cls.class ? count + 1 : count,
      0
    );
  });
}
function updateLegionRank(chars) {
  legionRank.forEach((rnk) => {
    rnk.count = chars.reduce((count, char) => {
      const isZero = char.name === "Zero";
      const minLevel = isZero ? rnk.zmin : rnk.min;
      const maxLevel = isZero ? rnk.zmax : rnk.max;

      return char.level >= minLevel && char.level <= maxLevel
        ? ((char.rank = rnk.rank), count + 1)
        : count;
    }, 0);
  });
}

// need to rewrite logic
function updateLegionGrid(chars) {
  legionGrid.forEach((grd) => {
    grd.count = chars.reduce((count, char) => {
      const isRankMatch = grd.baseRank === char.rank;
      const isRankSSS = char.rank === "SSS";
      const isJobMatch = grd.jobSpecific.includes(char.job);
      const isXenon = char.name === "Xenon";
      const isNameMatch = grd.nameSpecific === char.name;

      if (isRankMatch) {
        if (
          isRankSSS &&
          ((isXenon && isNameMatch) || (!isXenon && isJobMatch))
        ) {
          char.grid = grd.grid;
          return count + 1;
        } else if (!isRankSSS && isJobMatch) {
          char.grid = grd.grid;
          return count + 1;
        }
      }

      return count; // Return the accumulated count
    }, 0);
  });
}

function getLegionLevel(chars) {
  return chars.reduce((sum, char) => sum + char.level, 0);
}

function getLegionCount(chars) {
  return chars.reduce((count, char) => (char.level > 0 ? count + 1 : count), 0);
}
function resetData() {
  localStorage.removeItem("data");
  characters.forEach((char) => (char.level = 0));
  legionRank.forEach((rnk) => (rnk.count = 0));
  legionClass.forEach((cls) => (cls.count = 0));
  legionGrid.forEach((grd) => (grd.count = 0));
  document.getElementById("legionlevel").textContent = 0;
  document.getElementById("legioncount").textContent = 0;
  initializeCharacterInputs();
  initializeLegionRankDisplay();
  initializeLegionClassDisplay();
  initializeLegionGridDisplay();
}
