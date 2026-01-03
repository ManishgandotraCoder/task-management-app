import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// Parse DATABASE_URL if provided, otherwise use individual env vars
function parseDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Parse format: postgresql://username:password@host:port/database?schema=schema
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || '5432', 10),
      username: url.username,
      password: url.password || '',
      database: url.pathname.slice(1), // Remove leading '/'
    };
  }

  // Fall back to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'ethan',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_management',
  };
}

const dbConfig = parseDatabaseConfig();

export default new DataSource({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
