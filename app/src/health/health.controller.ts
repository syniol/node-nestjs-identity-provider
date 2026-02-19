import { uptime } from 'node:os'

import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { HealthResponse } from './dto/response.dto'

@Controller()
export class HealthController {
  public constructor() {}

  @Get('/healthz')
  @ApiOkResponse({
    type: HealthResponse,
    description: 'provides a status of software and infrastructure',
  })
  public getHealth(): HealthResponse {
    return {
      healthy: true,
      uptime: uptime() / 3600 / 60 / 24,
    }
  }
}
