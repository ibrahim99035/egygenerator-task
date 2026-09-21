import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController (health)', () => {
  const connection = { readyState: 1, name: 'fullstack-auth' };

  const createController = async (readyState: number) => {
    connection.readyState = readyState;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: getConnectionToken(), useValue: connection },
      ],
    }).compile();

    return module.get<AppController>(AppController);
  };

  it('should report ok while the database is connected', async () => {
    const controller = await createController(1);
    const health = controller.getHealth();

    expect(health.status).toBe('ok');
    expect(health.service).toBe('egygenerator-api');
    expect(health.database).toEqual({
      status: 'connected',
      name: 'fullstack-auth',
    });
    expect(typeof health.uptime).toBe('number');
    expect(health.timestamp).toBeDefined();
  });

  it('should report starting while the database is connecting', async () => {
    const controller = await createController(2);

    expect(controller.getHealth().status).toBe('starting');
  });

  it('should fail with 503 when the database is unreachable', async () => {
    const controller = await createController(0);

    expect(() => controller.getHealth()).toThrow(ServiceUnavailableException);

    const exception = (() => {
      try {
        controller.getHealth();
      } catch (error) {
        return error as ServiceUnavailableException;
      }
      return null;
    })();

    const payload = exception?.getResponse() as {
      status: string;
      database: { status: string };
    };
    expect(payload.status).toBe('degraded');
    expect(payload.database.status).toBe('disconnected');
  });

  it('should report configuration flags', async () => {
    const controller = await createController(1);
    const { config } = controller.getHealth();

    expect(typeof config.mongoUriConfigured).toBe('boolean');
    expect(typeof config.jwtSecretConfigured).toBe('boolean');
    expect(
      config.frontendUrl === null || typeof config.frontendUrl === 'string',
    ).toBe(true);
  });
});
