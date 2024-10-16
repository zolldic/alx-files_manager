import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AuthController = {
  async getConnect(req, res) {
    const buffer = new Buffer(req.headers.authorization.split(' ')[1], 'base64')
      .toString()
      .split(':');

    if (!buffer) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const [email, password] = buffer;

    const hashed = sha1(password);

    const user = await dbClient.db
      .collection('users')
      .findOne({ email, password: hashed });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /**
     * Use this key for storing in Redis (by using the redisClient
     * create previously) the user ID for 24 hours
     * Return this token: { "token": "155342df-2399-41da-9e8c-458b6ac52a0c" }
     * with a status code 200
     */

    const uid = uuidv4();
    const key = `auth_${uid}`;
    await redisClient.set('userId', key, 86400);
    return res.status(200).json({ token: uid });
  },
  async getDisconnect(req, res) {},
  async getMe(req, res) {},
};

export default AuthController;
