import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AuthController = {
  async getConnect(req, res) {
    const base64 = req.headers.authorization.split(' ')[1];
    const buffer = Buffer.from(base64, 'base64').toString('ascii').split(':');

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

    const uid = uuidv4();
    await redisClient.set(`auth_${uid}`, user._id.toString(), 86400);
    return res.status(200).json({ token: uid });
  },

  async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.db.collection('users').findOne({
      _id: ObjectId(userId),
    });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    await redisClient.del(`auth_${token}`);
    return res.status(204);
  },
};

export default AuthController;
