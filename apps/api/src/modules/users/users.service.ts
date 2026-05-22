import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AddressEntity } from './entities/address.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AddressEntity) private addressRepo: Repository<AddressEntity>,
  ) {}

  async create(data: Partial<UserEntity>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string, opts?: { includePassword?: boolean }) {
    const qb = this.userRepo.createQueryBuilder('u').where('u.email = :email', { email });
    if (opts?.includePassword) qb.addSelect('u.password');
    return qb.getOne();
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' },
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async update(id: string, data: Partial<UserEntity>) {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async getAddresses(userId: string) {
    return this.addressRepo.find({ where: { userId }, order: { isDefault: 'DESC' } });
  }

  async addAddress(userId: string, data: Partial<AddressEntity>) {
    if (data.isDefault) await this.addressRepo.update({ userId }, { isDefault: false });
    const address = this.addressRepo.create({ ...data, userId });
    return this.addressRepo.save(address);
  }
}
