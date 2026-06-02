import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  department: string;
  position: string;
  hireDate: string;
  status: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  create(user: User): User {
    this.users.push(user);
    return user;
  }
}