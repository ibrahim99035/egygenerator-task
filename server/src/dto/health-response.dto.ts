import { ApiProperty } from '@nestjs/swagger';

export class HealthDatabaseDto {
  @ApiProperty({
    example: 'connected',
    enum: [
      'connected',
      'connecting',
      'disconnected',
      'disconnecting',
      'unknown',
    ],
    description: 'Mongoose connection state',
  })
  status!: string;

  @ApiProperty({
    example: 'fullstack-auth',
    nullable: true,
    description: 'Database name, null when not connected',
  })
  name!: string | null;
}

export class HealthConfigDto {
  @ApiProperty({
    example: true,
    description: 'Whether MONGODB_URI is present in the environment',
  })
  mongoUriConfigured!: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether JWT_SECRET is present in the environment',
  })
  jwtSecretConfigured!: boolean;

  @ApiProperty({
    example: 'https://egygenerator-task.vercel.app',
    nullable: true,
    description: 'Configured CORS origin',
  })
  frontendUrl!: string | null;
}

export class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
    enum: ['ok', 'starting', 'degraded'],
    description:
      'ok = database connected, starting = connecting, degraded = unreachable',
  })
  status!: string;

  @ApiProperty({ example: 'egygenerator-api' })
  service!: string;

  @ApiProperty({ example: 'production' })
  environment!: string;

  @ApiProperty({ example: 42, description: 'Process uptime in seconds' })
  uptime!: number;

  @ApiProperty({ example: '2026-09-21T12:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ type: HealthDatabaseDto })
  database!: HealthDatabaseDto;

  @ApiProperty({ type: HealthConfigDto })
  config!: HealthConfigDto;
}
