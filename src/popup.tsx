import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import KeyHandler from "./components/KeyHandler";
import Main from "./components/Main";

const App = () => {
  const [apiKey, setApiKey] = useState(undefined);
  const [isLoading, setLoading] = useState(true);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.storage.sync.get(["apiKey"], (result) => {
      console.log("API Key: ", result.apiKey);
      setApiKey(result.apiKey);
      setLoading(false);
    });
  }, []);

  //Check the key
  // useEffect(() => {
  //   if (apiKey) {
  //     console.log("API Key is valid");
  //   }
  // }, [apiKey]);

  // Wait to load the API key from storage
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!apiKey) {
    return <KeyHandler />;
  }

  return <Main />;
};

// Render the App entry point
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
