import * as fs from 'fs';
import * as path from 'path';

export class CosmosConfig {
  private static configMap: Map<
    string,
    {
      accountName: string;
      key: string;
      databaseId: string;
      containerId: string;
    }
  > = new Map();

  static loadConfigsFromEnv() {
    // Example of loading configurations from .env variables
    const envConfigs = [
      {
        name: process.env.COSMOS_CONFIG1_NAME,
        accountName: process.env.COSMOS_CONFIG1_ACCOUNT_NAME,
        key: process.env.COSMOS_CONFIG1_KEY,
        databaseId: process.env.COSMOS_CONFIG1_DATABASE_ID,
        containerId: process.env.COSMOS_CONFIG1_CONTAINER_ID,
      },
      {
        name: process.env.COSMOS_CONFIG2_NAME,
        accountName: process.env.COSMOS_CONFIG2_ACCOUNT_NAME,
        key: process.env.COSMOS_CONFIG2_KEY,
        databaseId: process.env.COSMOS_CONFIG2_DATABASE_ID,
        containerId: process.env.COSMOS_CONFIG2_CONTAINER_ID,
      },
    ];

    envConfigs.forEach((config) => {
      if (config.name) {
        this.addConfig(config.name, {
          accountName: config.accountName,
          key: config.key,
          databaseId: config.databaseId,
          containerId: config.containerId,
        });
      }
    });
  }

  // Optionally, load additional configurations from a JSON file
  static loadConfigsFromFile(filePath: string) {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Configuration file not found at path: ${fullPath}`);
    }

    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const jsonConfigs = JSON.parse(fileContent);

    jsonConfigs.forEach((config: any) => {
      if (config.name) {
        this.addConfig(config.name, {
          accountName: config.accountName,
          key: config.key,
          databaseId: config.databaseId,
          containerId: config.containerId,
        });
      }
    });
  }

  static addConfig(
    configName: string,
    config: {
      accountName: string;
      key: string;
      databaseId: string;
      containerId: string;
    },
  ) {
    this.configMap.set(configName, config);
  }

  static getConfig(configName: string) {
    return this.configMap.get(configName);
  }

  static getAllConfigs() {
    return Array.from(this.configMap.entries());
  }
}
