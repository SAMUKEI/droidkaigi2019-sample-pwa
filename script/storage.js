class IndexedDB {
  constructor() {
  }

  static open() {
    // データベースのOpen
    const indexDatabase = indexedDB.open("droidkaigi2019", 1);
    // DBの新規作成、バージョンアップ時の処理
    indexDatabase.onupgradeneeded = function (e) {
      const db = e.target.result;
      // オブジェクトストアを追加(RDBのテーブル)
      db.createObjectStore("blob", {keyPath: "id"});
    };
    return indexDatabase
  }

  // indexed databaseに書き込み
  static save(id, blob) {
    return new Promise(function (resolve, reject) {
      const indexDatabase = IndexedDB.open();
      indexDatabase.onerror = function (e) {
        reject();
      };
      indexDatabase.onsuccess = function (e) {
        const db = e.target.result;
        const transaction = db.transaction(["blob"], "readwrite"); // read write属性でblobテーブルのトランザクション取得
        const objectStore = transaction.objectStore("blob");
        objectStore.put({id: id, blob: blob});
        resolve(null);
      };
    });
  }

  // indexed databaseから読み込み
  static read(id) {
    return new Promise(function (resolve, reject) {
      const indexDatabase = IndexedDB.open();
      indexDatabase.onerror = function (e) {
        reject();
      };
      indexDatabase.onsuccess = function (e) {
        const db = e.target.result;
        const transaction = db.transaction(["blob"], "readwrite"); // read write属性でblobテーブルのトランザクション取得
        const objectStore = transaction.objectStore("blob");
        const keyRange = IDBKeyRange.only(id);
        objectStore.openCursor(keyRange).onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            resolve(cursor.value.blob); // blobフィールドを取得
          } else {
            resolve(null);
          }
        };
      };
    });
  }
}

module.exports = IndexedDB;
