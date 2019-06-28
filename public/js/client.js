"use strict"

var audioSource = document.querySelector("select#audioSource");
var audioOutput = document.querySelector("select#audioOutput");
var videoSource = document.querySelector("select#videoSource");
var filterSelect = document.querySelector("select#filter");

var videoPlay = document.querySelector("video#player");

function gotMediaStream(stream) {
  videoPlay.srcObject = stream;
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  deviceInfos.forEach(function(deviceInfo) {
    var option = document.createElement("option");
    option.text = deviceInfo.label;
    option.value = deviceInfo.deviceId;

    console.log("label:", option.text, "value:", option.value);
    if (deviceInfo.kind === "audioinput") {
      audioSource.appendChild(option);
    } else if (deviceInfo.kind === "audiooutput") {
      audioOutput.appendChild(option);
    } else if (deviceInfo.kind === "videoinput") {
      videoSource.appendChild(option);
    }
  });
}

function handleError(err) {
  console.log("getUserMedia error:", err);
}

var counter = 0;

function start() {
  if (!navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia) {
    console.log("enumerateDevices not supported");
  } else {
    var deviceId = videoSource.value;
    // alert("deviceId: " + deviceId);
    var constraints = {
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        // facingMode: "enviroment",
        deviceId: {exact: deviceId ? deviceId : undefined}
        // deviceId: {exact: counter % 2 == 0 ? "EE51504AB027730094371EB63B00BBBB2D4F51F1" : "C6926C4CA2C2BE41665D3080147F43D8E8124720"}
      },
      audio: {
        noiseSuppression: true,
        echoCancellation: true
      }
    };
    // alert("counter: " + counter);
    // alert("constraints: " + JSON.stringify(constraints));
    counter += 1;

    navigator.mediaDevices.getUserMedia(constraints)
      .then(gotMediaStream)
      .then(gotDevices)
      .catch(handleError);
  }
}

start();
videoSource.onchange = start;

filterSelect.onchange = function() {
  videoPlay.className = filterSelect.value;
}
