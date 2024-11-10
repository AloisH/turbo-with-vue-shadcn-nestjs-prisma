import { UserRepository } from '@heloir/backend-database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UserRepository) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public async getUsers(): Promise<string[]> {
    return (await this.userRepository.users({})).map((user) => user.email);
  }

  public async createUser(): Promise<string[]> {
    await this.userRepository.createUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
    });

    return this.getUsers();
  }
}
