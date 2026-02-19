import { Test, TestingModule } from '@nestjs/testing'
import { HealthController } from './health.controller'

describe('AppController', () => {
  let appController: HealthController

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile()

    appController = app.get<HealthController, HealthController>(
      HealthController,
    )
  })

  describe('Test Health and Readiness endpoint', () => {
    it('should return health true', () => {
      expect(appController.getHealth()).toEqual({
        healthy: true,
      })
    })
  })
})
