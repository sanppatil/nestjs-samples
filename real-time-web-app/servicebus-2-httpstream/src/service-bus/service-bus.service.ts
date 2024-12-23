import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';

@Injectable()
export class ServiceBusService implements OnModuleInit, OnModuleDestroy {
  private serviceBusClient: ServiceBusClient;
  private receiver: any;
  private globalClients: any[] = [];
  private cityClients: Record<string, any[]> = {};

  constructor() {
    const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
    const topicName = process.env.TOPIC_NAME;
    const subscriptionName = process.env.SUBSCRIPTION_NAME;

    if (!connectionString || !topicName || !subscriptionName) {
      throw new Error(
        'Environment variables SERVICE_BUS_CONNECTION_STRING, TOPIC_NAME, or SUBSCRIPTION_NAME are missing',
      );
    }

    this.serviceBusClient = new ServiceBusClient(connectionString);
    this.receiver = this.serviceBusClient.createReceiver(
      topicName,
      subscriptionName,
    );
  }

  async onModuleInit() {
    this.listenToServiceBus();
  }

  async onModuleDestroy() {
    await this.serviceBusClient.close();
  }

  private listenToServiceBus() {
    console.log('Listening for messages from Azure Service Bus...');

    this.receiver.subscribe({
      processMessage: async (message) => {
        const data = message.body;
        console.log('Received message:', data);

        // Broadcast to global clients
        this.broadcastToGlobalClients(data);

        // Broadcast to city-specific clients
        if (data.city) {
          this.broadcastToCityClients(data.city, data);
        }
      },
      processError: async (err) => {
        console.error('Error receiving message:', err);
      },
    });
  }

  private broadcastToGlobalClients(message: any) {
    this.globalClients.forEach((client) =>
      client.write(`data: ${JSON.stringify(message)}\n\n`),
    );
  }

  private broadcastToCityClients(city: string, message: any) {
    if (this.cityClients[city]) {
      this.cityClients[city].forEach((client) =>
        client.write(`data: ${JSON.stringify(message)}\n\n`),
      );
    }
  }

  addGlobalClient(res: any) {
    this.globalClients.push(res);

    res.on('close', () => {
      this.globalClients = this.globalClients.filter(
        (client) => client !== res,
      );
      res.end();
    });
  }

  addCityClient(city: string, res: any) {
    if (!this.cityClients[city]) {
      this.cityClients[city] = [];
    }

    this.cityClients[city].push(res);

    res.on('close', () => {
      this.cityClients[city] = this.cityClients[city].filter(
        (client) => client !== res,
      );
      res.end();
    });
  }
}
