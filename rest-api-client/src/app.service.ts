import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getDataFromExternalApi(): Promise<any> {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data; // Return the data from the response
  }

  async postDataToExternalApi(): Promise<any> {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const payload = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };
    const response = await firstValueFrom(this.httpService.post(url, payload));
    return response.data;
  }
}
