import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'

import { AppModule } from './app.module'
import { ValidationPipe } from './libs/validation'
import { ConsoleLogger } from '@nestjs/common'


(async () => {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.enableShutdownHooks();
  app.useLogger(new ConsoleLogger({
    json: true,
    context: 'identity-provider-service',
  }))

  /**
   * This is to avoid having to import and instantiate ValidationPipe in each rout
   * e.g. @Body(new ValidationPipe(AuthTokenRequestDTO)) request: AuthTokenRequestDTO
   */
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT ?? 3000)
})()
