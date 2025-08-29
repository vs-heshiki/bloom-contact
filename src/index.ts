import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import sequelize from './infra/database';
import './infra/structs/contacts.table';
import './infra/structs/phones.table';

const port = Number(process.env.PORT || 7545);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => console.log(`API on http://localhost:${port}`));
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1);
  }
})();
