import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpServiceWrapper {
  private readonly logger = new Logger(HttpServiceWrapper.name);

  private readonly defaultTimeout = 5000; // 5 segundos por defecto
  private circuitBreakerState: any = {
    failures: 0,
    lastFailure: null,
    isOpen: false,
  };
  private readonly maxFailures = 3;
  private readonly resetTimeout = 30000; // 30 segundos

  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, headers?: any, timeout?: number): Promise<T> {
    const config: AxiosRequestConfig = {
      headers,
      timeout: timeout || this.defaultTimeout,
    };
    return this.handleRequest(() =>
      firstValueFrom(this.httpService.get<T>(url, config)),
    );
  }

  async post<T>(
    url: string,
    data: any,
    headers?: any,
    timeout?: number,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      headers,
      timeout: timeout || this.defaultTimeout,
    };
    return this.handleRequest(() =>
      firstValueFrom(this.httpService.post<T>(url, data, config)),
    );
  }

  async put<T>(url: string, data: any, headers?: any): Promise<T> {
    return this.handleRequest(() =>
      firstValueFrom(this.httpService.put<T>(url, data, { headers })),
    );
  }

  async delete<T>(url: string, headers?: any): Promise<T> {
    return this.handleRequest(() =>
      firstValueFrom(this.httpService.delete<T>(url, { headers })),
    );
  }

  private async handleRequest<T>(requestFn: () => Promise<any>): Promise<T> {
    if (this.isCircuitBreakerOpen()) {
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message:
            'El servicio no está disponible temporalmente. Por favor, intente más tarde.',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const response = await requestFn();
      this.resetCircuitBreaker();
      return response.data;
    } catch (error) {
      this.recordFailure();
      this.handleError(error);
    }
  }

  private isCircuitBreakerOpen(): boolean {
    if (!this.circuitBreakerState.isOpen) {
      return false;
    }

    const now = Date.now();
    if (
      this.circuitBreakerState.lastFailure &&
      now - this.circuitBreakerState.lastFailure > this.resetTimeout
    ) {
      this.resetCircuitBreaker();
      return false;
    }

    return true;
  }

  private recordFailure(): void {
    this.circuitBreakerState.failures++;
    this.circuitBreakerState.lastFailure = Date.now();

    if (this.circuitBreakerState.failures >= this.maxFailures) {
      this.circuitBreakerState.isOpen = true;
    }
  }

  private resetCircuitBreaker(): void {
    this.circuitBreakerState.failures = 0;
    this.circuitBreakerState.lastFailure = null;
    this.circuitBreakerState.isOpen = false;
  }

  private handleError(error: any): never {
    if (error.isAxiosError) {
      const url = error.config?.url || 'URL desconocida';
      const method = error.config?.method || 'Método desconocido';
      const statusCode =
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse = error.response?.data;
      const errorMessage =
        errorResponse?.message || error.message || 'Error desconocido';

      if (error.code) {
        const networkErrors = [
          'ETIMEDOUT',
          'ECONNREFUSED',
          'ECONNRESET',
          'ENOTFOUND',
        ];
        if (networkErrors.includes(error.code)) {
          this.logger.error(
            `Error de red (${error.code}): No se pudo conectar con ${url}`,
          );
          throw new HttpException(
            {
              statusCode: HttpStatus.SERVICE_UNAVAILABLE,
              message:
                'No se pudo conectar con el servidor. Verifica la conectividad de red o intenta más tarde.',
              path: url,
              method,
            },
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
      }

      this.logger.error(
        `HTTP Error: ${statusCode} ${errorMessage}`,
        JSON.stringify({
          url,
          method,
          statusCode,
          response: errorResponse,
        }),
      );

      throw new HttpException(
        {
          statusCode,
          message: errorMessage,
          path: url,
          method,
        },
        statusCode,
      );
    }

    this.logger.error('Unexpected error', error);
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred on the http request',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
