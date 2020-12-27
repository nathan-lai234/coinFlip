//Load images for coins
document.getElementById("image_euro2").src = "/icons/euro2.png";
document.getElementById("image_pesetas").src = "/icons/pesetas.png";

//Default colour values
const defaultHeadsColor = "0000ff";
const defaultTailsColor = "ff0000";
const defaultBorderColor = "#b4b4b4";

//Style helpers

function addStyleErrorInput(inputElement) {
  inputElement.style.borderColor = "red";
}

function removeStyleErrorInput(inputElement) {
  inputElement.style.borderColor = defaultBorderColor;
}

function addInputColorStyleError(coinSide) {
  addStyleErrorInput(document.getElementById(coinSide + "_color"));
  document.getElementById(coinSide + "_input_error").innerText =
    "Hexcode is invalid. (e.g. #0000FF)";
  addStyleErrorInput(document.getElementById(coinSide + "_color_display"));
}

function removeInputColorStyleErrors(coinSide) {
  removeStyleErrorInput(document.getElementById(coinSide + "_color"));
  document.getElementById(coinSide + "_input_error").innerText = "";
  removeStyleErrorInput(document.getElementById(coinSide + "_color_display"));
}

function removeAllStyleErrors() {
  removeInputColorStyleErrors("heads");
  removeInputColorStyleErrors("tails");
}

//Return true or false if the form that is submitted is valid or not
function validForm() {
  let valid = true;

  if (!validHexCode(document.getElementById("heads_color").value)) {
    addInputColorStyleError("heads");
    valid = false;
  }
  if (!validHexCode(document.getElementById("tails_color").value)) {
    addInputColorStyleError("tails");
    valid = false;
  }

  return valid;
}

//Return true or false if hexcode given is a valid hexcode
function validHexCode(hexCode) {
  const hexRegex = /^[0-9a-fA-F]{6}$/;
  return hexRegex.test(hexCode);
}

//Return a string with a hashtag attach to the head
function getHexcode(value) {
  return "#" + value;
}

//Automatically change the colour on the right of the input box to
//Preview the colour chosen
function changeHeadsColorIndicator(e) {
  removeInputColorStyleErrors("heads");
  if (validHexCode(e.target.value)) {
    document.getElementById(
      "heads_color_display"
    ).style.backgroundColor = getHexcode(e.target.value);
  }
}

function changeTailsColorIndicator(e) {
  removeInputColorStyleErrors("tails");
  if (validHexCode(e.target.value)) {
    document.getElementById(
      "tails_color_display"
    ).style.backgroundColor = getHexcode(e.target.value);
  }
}

function hideCointypeOptions() {
  const coin = document.getElementById("coinface_coin");
  const coinRow = document.getElementById("form_cointype");
  const headsColor = document.getElementById("form_heads_color");
  const tailsColor = document.getElementById("form_tails_color");
  if (coin.checked) {
    coinRow.style.display = "block";
    headsColor.style.display = "none";
    tailsColor.style.display = "none";
  } else {
    coinRow.style.display = "none";
    headsColor.style.display = "block";
    tailsColor.style.display = "block";
  }
}

//On submit click
function saveOptions(e) {
  e.preventDefault();

  //Reset ui
  removeAllStyleErrors();
  if (!validForm()) return;

  let cointype = document.getElementsByName("cointype");
  let cointypeId;
  let cointypeValue;
  for (var i = 0; i < cointype.length; i++) {
    if (cointype[i].checked) {
      cointypeValue = cointype[i].value;
      cointypeId = cointype[i].id;
      break;
    }
  }

  let newHeadsColor = getHexcode(document.getElementById("heads_color").value);
  let newTailsColor = getHexcode(document.getElementById("tails_color").value);

  browser.storage.sync.set({
    coinfaceCoin: document.getElementById("coinface_coin").checked,
    coinfaceColor: document.getElementById("coinface_color").checked,
    tailsColor: newTailsColor,
    headsColor: newHeadsColor,
    cointypeValue: cointypeValue,
    cointypeId: cointypeId,
  });
}

//On first load
function restoreOptions() {
  function setCoinStyle(result) {
    document.getElementById("coinface_coin").checked =
      result.coinfaceCoin || true;
    document.getElementById("coinface_color").checked =
      result.coinfaceColor || false;
    hideCointypeOptions();
  }

  function setCointype(result) {
    if (result.cointypeId === null) {
      document.getElementById("cointype_euro2").checked = true;
    } else {
      document.getElementById(result.cointypeId).checked = true;
    }
  }

  function setHeadColor(result) {
    document.getElementById("heads_color").value =
      result.headsColor.substring(1) || defaultHeadsColor;
    document.getElementById("heads_color_display").style.backgroundColor =
      result.headsColor;
    document.getElementById("tails_color").value =
      result.tailsColor.substring(1) || defaultTailsColor;
    document.getElementById("tails_color_display").style.backgroundColor =
      result.tailsColor;
  }

  function onError(error) {
    console.log(`Error ${error}`);
  }

  const coinfaceRadio = browser.storage.sync.get([
    "coinfaceCoin",
    "coinfaceColor",
  ]);
  coinfaceRadio.then(setCoinStyle, onError);

  const cointype = browser.storage.sync.get("cointypeId");
  cointype.then(setCointype, onError);

  const colorSettings = browser.storage.sync.get(["headsColor", "tailsColor"]);
  colorSettings.then(setHeadColor, onError);
}

document
  .getElementById("heads_color")
  .addEventListener("input", changeHeadsColorIndicator);
document
  .getElementById("tails_color")
  .addEventListener("input", changeTailsColorIndicator);

document
  .getElementById("coinface_coin")
  .addEventListener("click", hideCointypeOptions);
document
  .getElementById("coinface_color")
  .addEventListener("click", hideCointypeOptions);

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
