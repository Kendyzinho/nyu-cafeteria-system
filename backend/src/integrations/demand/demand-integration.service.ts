import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DemandIntegrationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getDemandForecast(
    date: string,
    hour?: number,
  ): Promise<{ demand: 'low' | 'medium' | 'high'; capacity: number }> {
    if (this.configService.get('USE_MOCK') === 'true') {
      return { demand: 'medium', capacity: 100 };
    }
    const url = this.configService.get('DEMAND_API_URL');
    const response = await firstValueFrom(
      this.httpService.get(`${url}/demand`, { params: { date, hour } }),
    );
    return response.data;
  }
}
