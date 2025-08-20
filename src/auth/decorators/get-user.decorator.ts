import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUserInfo } from '../interfaces/user-info.interface';

export const GetUser = createParamDecorator(
  (data: keyof IUserInfo | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;

    if (!user) throw new InternalServerErrorException('Usuario no encontrado en la petición');

    return !data ? user : user[data];
  },
);