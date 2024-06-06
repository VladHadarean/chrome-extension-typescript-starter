chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Trigger a translation
  if (request.type === "DOWNLOAD_AUDIO") {
    const videoURL = request.videoURL;
    const fromLanguage = request.from;
    const toLanguage = request.to;

    chrome.storage.local.get(["apiKey"], async function (result) {
      if (result.apiKey) {
        const apiKey = result.apiKey;
        const audioURL = await fetchAudio(
          apiKey,
          videoURL,
          fromLanguage,
          toLanguage
        );
      }
    });
  }
});

// Gets the audio from the ElevenLabs API
async function fetchAudio(
  apiKey: string,
  videoURL: string,
  fromLanguage: string,
  toLanguage: string
) {
  const form = new FormData();
  form.append("source_url", videoURL);
  form.append("source_lang", fromLanguage);
  form.append("target_lang", toLanguage);

  const options = {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data", "xi-api-key": apiKey },
    body: form,
  };

  const response = await fetch("https://api.elevenlabs.io/v1/dubbing", options);
  const responseData = await response.json();

  if (response.status !== 200) {
    throw new Error(responseData.message);
  }

  // Set the dubbing ID
  const dubbingID = responseData.dubbing_id;
  const expectedDurationSec = responseData.expected_duration_sec;

  chrome.storage.local.set(
    { audioFile: { dubbingID, expectedDurationSec } },
    () => {}
  );
}

// const audioBlob = await response.blob();
// return URL.createObjectURL(audioBlob);

// Send a message
// chrome.runtime.sendMessage();
