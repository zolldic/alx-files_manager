import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

const AppController = {
  getStatus(req, res) {
    const status = {
      redis: RedisClient.isAlive(),
      db: DBClient.isAlive(),
    };
    res.json(status);
  },
  getStats(req, res) {
    const status = {
      users: DBClient.nbUsers(),
      files: DBClient.nbFiles(),
    };
    res.json(status);
  },
};

export default AppController;
