import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const UsersController = {
  async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const users = await dbClient.db.collection('users');

    const exists = await users.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const inserRes = await users.insertOne({
      email: req.body.email,
      password: sha1(req.body.password),
    });

    return res.status(201).json({
      id: inserRes.insertedId.toString(),
      email,
    });
  },

  async getMe(req, res) {
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

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ id: user._id, email: user.email });
  },
};

export default UsersController;
