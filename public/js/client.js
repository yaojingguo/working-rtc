"use strict"

var audioSource = document.querySelector("select#audioSource");
var audioOutput = document.querySelector("select#audioOutput");
var videoSource = document.querySelector("select#videoSource");
var filterSelect = document.querySelector("select#filter");
var divContraints = document.querySelector("div#constraints");
// var snapshot = document.querySelector("button#snapshot");
// var picture = document.querySelector("canvas#picture");

// picture.width = 640;
// picture.height = 480;

var videoPlay = document.querySelector("video#player");
// var audioPlay = document.querySelector("audio#audioplayer");

function gotMediaStream(stream) {
  videoPlay.srcObject = stream;
  // audioPlay.srcObject = stream;
  var videoTrack = stream.getVideoTracks()[0];
  var videoContraints = videoTrack.getSettings();
  divContraints.textContent = JSON.stringify(videoContraints, null, 2);
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

function start() {
  if (!navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia) {
    console.log("enumerateDevices not supported");
  } else {
    var deviceId = videoSource.value;
    var constraints = {
      video: {
        width: 640,
        height: 480,
        frameRate: 15,
        deviceId: {exact: deviceId ? deviceId : undefined}
      },
      audio: {
        noiseSuppression: true,
        echoCancellation: true
      }
    };
    /*
    var constraints = {
      video: true,
      audio: true
    };
    */

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

/*
snapshot.onclick = function() {
  picture.className = filterSelect.value;
  picture.getContext("2d").drawImage(videoPlay, 0, 0,
      picture.width, picture.height);
}
*/
