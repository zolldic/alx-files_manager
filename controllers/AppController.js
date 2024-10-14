import DBClient from '../utils/db.js';
import RedisClient from '../utils/redis.js';

export function getStatus(req, res) {
  const status = {
    redis: RedisClient.isAlive(),
    db: DBClient.isAlive()
  };
  res.json(status);
}

export function getStats(req, res) {
  const status = {
    users: DBClient.nbUsers(),
    files: DBClient.nbFiles()
  }
  res.json(status);
}
