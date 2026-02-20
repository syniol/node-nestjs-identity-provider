import { ApiProperty } from '@nestjs/swagger'

export class HealthResponse {
  @ApiProperty({
    description: 'indicates the health of system',
    type: Boolean,
  })
  public healthy: boolean

  @ApiProperty({
    description: 'uptime of the service in hours',
    type: Number,
  })
  public uptime: number
}
