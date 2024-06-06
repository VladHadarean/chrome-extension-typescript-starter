function syncAudioWithVideo(
  videoElement: HTMLVideoElement,
  audioElement: HTMLAudioElement
) {
  videoElement.addEventListener("play", () => audioElement.play());
  videoElement.addEventListener("pause", () => audioElement.pause());
  videoElement.addEventListener("seeking", () => {
    audioElement.currentTime = videoElement.currentTime;
  });
}

// Add listener for changes to setting the audioURL
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.audioURL && namespace === "local") {
    console.log("audioURL set to", changes.myKey.newValue);
    const audioURL = changes.audioURL.newValue;
    if (audioURL) {
      const videoElement = document.querySelector("video");
      if (videoElement) {
        const audioElement = new Audio(audioURL);
        audioElement.crossOrigin = "anonymous";

        syncAudioWithVideo(videoElement, audioElement);
        audioElement.load();
      }
    }
  }
});
