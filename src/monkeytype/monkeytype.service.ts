import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MonkeytypeService {
  getHello(): string {
    return 'Hello from MonkeytypeService!';
  }

  async getStats(username: string) {
    const url = `https://api.monkeytype.com/users/${username}/profile`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error fetching Monkeytype stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
