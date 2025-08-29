import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';

let sequelize: Sequelize;

if (env === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else {
  const dialect = (process.env.DB_DIALECT || 'mysql') as any;
  sequelize = new Sequelize(
    process.env.DB_NAME || 'bloomcontact',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'secret',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      dialect,
      logging: false,
      define: {
        timestamps: true,
        paranoid: true,
      },
    }
  );
}

export default sequelize;
