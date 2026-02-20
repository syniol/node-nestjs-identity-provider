import cluster from 'node:cluster'
import { cpus } from 'node:os'

import { NestFactory } from '@nestjs/core'
import { ConsoleLogger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'

import { AppModule } from './app.module'
import { ValidationPipe } from './libs/validation'
import { isProductionEnv } from './libs/env'

const logger = new ConsoleLogger({
  json: true,
  context: 'identity-provider-service',
})

if (cluster.isPrimary) {
  const availableCpus = cpus()
  logger.log(
    `Clustering is available to: ${availableCpus.length} Processing Unit.`,
  )

  for (let i = 1; i < availableCpus.length; i++) {
    cluster.fork()
    logger.log(`Cluster ${i} is forked`)
  }

  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      logger.log(`Worker with process ID: "${worker.process.pid}" has crashed.`)

      logger.log('Starting a new worker')
      cluster.fork()
    }
  })
}

if (cluster.isWorker) {
  ;(async () => {
    const app = await NestFactory.create(AppModule)
    app.enableShutdownHooks()
    app.useLogger(
      new ConsoleLogger({
        json: true,
        context: 'identity-provider-service',
      }),
    )
    app.enableCors({
      origin: isProductionEnv() ? process.env.PROXY_URL : '*',
    })

    if (isProductionEnv()) {
      app.use(helmet())
      app.getHttpAdapter().getInstance().set('trust proxy', true)
    }

    /**
     * This is to avoid having to import and instantiate ValidationPipe in each rout
     * e.g. @Body(new ValidationPipe(AuthTokenRequestDTO)) request: AuthTokenRequestDTO
     */
    app.useGlobalPipes(new ValidationPipe())

    if (!isProductionEnv()) {
      const config = new DocumentBuilder()
        .setTitle('Node Identity Provider API')
        .setVersion('1.0')
        .addTag('nodejs')
        .addTag('oauth2.1')
        .addTag('password_grant')
        .build()
      const documentFactory = () => SwaggerModule.createDocument(app, config)
      SwaggerModule.setup('api', app, documentFactory)
    }

    await app.listen(process.env.PORT ?? 3000, () => {
      logger.log(`Started Server at processing unit: ${process.pid}.`)
    })
  })()
}
