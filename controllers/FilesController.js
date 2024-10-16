import { ObjectId } from 'mongodb';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FileController = {
  async postUpload(req, res) {
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
    const allowed = ['folder', 'file', 'image'];
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Missing name' });

    if (!type || !allowed.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId) {
      try {
        const file = await dbClient.db.collection('files').findOne({
          _id: ObjectId(parentId),
        });
        if (!file) {
          return res.status(400).json({
            error: 'Parent not found',
          });
        }
        if (file.type !== 'folder') {
          return res.status(400).json({
            error: 'Parent is not a folder',
          });
        }
      } catch (err) {
        return res.status(400).json({ error: 'Invalid parentId format' });
      }
    }

    if (type === 'folder') {
      const file = await dbClient.db.collection('files').insertOne({
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
      return res.status(201).json({
        id: file.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    }
    const basePath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const localPath = `${basePath}/${uuidv4()}`; // path.join(basePath, uuidv4());
    const buffer = Buffer.from(data, 'base64');
    await fs.mkdir(basePath, { recursive: true });
    await fs.writeFile(localPath, buffer);

    const file = await dbClient.db.collection('files').insertOne({
      userId,
      name,
      type,
      isPublic,
      parentId,
      localPath,
    });

    return res.status(201).json({
      id: file.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  },
  async getShow(req, res) {}
  async getIndex(req, res) {}
};
export default FileController;
