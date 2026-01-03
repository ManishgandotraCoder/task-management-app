import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    // Set test environment variables before creating the module
    // Ensure DATABASE_URL has a password (required by database.config.ts)
    const existingDbUrl = process.env.DATABASE_URL || process.env.TEST_DATABASE_URL;
    
    if (!existingDbUrl) {
      // No DATABASE_URL set, use default test database or individual env vars
      if (!process.env.DB_PASSWORD) {
        // Set individual DB env vars as fallback if DATABASE_URL not provided
        process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
        process.env.DB_HOST = process.env.DB_HOST || 'localhost';
        process.env.DB_PORT = process.env.DB_PORT || '5432';
        process.env.DB_USERNAME = process.env.DB_USERNAME || 'postgres';
        process.env.DB_NAME = process.env.DB_NAME || 'task_management_test';
      }
    } else {
      // Check if password exists in URL
      try {
        const url = new URL(existingDbUrl);
        if (!url.password) {
          // Add default password if missing
          url.password = 'postgres';
          process.env.DATABASE_URL = url.toString();
        } else {
          process.env.DATABASE_URL = existingDbUrl;
        }
      } catch {
        // Invalid URL format, use default or individual env vars
        if (!process.env.DB_PASSWORD) {
          process.env.DB_PASSWORD = 'postgres';
        }
      }
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
