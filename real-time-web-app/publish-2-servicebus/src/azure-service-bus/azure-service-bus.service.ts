import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AzureServiceBusService implements OnModuleInit, OnModuleDestroy {
  private serviceBusClient: ServiceBusClient;
  private sender: ServiceBusSender;
  private readonly cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
  ];

  constructor() {
    const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
    const topicName = process.env.TOPIC_NAME;

    if (!connectionString || !topicName) {
      throw new Error(
        'Environment variables SERVICE_BUS_CONNECTION_STRING or TOPIC_NAME are missing',
      );
    }

    this.serviceBusClient = new ServiceBusClient(connectionString);
    this.sender = this.serviceBusClient.createSender(topicName);
  }

  async onModuleInit() {
    this.startSendingTemperatureData();
  }

  async onModuleDestroy() {
    await this.serviceBusClient.close();
  }

  private generateRandomTemperature(city: string) {
    const temperature = (Math.random() * 50 - 10).toFixed(2);
    return { city, temperature };
  }

  private async sendTemperatureForCity(city: string) {
    try {
      while (true) {
        const temperatureData = this.generateRandomTemperature(city);
        const message = {
          body: temperatureData,
          contentType: 'application/json',
          label: 'TemperatureData',
        };

        console.log(
          `Sending message for ${city}: ${JSON.stringify(temperatureData)}`,
        );
        await this.sender.sendMessages(message);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error(`Error sending message for ${city}:`, err);
    }
  }

  private startSendingTemperatureData() {
    this.cities.forEach((city) => {
      this.sendTemperatureForCity(city);
    });
  }
}
