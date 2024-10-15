import express from 'express';
import apps from './routes/index';

const app = express();

app.use(express.json());

apps(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server is running ...');
});
