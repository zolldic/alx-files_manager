import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
  getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.json(status);
  },
  getStats(req, res) {
    const status = {
      users: dbClient.nbUsers(),
      files: dbClient.nbFiles(),
    };
    res.json(status);
  },
};

export default AppController;
