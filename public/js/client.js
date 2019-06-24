"use strict"

var videoPlay = document.querySelector("video#player");

function gotMediaStream(stream) {
  videoPlay.srcObject = stream;
}

function handleError(err) {
  console.log("getUserMedia error:", err);
}

if (!navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia) {
  console.log("enumerateDevices not supported");
} else {
  var constraints = {
    video: true,
    audio: true
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotMediaStream)
    .catch(handleError);
}
