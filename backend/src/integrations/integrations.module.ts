import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentIntegrationService } from './payment/payment-integration.service';
import { ResidenceIntegrationService } from './residence/residence-integration.service';
import { AcademicIntegrationService } from './academic/academic-integration.service';
import { DemandIntegrationService } from './demand/demand-integration.service';

@Module({
  imports: [HttpModule],
  providers: [
    PaymentIntegrationService,
    ResidenceIntegrationService,
    AcademicIntegrationService,
    DemandIntegrationService,
  ],
  exports: [
    PaymentIntegrationService,
    ResidenceIntegrationService,
    AcademicIntegrationService,
    DemandIntegrationService,
  ],
})
export class IntegrationsModule {}
