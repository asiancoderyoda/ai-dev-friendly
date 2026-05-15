import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { DatabaseConfig } from '@letscode-dev-friendly/shared';
import { Symbol, Workflow } from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DatabaseConfig.url,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [
    Symbol,
    Workflow
  ],
});