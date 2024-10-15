import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

export default function apps(app) {
  app.use('/status', AppController.getStatus);
  app.use('/stats', AppController.getStats);
  app.use('/users', UsersController.postNew);
}
