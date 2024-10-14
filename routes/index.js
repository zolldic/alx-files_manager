import { getStatus, getStats } from '../controller/AppController.js';

export default function apps(app) {
  app.use('/status', getStatus);
  app.use('/stats', getStats);
} 
