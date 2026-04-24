import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AcademicIntegrationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getStudentStatus(externalStudentId: string): Promise<'active' | 'inactive'> {
    if (this.configService.get('USE_MOCK') === 'true') {
      return 'active';
    }
    const url = this.configService.get('ACADEMIC_API_URL');
    const response = await firstValueFrom(
      this.httpService.get(`${url}/students/${externalStudentId}/status`),
    );
    return response.data.status;
  }
}
