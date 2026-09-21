import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService, type HealthStatus } from './app.service';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description:
      'Liveness/readiness probe at the API root. Reports process uptime and the ' +
      'MongoDB connection state, plus which environment variables are configured. ' +
      'Returns 200 while the service is healthy (or still connecting) and 503 when ' +
      'the database is unreachable.',
  })
  @ApiOkResponse({
    type: HealthResponseDto,
    description: 'Service is up (database connected or connecting).',
  })
  @ApiServiceUnavailableResponse({
    type: HealthResponseDto,
    description: 'Service is up but the database is unreachable.',
  })
  getHealth(): HealthStatus {
    const health = this.appService.getHealth();

    // Report an unhealthy dependency with a non-2xx status so uptime monitors
    // and load balancers can act on it, while still returning the details.
    if (health.status === 'degraded') {
      throw new ServiceUnavailableException(health);
    }

    return health;
  }
}
