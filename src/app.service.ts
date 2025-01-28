import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly httpService: HttpService
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getWeatherData(city: string) {
    const API_KEY = process.env.API_KEY;
    const cacheValue = await this.cacheManager.get(city);
    if (cacheValue) return cacheValue;
    else {
      const response = await firstValueFrom(
        this.httpService.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`)
      );
      await this.cacheManager.set(city, response.data, 60000);
      return response.data;
    }
  }
}
