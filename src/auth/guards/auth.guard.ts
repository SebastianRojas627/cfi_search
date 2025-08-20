import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpServiceWrapper } from '../../core/services/http.service';
import { ConfigService } from '@nestjs/config';
import { IUserInfo } from '../interfaces/user-info.interface';
import { SingleResponse } from '../interfaces/singleResponse.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpServiceWrapper,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No se proporcionó un token de acceso');
    }

    try {
      const baseUrl = process.env.API_AUTHENTICATION_URL
      const url = `${baseUrl}/auth/validate-token`;

      const { data } = await this.httpService.post<SingleResponse<IUserInfo>>(url, null, {
        Authorization: `Bearer ${token}`,
      });

      request['user'] = data;
      request['token'] = token;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message || 'Token inválido');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
