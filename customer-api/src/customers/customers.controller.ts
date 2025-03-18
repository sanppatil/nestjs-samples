/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('customers')
@ApiBearerAuth() // Enables Authorization header in Swagger
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles('Update.Customer')
  create(@Body() customerData: Omit<Customer, 'id'>): Customer {
    return this.customersService.create(customerData);
  }

  @Get(':id')
  @Roles('Read.Customer')
  findOne(@Param('id') id: string): Customer {
    return this.customersService.findOne(+id);
  }

  @Get()
  @Roles('Read.Customer')
  list(): Customer[] {
    return this.customersService.findAll();
  }

  @Delete(':id')
  @Roles('Delete.Customer')
  remove(@Param('id') id: string): void {
    return this.customersService.remove(+id);
  }
}
