import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FileController from '../controllers/FileController';
import { FileEnumerator } from 'eslint/use-at-your-own-risk';

export default function apps(app) {
  app.use('/status', AppController.getStatus);
  app.use('/stats', AppController.getStats);
  app.use('/users/me', UsersController.getMe);
  app.use('/users', UsersController.postNew);
  app.use('/connect', AuthController.getConnect);
  app.use('/disconnect', AuthController.getDisconnect);

  // Files
  app.use('/files', FileController.postUpload);
  app.use('/files/:id', FileController.getShow);
  app.use('files', FileController.getIndex);
}
