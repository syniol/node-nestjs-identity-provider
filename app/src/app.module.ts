import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'

import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { CryptoModule } from './crypto/crypto.module'
import { InfrastructureModule } from './infrastructure/infrastructure.module'

@Module({
  imports: [
    HealthModule,
    AuthModule,
    UserModule,
    CryptoModule,
    InfrastructureModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      }
    ])
  ],
})
export class AppModule {}
