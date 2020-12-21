//Load static icons
document.getElementById("setting_icon").src = "/icons/settings.svg";

//Enum for coin side
const Coin = Object.freeze({ heads: 0, tails: 1 });

//How long the animation time is default is 3 seconds
let animationTime = 3000;

/**
 * Set Coin Style
 */

//Default coin colours
let headsColor = "#0000ff";
let tailsColor = "#ff0000";

function setCoinColor(result) {
  headsColor = result.headsColor;
  tailsColor = result.tailsColor;
  document.getElementById("coin_result").innerHTML = result.headsColor;

  let headsWrapper = document.getElementsByClassName("heads_wrapper");
  headsWrapper[0].style.backgroundColor = headsColor;
  let tailsWrapper = document.getElementsByClassName("tails_wrapper");
  tailsWrapper[0].style.backgroundColor = tailsColor;
}

function onError(error) {
  console.log(`Error ${error}`);
}

let heads_color = browser.storage.sync.get(["headsColor", "tailsColor"]);
heads_color.then(setCoinColor, onError);

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
      const coin = document.getElementById("coin");
      coin.classList.remove("heads_wrapper");
      coin.classList.remove("tails_wrapper");
      setTimeout(function () {
        if (coinSide === Coin.heads) {
          coin.classList.add("heads_wrapper");
          document.getElementById("debug").innerHTML = "heads";
        } else {
          coin.classList.add("tails_wrapper");
          document.getElementById("debug").innerHTML = "tails";
        }
      }, 100);

      // Display text of the outcome after the animation completes
      setTimeout(function () {
        if (randNum == 0) {
          document.getElementById("coin_result").innerHTML = "Heads";
        } else {
          document.getElementById("coin_result").innerHTML = "Tails";
        }
      }, animationTime + 300);

      return coinSide;
    }

    function flipButton(tabs) {
      randNum = flipCoin();
      // browser.tabs
      //   .sendMessage(tabs[0].id, {
      //     command: "getCoordinates",
      //   })
      //   .then((response) => {
      //     browser.tabs.sendMessage(tabs[0].id, {
      //       command: "flip",
      //       posX: response.coords[randNum].posX,
      //       posY: response.coords[randNum].posY,
      //     });
      //   });
    }

    function selectLocations(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "select",
      });
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
        .then(flipButton)
        .catch(reportError);
    } else if (e.target.classList.contains("select")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(selectLocations)
        .catch(reportError);
    } else if (e.target.id === "setting_icon") {
      browser.runtime.openOptionsPage();
    }
  });
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup_content").classList.add("hidden");
  document.querySelector("#error_content").classList.remove("hidden");
  console.error(`Failed to execute coinFlip content script: ${error.message}`);
}

browser.tabs
  .executeScript({ file: "/content_scripts/click_page.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
