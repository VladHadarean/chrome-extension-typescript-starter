import React, { useCallback, useEffect, useState } from "react";

const Component = () => {
  const [active, setActive] = useState(false);
  // State to manage the value of the first dropdown
  const [fromDropdown, setFromDropdown] = useState("");

  // State to manage the value of the second dropdown
  const [toDropDown, setToDropdown] = useState("");

  const [isTranslating, setIsTranslating] = useState(false);
  const [dubbingActive, setDubbingActive] = useState(false);

  const [translationAvailable, setTranslationAvailable] = useState(false);

  // Check if we are on a Youtube page otherwise disable the extension
  useEffect(() => {
    chrome.runtime.sendMessage({ message: "check_webpage" }, (response) => {
      if (response && response.active) {
        console.log("Extension is active on this page.");
      } else {
        console.log("Extension is not active on this page.");
      }
    });
  }, []);

  // Trigger the translation file to be downloaded
  const handleTranslate = useCallback(() => {
    setIsTranslating(true);
    chrome.runtime.sendMessage(
      { message: "translate", from: fromDropdown, to: toDropDown },
      (response) => {
        console.log("Translation response: ", response);
        // setIsTranslating(false);
      }
    );
  }, [fromDropdown, toDropDown]);

  // Tell the background script to toggle dubbing
  const handleDubbingToggle = useCallback(() => {
    chrome.runtime.sendMessage(
      { message: "dubbing", active: !dubbingActive },
      (response) => {
        console.log("Dubbing response: ", response);
        setDubbingActive(!dubbingActive);
      }
    );
  }, []);

  if (isTranslating) {
    return <div>Generating audio translation...</div>;
  }

  if (translationAvailable) {
    return (
      <>
        <div>
          {fromDropdown} to {toDropDown}{" "}
        </div>
        <div>Dubbing is {dubbingActive ? "active" : "inactive"} </div>
        <button onClick={handleDubbingToggle}>
          {dubbingActive ? "Stop" : "Start"} Dubbing
        </button>
      </>
    );
  }

  return (
    <div className="App">
      <h1>Youtube Dub</h1>
      <div>
        <label>
          From:
          <select
            value={fromDropdown}
            onChange={(e) => setFromDropdown(e.target.value)}
          >
            <option value="english">English</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          To:
          <select
            value={toDropDown}
            onChange={(e) => setToDropdown(e.target.value)}
          >
            <option value="romanian">Romanian</option>
          </select>
        </label>
      </div>
      <div>
        <button onClick={handleTranslate}>Translate</button>
      </div>
    </div>
  );
};

Component.displayName = "Main";

export default Component;
