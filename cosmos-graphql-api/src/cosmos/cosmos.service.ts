import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CosmosClient, Container } from '@azure/cosmos';
import { CosmosConfig } from './cosmos-config';

@Injectable()
export class CosmosService {
  private clients: Map<string, CosmosClient> = new Map();

  private getClient(accountName: string, key: string): CosmosClient {
    if (!this.clients.has(accountName)) {
      const client = new CosmosClient({ endpoint: accountName, key });
      this.clients.set(accountName, client);
    }
    return this.clients.get(accountName);
  }

  private getContainer(configName: string): Container {
    const config = CosmosConfig.getConfig(configName);
    if (!config) {
      throw new NotFoundException(
        `Configuration with name "${configName}" not found`,
      );
    }

    const client = this.getClient(config.accountName, config.key);
    const database = client.database(config.databaseId);
    return database.container(config.containerId);
  }

  async getDocumentById(
    configName: string,
    partitionKey: string,
    id: string,
  ): Promise<any> {
    try {
      const container = this.getContainer(configName);
      const { resource } = await container.item(id, partitionKey).read();
      return resource;
    } catch (error) {
      throw new InternalServerErrorException(
        `Document with ID ${id} not found`,
        error.message,
      );
    }
  }
}
