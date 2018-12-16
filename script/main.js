const $ = global.jQuery = require("jquery");
global.Popper = require("popper.js");
require("snackbarjs");
require("bootstrap-material-design");

const RemainObservable = require("./remain_observable.js");
const IndexedDB = require("./storage.js");
const RemoteStorage = require("./remote_storage.js");

$(document).ready(function () {
  const music = $('#music').get(0);
  const camera = $('#camera').get(0);

  // マテリアルデザインの適用
  $('body').bootstrapMaterialDesign();

  // 録画できる
  $('#rec_start').show();
  $('#rec_stop').hide();

  // プレビュー非表示
  $("#rec-container").show();
  $("#mixed-container").hide();

  // カメラの許諾(リアカメラ)
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {facingMode: {exact: "environment"}}
  })
    .then(stream => {
      camera.srcObject = stream;
      camera.play(); // 許諾取れたらプレビュー再生
    })
    .catch(err => {
      console.log(err);

      // Macなどのリアカメラがない場合には、フロントカメラを要求する
      // カメラの許諾(フロントカメラ)
      navigator.mediaDevices.getUserMedia({audio: false, video: true})
        .then(stream => {
          camera.srcObject = stream;
          camera.play(); // 許諾取れたらプレビュー再生
        })
    });

  $("#music-file").change((e) => {
    // 音楽ファイルのセット
    music.src = URL.createObjectURL(e.target.files[0]);
    music.onend = function (e) {
      URL.revokeObjectURL(e.target.src);
    };
  });

  let interval = null;
  let recorder = null;

  const remain_onchanged = () => {
    if (observable.remain <= 0) {
      // 録画停止
      recorder.stop();
    } else {
      // 時間調整
      $("#remain_time").text(observable.remain);
    }
  };
  const observable = new RemainObservable(remain_onchanged);
  observable.remain = 15;

  let registration = null;
  navigator.serviceWorker.ready
    .then(e => {
      registration = e;
    });

  // 録画開始
  $('#rec_start').click(() => {
    if (recorder !== null) {
      // 録画再開
      music.play();
      recorder.resume();
    } else {
      const mixedStream = new MediaStream();

      const cameraStream = camera.captureStream();
      mixedStream.addTrack(cameraStream.getVideoTracks()[0]);

      const musicStream = music.captureStream();
      if (musicStream.getAudioTracks().length > 0) {
        mixedStream.addTrack(musicStream.getAudioTracks()[0]);
      }

      const options = {
        mimeType: 'video/webm;codecs=vp9' // mp4が対応していない＼(^o^)／
      };
      recorder = new MediaRecorder(mixedStream, options);
      recorder.start();
      music.play(); // 録画と同時に再生

      recorder.ondataavailable = function (e) {
        // プレビュー表示
        $("#rec-container").hide();
        $("#mixed-container").show();

        const mixed = $("#mixed").get(0);
        mixed.src = URL.createObjectURL(e.data);

        IndexedDB.save(1, e.data) // indexed databaseに保存
          .then(blob => {
            registration.sync.register('sync-upload')
              .then(() => {
                console.log('sync registerd');
              });
          });

        recorder = null;
      };

      recorder.onpause = function (e) {
        // 一旦停止
        clearInterval(interval);

        // 録画できる
        $('#rec_start').show();
        $('#rec_stop').hide();

        // 音も止める
        music.pause();
      };

      recorder.onresume = function (e) {
        // 開始時間設定
        interval = setInterval(function () {
          observable.remain -= 1;
        }, 1000);

        // 録画停止できる
        $('#rec_start').hide();
        $('#rec_stop').show();

      };

      recorder.onstart = function (e) {
        // 開始時間設定
        interval = setInterval(function () {
          observable.remain -= 1;
        }, 1000);

        // 録画停止できる
        $('#rec_start').hide();
        $('#rec_stop').show();

      };

      recorder.onstop = function (e) {
        // 時間リセット
        clearInterval(interval);
        observable.remain = 15;

        // 音楽もリセット
        music.pause();
      };
    }

  });

  // 録画停止
  $('#rec_stop').click(() => {
    recorder.pause();
  });

  navigator.serviceWorker.addEventListener('message', e => {
    Promise.resolve()
      .then(() => {
        const data = e.data;
        console.log(data);

        IndexedDB.read(1)
          .then(blob => {
            const firebase = new RemoteStorage();
            firebase.upload(1, blob, // 最新で上書きする
              function (snapshot) {
                registration.showNotification('アップロード完了');
              }
            );
          });
      })
      .catch(error => {
        console.error(error);
      });
  });

});

