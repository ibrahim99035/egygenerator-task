import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) reports health', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect((res) => {
        const body = res.body as {
          status?: string;
          service?: string;
          database?: unknown;
        };

        // 200 while healthy/connecting, 503 when the database is unreachable
        expect([200, 503]).toContain(res.status);
        expect(body.service).toBe('egygenerator-api');
        expect(body.database).toBeDefined();
        expect(body.status).toBeDefined();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
