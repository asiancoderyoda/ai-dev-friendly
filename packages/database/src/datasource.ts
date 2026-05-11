import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { DatabaseConfig } from '@letscode-dev-friendly/shared';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DatabaseConfig.url,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [path.join(__dirname, '..', 'entities', '*.{ts,js}')],
});