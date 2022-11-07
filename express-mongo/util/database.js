const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://leejam:xBTFl4iPw0yK9toH@cluster0.yey1wuh.mongodb.net/shop"
  )
    .then((client) => {
      console.log("connect");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database fount!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
