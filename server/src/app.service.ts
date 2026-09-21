import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

const CONNECTION_STATES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export interface HealthStatus {
  status: 'ok' | 'starting' | 'degraded';
  service: string;
  environment: string;
  uptime: number;
  timestamp: string;
  database: {
    status: string;
    name: string | null;
  };
  config: {
    mongoUriConfigured: boolean;
    jwtSecretConfigured: boolean;
    frontendUrl: string | null;
  };
}

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHealth(): HealthStatus {
    const database = this.getDatabaseStatus();

    let status: HealthStatus['status'] = 'degraded';
    if (database.status === 'connected') {
      status = 'ok';
    } else if (database.status === 'connecting') {
      status = 'starting';
    }

    return {
      status,
      service: 'egygenerator-api',
      environment: process.env.NODE_ENV ?? 'development',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      database,
      config: {
        mongoUriConfigured: Boolean(process.env.MONGODB_URI),
        jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
        frontendUrl: process.env.FRONTEND_URL ?? null,
      },
    };
  }

  private getDatabaseStatus(): HealthStatus['database'] {
    const readyState = this.connection?.readyState ?? -1;

    return {
      status: CONNECTION_STATES[readyState] ?? 'unknown',
      name: this.connection?.name ?? null,
    };
  }
}
