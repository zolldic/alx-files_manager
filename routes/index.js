import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

export default function apps(app) {
  app.use('/status', AppController.getStatus);
  app.use('/stats', AppController.getStats);
  app.use('/users', UsersController.postNew);
  app.use('/connect', AuthController.getConnect);
  /* app.use('/disconnect', AuthController.getDisconnect);
  app.use('/users/me', UserController.getMe);
  */
}
