import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => console.error('Error', err));
    this.asyncget = promisify(this.client.get).bind(this.client);
    this.asyncset = promisify(this.client.set).bind(this.client);
    this.asyncdel = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const value = await this.asyncget(key);
    return value;
  }

  async set(key, value, duration) {
    await this.asyncset(key, value, 'EX', duration);
  }

  async del(key) {
    await this.asyncdel(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
