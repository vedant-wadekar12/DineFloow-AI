import { Types } from "mongoose";
import { IUser, User } from "../../auth/models/user.model";

export class UserRepository {
  private tenantFilter(restaurantId?: string | Types.ObjectId) {
    return restaurantId ? { restaurantId } : {};
  }

  async findAll(restaurantId?: string | Types.ObjectId): Promise<IUser[]> {
    return User.find({
      ...this.tenantFilter(restaurantId),
      isDeleted: false,
    }).sort({ createdAt: -1 });
  }

  async findById(id: string | Types.ObjectId, restaurantId?: string | Types.ObjectId): Promise<IUser | null> {
    return User.findOne({
      _id: id,
      ...this.tenantFilter(restaurantId),
      isDeleted: false,
    });
  }

  async findByIdAndRestaurant(id: string | Types.ObjectId, restaurantId: string | Types.ObjectId): Promise<IUser | null> {
    return User.findOne({ _id: id, restaurantId, isDeleted: false });
  }

  async updateStatus(id: string | Types.ObjectId, isActive: boolean, restaurantId?: string | Types.ObjectId): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { _id: id, ...this.tenantFilter(restaurantId), isDeleted: false },
      { $set: { isActive } },
      { new: true, runValidators: true },
    );
  }

  async updateRole(id: string | Types.ObjectId, roleId: string | Types.ObjectId, restaurantId?: string | Types.ObjectId): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { _id: id, ...this.tenantFilter(restaurantId), isDeleted: false },
      { $set: { roleId } },
      { new: true, runValidators: true },
    );
  }

  async softDelete(id: string | Types.ObjectId, restaurantId?: string | Types.ObjectId): Promise<void> {
    await User.findOneAndUpdate(
      { _id: id, ...this.tenantFilter(restaurantId), isDeleted: false },
      { $set: { isDeleted: true, isActive: false } },
    );
  }
}

export const userRepository = new UserRepository();
