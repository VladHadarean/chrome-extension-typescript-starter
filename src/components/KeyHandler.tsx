import React, { useState } from "react";

const Component = () => {
  const [apiKey, setApiKey] = useState("");

  const saveKey = () => {
    chrome.storage.local.set({ apiKey }, () => {
      console.log("API Key saved: ", apiKey);
    });
    // Navigate to the options page
  };

  return (
    <div>
      <h1>An ElevenLabs key is required to use the Youtube Dubber</h1>
      <p>
        Your Key:{" "}
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button onClick={saveKey}>Save Key</button>
      </p>
    </div>
  );
};

Component.displayName = "ApiKey";

export default Component;
