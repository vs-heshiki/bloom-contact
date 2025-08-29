import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = Number(process.env.PORT || 7545);

(async () => {
  try {
    app.listen(port, () => console.log(`API on http://localhost:${port}`));
  } catch (err) {
    process.exit(1);
  }
})();
