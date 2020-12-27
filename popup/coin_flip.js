//Load static icons
document.getElementById("setting_icon").src = "/icons/settings.svg";

//Enum for coin side
const Coin = Object.freeze({ heads: 0, tails: 1 });

//How long the animation time is default is 3 seconds
let animationTime = 3000;

//Default coin colours
let headsColor = "#0000ff";
let tailsColor = "#ff0000";

/*
  ++++++++++    Load coin setting     ++++++++++
*/

//Display either the colour or an actual coin as a display for the coin flip
function setCoinStyle(result) {
  if (result.coinfaceCoin) {
    //If coin selected
    document.getElementsByClassName("heads_wrapper")[0].style.visibility =
      "hidden";
    document.getElementsByClassName("tails_wrapper")[0].style.visibility =
      "hidden";
    document.getElementById("heads_image").style.visibility = "visible";
    document.getElementById("tails_image").style.visibility = "visible";
  } else {
    //If color selected
    document.getElementsByClassName("heads_wrapper")[0].style.visibility =
      "visible";
    document.getElementsByClassName("tails_wrapper")[0].style.visibility =
      "visible";
    document.getElementById("heads_image").style.visibility = "hidden";
    document.getElementById("tails_image").style.visibility = "hidden";
  }
}

//Set which coin is displayed in the image
function setCoinType(result) {
  if (result.cointypeValue === null) {
    document.getElementById("heads_image").src = "/icons/euro2_heads.png";
    document.getElementById("tails_image").src = "/icons/euro2_tails.png";
  } else {
    document.getElementById("heads_image").src =
      "/icons/" + result.cointypeValue + "_heads.png";
    document.getElementById("tails_image").src =
      "/icons/" + result.cointypeValue + "_tails.png";
  }
}

//Set the color of the coin
function setCoinColor(result) {
  headsColor = result.headsColor;
  tailsColor = result.tailsColor;

  let headsWrapper = document.getElementsByClassName("heads_wrapper");
  headsWrapper[0].style.backgroundColor = headsColor;
  let tailsWrapper = document.getElementsByClassName("tails_wrapper");
  tailsWrapper[0].style.backgroundColor = tailsColor;
}

function onError(error) {
  console.log(`Error ${error}`);
}

//Get settings from storage set in the options page
let coinfaceRadio = browser.storage.sync.get("coinfaceCoin");
coinfaceRadio.then(setCoinStyle, onError);

let coinType = browser.storage.sync.get("cointypeValue");
coinType.then(setCoinType, onError);

let coinColor = browser.storage.sync.get(["headsColor", "tailsColor"]);
coinColor.then(setCoinColor, onError);

/**
 * List for a click on the buttons on the popup,
 * send a message to the content script on the page
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    /**
     * Flip a coin (50/50) almost
     * then send the value to the content script
     * 0 = heads
     * 1 = tails
     */
    function flipCoin() {
      const coinSide = Math.floor(Math.random() * 2);

      // Give class to coin div to start animation (with a 0.1 second delay)
      document.getElementById("coin_result").innerHTML = "---";
      const coin = document.getElementById("coin");
      coin.classList.remove("heads_wrapper");
      coin.classList.remove("tails_wrapper");
      setTimeout(function () {
        if (coinSide === Coin.heads) {
          coin.classList.add("heads_wrapper");
        } else {
          coin.classList.add("tails_wrapper");
        }
      }, 100);

      // Display text of the outcome after the animation completes
      setTimeout(function () {
        if (coinSide === Coin.heads) {
          document.getElementById("coin_result").innerHTML = "Heads";
        } else {
          document.getElementById("coin_result").innerHTML = "Tails";
        }
      }, animationTime + 300);
    }

    /**
     * Log the error into the console
     */
    function reportError(error) {
      console.error(`Coin Flip error: ${error}`);
    }

    /**
     * Get the current active tab
     * and call the appropriate button
     */

    //Flip the coin
    if (e.target.classList.contains("coin_flip")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(flipCoin)
        .catch(reportError);
    } else if (e.target.id === "setting_icon") {
      browser.runtime.openOptionsPage();
    }
  });
}

listenForClicks();
