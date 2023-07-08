function sumFields() {
  const legionClass = {
    Bowman: 0,
    Magician: 0,
    Pirate: 0,
    Thief: 0,
    Warrior: 0,
  };
  const rankRanges = {
    rankB: { min: 60, max: 99, zeroMin: 130, zeroMax: 159 },
    rankA: { min: 100, max: 139, zeroMin: 160, zeroMax: 179 },
    rankS: { min: 140, max: 199, zeroMin: 180, zeroMax: 199 },
    rankSS: { min: 200, max: 249 },
    rankSSS: { min: 250, max: 300 },
  };

  const countRanks = {
    B: 0,
    A: 0,
    S: 0,
    SS: 0,
    SSS: 0,
  };

  const legionLevels = {
    lvl_60: 0,
    lvl_100: 0,
    lvl_140_WP: 0,
    lvl_140_MTA: 0,
    lvl_200_Warrior: 0,
    lvl_200_Bowman: 0,
    lvl_200_Thief: 0,
    lvl_200_Magician: 0,
    lvl_200_Pirate: 0,
    lvl_250_Warrior: 0,
    lvl_250_Bowman: 0,
    lvl_250_Thief: 0,
    lvl_250_Magician: 0,
    lvl_250_Pirate: 0,
    lvl_250_Xenon: 0,
  };

  const inputs = document.querySelectorAll('input[type="number"]');
  const sortedInputs = Array.from(inputs)
    .filter((input) => input.value.trim() !== "") // Ignore inputs with blank values
    .sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
  const top42Inputs = sortedInputs.slice(0, 42);

  let charCount = 0;
  let totalSum = 0;

  top42Inputs.forEach((input) => {
    const level = parseInt(input.value);
    const classType = input.className.split(" ")[1];

    //Legion Level & Character Count
    if (!isNaN(level)) {
      localStorage.setItem(input.name, level);
      if (input.name === "Zero" && level >= 130) {
        totalSum += level;
        charCount++;
      } else if (input.name !== "Zero" && level >= 60) {
        totalSum += level;
        charCount++;
      }

      //Legion Rank & Legion Block
      //Rank SSS
      if (level >= rankRanges.rankSSS.min) {
        countRanks.SSS++;
        if (input.name === "Xenon") {
          legionLevels[`lvl_250_${input.name}`]++;
        } else {
          legionLevels[`lvl_250_${classType}`]++;
        }
        //Rank SS
      } else if (
        level >= rankRanges.rankSS.min &&
        level <= rankRanges.rankSS.max
      ) {
        countRanks.SS++;
        legionLevels[`lvl_200_${classType}`]++;
        //Rank S
      } else if (
        input.name === "Zero" &&
        level >= rankRanges.rankS.zeroMin &&
        level <= rankRanges.rankS.zeroMax
      ) {
        countRanks.S++;
        legionLevels[`lvl_140_WP`]++;
      } else if (
        input.name !== "Zero" &&
        level >= rankRanges.rankS.min &&
        level <= rankRanges.rankS.max
      ) {
        countRanks.S++;
        if (classType === "Warrior" || classType === "Pirate") {
          legionLevels[`lvl_140_WP`]++;
        } else if (
          classType === "Magician" ||
          classType === "Thief" ||
          classType === "Bowman"
        ) {
          legionLevels[`lvl_140_MTA`]++;
        }
        //Rank A
      } else if (
        input.name === "Zero" &&
        level >= rankRanges.rankA.zeroMin &&
        level <= rankRanges.rankA.zeroMax
      ) {
        legionLevels.lvl_100++;
        countRanks.A++;
      } else if (
        input.name !== "Zero" &&
        level >= rankRanges.rankA.min &&
        level <= rankRanges.rankA.max
      ) {
        legionLevels.lvl_100++;
        countRanks.A++;
      } else if (
        input.name === "Zero" &&
        level >= rankRanges.rankB.zeroMin &&
        level <= rankRanges.rankB.zeroMax
      ) {
        legionLevels.lvl_60++;
        countRanks.B++;
      } else if (
        input.name !== "Zero" &&
        level >= rankRanges.rankB.min &&
        level <= rankRanges.rankB.max
      ) {
        legionLevels.lvl_60++;
        countRanks.B++;
      }
    } else {
      localStorage.setItem(input.name, "");
    }
  });

  // Display the sum in the result paragraph
  document.getElementById("totalLevel").textContent = totalSum;
  document.getElementById("charCount").textContent = charCount;
  Object.keys(countRanks).forEach((rank) => {
    document.getElementById(`rank${rank}`).textContent = countRanks[rank];
  });
  Object.keys(legionLevels).forEach((legion) => {
    document.getElementById(`${legion}`).textContent = legionLevels[legion];
  });
}
// Restore input field values from local storage
window.onload = function () {
  let inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => {
    let storedValue = localStorage.getItem(input.name);
    if (storedValue) {
      input.value = storedValue;
    }
  });
};
