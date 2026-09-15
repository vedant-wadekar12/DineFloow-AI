import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import { restaurantRepository } from "../../restaurants";

import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "../dto/customer.dto";

import {
  customerRepository,
} from "../repositories/customer.repository";

export class CustomerService {
  async createCustomer(
    data: CreateCustomerDto,
    createdBy?: string
  ) {
    if (
      !Types.ObjectId.isValid(
        data.restaurantId
      )
    ) {
      throw new BadRequestError(
        "Invalid restaurant ID."
      );
    }

    const restaurant =
      await restaurantRepository.findById(
        data.restaurantId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    const existingPhone =
      await customerRepository.findByPhone(
        data.restaurantId,
        data.phone
      );

    if (existingPhone) {
      throw new BadRequestError(
        "Customer with this phone number already exists."
      );
    }

    if (data.email) {
      const existingEmail =
        await customerRepository.findByEmail(
          data.restaurantId,
          data.email
        );

      if (existingEmail) {
        throw new BadRequestError(
          "Customer with this email already exists."
        );
      }
    }

    const addresses =
      this.normalizeAddresses(
        data.addresses ?? []
      );

    return await customerRepository.create({
      ...data,

      restaurantId:
        new Types.ObjectId(
          data.restaurantId
        ),

      email: data.email?.toLowerCase(),

      addresses,

      createdBy: createdBy
        ? new Types.ObjectId(createdBy)
        : undefined,
    });
  }

  async getCustomer(id: string) {
    const customer =
      await customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundError(
        "Customer not found."
      );
    }

    return customer;
  }

  async getAllCustomers() {
    return await customerRepository.findAll();
  }

  async getCustomersByRestaurant(
    restaurantId: string
  ) {
    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestError(
        "Invalid restaurant ID."
      );
    }

    return await customerRepository.findByRestaurant(
      restaurantId
    );
  }

  async getCustomerByPhone(
    restaurantId: string,
    phone: string
  ) {
    const customer =
      await customerRepository.findByPhone(
        restaurantId,
        phone
      );

    if (!customer) {
      throw new NotFoundError(
        "Customer not found."
      );
    }

    return customer;
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerDto,
    updatedBy?: string
  ) {
    const customer =
      await customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundError(
        "Customer not found."
      );
    }

    if (data.phone) {
      const existingPhone =
        await customerRepository.findByPhone(
          customer.restaurantId,
          data.phone
        );

      if (
        existingPhone &&
        existingPhone._id.toString() !== id
      ) {
        throw new BadRequestError(
          "Customer with this phone number already exists."
        );
      }
    }

    if (data.email) {
      const existingEmail =
        await customerRepository.findByEmail(
          customer.restaurantId,
          data.email
        );

      if (
        existingEmail &&
        existingEmail._id.toString() !== id
      ) {
        throw new BadRequestError(
          "Customer with this email already exists."
        );
      }
    }

    const addresses =
      data.addresses
        ? this.normalizeAddresses(
            data.addresses
          )
        : undefined;

    return await customerRepository.update(
      id,
      {
        ...data,

        email:
          data.email?.toLowerCase(),

        addresses,

        updatedBy: updatedBy
          ? new Types.ObjectId(updatedBy)
          : undefined,
      }
    );
  }

  async updateStatus(
    id: string,
    status:
      | "ACTIVE"
      | "INACTIVE"
      | "BLOCKED"
  ) {
    const isActive =
      status === "ACTIVE";

    const customer =
      await customerRepository.updateStatus(
        id,
        status,
        isActive
      );

    if (!customer) {
      throw new NotFoundError(
        "Customer not found."
      );
    }

    return customer;
  }

  async deleteCustomer(id: string) {
    const customer =
      await customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundError(
        "Customer not found."
      );
    }

    await customerRepository.softDelete(id);

    return {
      message:
        "Customer deleted successfully.",
    };
  }

  private normalizeAddresses(
    addresses: CreateCustomerDto["addresses"]
  ) {
    if (!addresses) {
      return [];
    }

    let defaultFound = false;

    return addresses.map(
      (address, index) => {
        let isDefault =
          Boolean(address.isDefault);

        if (isDefault && !defaultFound) {
          defaultFound = true;
        } else {
          isDefault = false;
        }

        if (
          index === 0 &&
          !defaultFound
        ) {
          isDefault = true;
          defaultFound = true;
        }

        return {
          ...address,
          country:
            address.country ?? "India",
          isDefault,
        };
      }
    );
  }
}

export const customerService =
  new CustomerService();