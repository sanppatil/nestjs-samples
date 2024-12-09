import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CosmosClient, Container } from '@azure/cosmos';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CosmosService {
  private container: Container;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('COSMOS_DB_ENDPOINT');
    const key = this.configService.get<string>('COSMOS_DB_KEY');
    const databaseId = this.configService.get<string>('COSMOS_DB_DATABASE');
    const containerId = this.configService.get<string>('COSMOS_DB_CONTAINER');

    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    this.container = database.container(containerId);
  }

  async uploadData(payload: any): Promise<any> {
    try {
      const { resource } = await this.container.items.create(payload);
      return resource;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload data to Cosmos DB',
        error.message,
      );
    }
  }
}
