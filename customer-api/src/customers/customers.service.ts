import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  private customers: Customer[] = [];
  private idCounter = 1;

  /**
   * Create a new customer
   * @param customerData - Data for the new customer (without ID)
   * @returns Newly created customer object
   */
  create(customerData: Omit<Customer, 'id'>): Customer {
    const newCustomer = { id: this.idCounter++, ...customerData };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  /**
   * Get customer details by ID
   * @param id - Customer ID
   * @returns The customer object
   * @throws NotFoundException if customer is not found
   */
  findOne(id: number): Customer {
    const customer = this.customers.find((s) => s.id === id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  /**
   * Get a list of all customers
   * @returns Array of customers
   */
  findAll(): Customer[] {
    return this.customers;
  }

  /**
   * Delete a customer by ID
   * @param id - Customer ID
   * @throws NotFoundException if customer is not found
   */
  remove(id: number): void {
    const index = this.customers.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    this.customers.splice(index, 1);
  }
}
