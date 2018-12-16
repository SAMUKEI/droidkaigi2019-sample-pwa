# droidkaigi-2019-base

## ディレクトリ・ファイル説明

```
　├ public
　│　├ assets/javascript　  # /script/のcompileされたJS
　│　├ assets/css           # /scss/のcompileされたcss
　│　├ index.html           
　│　├ service_worker.js    # Service Workerの定義ファイル(
　│　└ manifest.json        # ウェブアプリ マニフェスト(そのアプリ名、起動時の URL、アイコンなど)
　├ script                  # javascript置き場(compileされて public/assets/javascript に展開されます)
　└ scss              　　　# scssファイル置き場(compileされて public/assets/css に展開されます)
```

## Requirement

* npm
* yarn

## Installation

```sh
$ brew install node
$ npm i -g yarn
$ yarn install
```

また、アップロード先のFirebaseの設定は変更してください。

```javascript
// script/remote_storage.js

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
firebase.initializeApp(config);
```

## Development

```sh
$ npm run watch
```
* watchを一回実行すると、変更が http://localhost:3000 に即時適用される

## 参考

* [PWAアプリを3つのアプリストアにリリースして学んだこと](https://qiita.com/rana_kualu/items/845a4e062b73df1d2762)
* [Progressive Web App を作ってみた](http://hentaro.hatenablog.com/entry/2017/10/15/191519)
* [Progressive Web Appで実現する動画アプリの最新テクニック](https://html5experts.jp/ryoyakawai/23440/)
* [VideoタグとWebカメラの映像と音声を一つのVideoタグに合成してダウンロード](http://design-lab.tuqulore.com/videoandwebcam_mixedvideo/)
* [ServiceWorkerのBackground Syncでオンライン復帰時にデータ送信](https://qiita.com/horo/items/28bc624b8a26ffa09621)
* [IndexedDBの使い方](https://qiita.com/butakoma/items/2c1c956b63fcf956a137)

