import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'
import { HealthModule } from '../src/health/health.module'

describe('AppController (e2e)', () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/healthz (GET)', () => {
    return request(app.getHttpServer())
      .get('/healthz')
      .expect(HttpStatus.OK)
      .expect((resp) => {
        expect(resp.body).toEqual(
          expect.objectContaining({
            healthy: true,
            uptime: expect.any(Number),
          }),
        )
      })
  })
})
