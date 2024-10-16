import sha1 from 'sha1';
import dbClient from '../utils/db';

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
};

export default UsersController;
