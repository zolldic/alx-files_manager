import { MongoClient } from 'mongodb';
// const MongoClient = require('mongodb').MongoClient;

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'file_manager';

    const url = `mongodb://${host}:${port}/${database}`;
    this._client = new MongoClient(url, { useUnifiedTopology: true });
    this._client.connect();

    this._db = this._client.db();
  }

  // getter
  get host() {
    return this._host;
  }

  // setter
  set host(newHost) {
    this._host = newHost;
  }

  // getter
  get port() {
    return this._port;
  }

  // setter
  set port(newPort) {
    this._port = newPort;
  }

  // getter
  get database() {
    return this._database;
  }

  // setters
  set database(newDatabase) {
    this._database = newDatabase;
  }

  isAlive() {
    this._client.isConnected();
  }

  async nbUsers() {
    // return numbeer of documents in the collection users
    return this._db.collection('users').countDocuments();
  }

  nbFiles() {
    // return the numbers of documents in the collection files
    return this._db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
