import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CosmosService } from './cosmos.service';

@ApiTags('cosmos')
@Controller('cosmos')
export class CosmosController {
  constructor(private readonly cosmosService: CosmosService) {}

  @ApiOperation({ summary: 'Upload JSON data to Azure Cosmos DB' })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        id: 'unique-id-123',
        name: 'John Doe',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Metropolis',
        },
      },
    },
  })
  @Post('upload')
  async uploadData(@Body() payload: any) {
    const result = await this.cosmosService.uploadData(payload);
    return { message: 'Data uploaded successfully', result };
  }
}
