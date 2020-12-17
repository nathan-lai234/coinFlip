(function () {
  let optionIndex = 0;
  let coordinates = { coords: [] };

  if (!window.hasRun) {
    createOverlay();

  }

  window.hasRun = true;




  /**
   * Overlay
   */
  function createOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "coinFlipOverlay";
    overlay.style.zIndex = 2000;
    overlay.style.position = "absolute";
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "none";
    document.body.appendChild(overlay);
  }

  function getOverlay() {
    return document.getElementById("coinFlipOverlay");
  }

  function showOverlay() {
    getOverlay().style.display = "block";
  }

  function hideOverlay() {
    getOverlay().style.display = "none";
  }

  function resetValues() {
    optionIndex = 0;
    coordinates = { coords: [] };
  }

  function createClickZone(posX, posY) {
    const clickZone = document.createElement("div");
    clickZone.className = "clickZone";
    clickZone.style.position = "absolute";
    clickZone.style.left = posX - 5 + "px";
    clickZone.style.top = posY - 5 + "px";
    clickZone.style.width = "10px";
    clickZone.style.height = "10px";
    clickZone.style.borderRadius = "5px";
    clickZone.style.backgroundColor = "white";
    getOverlay().appendChild(clickZone);

    const clickZoneText = document.createElement("p");
    clickZoneText.className = "clickZoneText";
    clickZoneText.innerHTML = "!";
    clickZone.appendChild(clickZoneText);
  }

  /**
   * Returns two sets of coordinates to the extension
   */
  let trackCoordinates = (e) => {
    coordinates.coords[optionIndex] = {
      posX: e.pageX,
      posY: e.pageY,
      optionIndex: optionIndex,
    };
    createClickZone(e.pageX, e.pageY);
    optionIndex++;

    if (optionIndex > 1) {
      document.removeEventListener("click", trackCoordinates);
      hideOverlay();
      return;
    }
  };

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "flip") {
      document.elementFromPoint(message.posX, message.posY).click();
    } else if (message.command === "select") {
      resetValues();
      showOverlay();
      getOverlay().addEventListener("click", trackCoordinates);
    } else if (message.command == "getCoordinates") {
      sendResponse(coordinates);
    } else {
      console.error(`Unrecognised message: ${message}`);
    }
  });
})();
