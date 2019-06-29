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

var buffer;
var mediaRecorder;

var recvideo = document.querySelector("video#recplay");
var btnRecord = document.querySelector("button#record");
var btnPlay = document.querySelector("button#recplay");
var btnDownload = document.querySelector("button#download");

var videoPlay = document.querySelector("video#player");
// var audioPlay = document.querySelector("audio#audioplayer");

function gotMediaStream(stream) {
  window.stream = stream;
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

function handleDataAvailable(e) {
  if (e && e.data.datasize > 0) {
    buffer.push(e.data);
  }
}

function startRecord() {
  buffer = [];
  var options = {
    mimeType: "video/webm;codecs=vp8"
  }
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${optoins.mimeType} not supported`);
    return;
  }
  try {
    var mediaRecorder = new MediaRecorder(window.stream, options);
  } catch(e) {
    console.error("failed to create MediaRecorder");
    return;
  }
  MediaRecorder.ondataavailable = handleDataAvailable;
  MediaRecorder.start(10);
}

function stopRecord() {
  mediaRecorder.stop();
}

btnRecord.onclick = () => {
  if (btnRecord.textContent ==== "Start Record") {
    startRecord();
    btnRecord.textContent = "Stop Record";
    btnPlay.disabled = true;
    btnDownload.disabled = true;
  } else {
    stopRecord();
    btnRecord.textContent = "Start Record";
    btnPlay.disabled = false;
    btnDownload.disabled = false;
};


btnPlay.onclick = () => {
  var blob = new Blob(buffer, {type: "video/webm"});
  recvideo.src = window.URL.createObjectURL(blob);
  recvideo.srcObject = null;
  recvideo.controls = true;
  recvideo.play();
}

