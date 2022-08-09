import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { UserDto } from './dto/user.dto';
import { Model } from 'mongoose';
import { UsersResponseInterface } from './types/users.response.interface';
import { UserQueryInterface } from './types/user.query.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async fetch(query: UserQueryInterface): Promise<UsersResponseInterface> {
    const { pageNumber, pageSize, sortDirection, sortKey, search } = query;
    const searchQuery = { ...(search ? { $text: { $search: search } } : null) };

    const sortQuery = {};
    sortQuery[sortKey] = sortDirection === 'asc' ? -1 : 1;

    const users = await this.userModel
      .find(searchQuery)
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .sort(sortQuery);
    const count = await this.userModel.find(searchQuery).count();

    return { users, count };
  }

  async create(userDto: UserDto): Promise<User> {
    const userByEmail = await this.userModel.findOne({
      emailID: userDto.emailID,
    });

    if (userByEmail) {
      throw new HttpException(
        `User with email ${userDto.emailID} already exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new this.userModel(userDto);

    return await newUser.save();
  }

  async findByIdAndRemove(userId): Promise<User> {
    const user = this.userModel.findByIdAndRemove(userId);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneAndUpdate(
    userId: string,
    userDto: Partial<UserDto>,
  ): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      userDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  async getById(userId): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
