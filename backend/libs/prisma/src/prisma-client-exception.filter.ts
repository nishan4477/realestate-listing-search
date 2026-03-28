import type { HttpServer } from '@nestjs/common';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { capitalCase } from 'change-case';
import { Prisma } from '../generated/client';

export type ErrorCodesStatusMapping = {
  [key: string]: number | { statusCode?: number; errorMessage?: string };
};

type ExceptionConstructor = new (...args: unknown[]) => HttpException;

/**
 * {@link PrismaClientExceptionFilter} catches {@link Prisma.PrismaClientKnownRequestError} exceptions.
 */
@Catch(Prisma?.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  /**
   * default error codes mapping
   *
   * Error codes definition for Prisma Client (Query Engine)
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
   */
  private readonly defaultMapping: Partial<ErrorCodesStatusMapping> = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2015: HttpStatus.NOT_FOUND,
    P2025: {
      statusCode: HttpStatus.NOT_FOUND,
      errorMessage: 'Record not found',
    },
    P2034: HttpStatus.CONFLICT,
    P5011: HttpStatus.TOO_MANY_REQUESTS,
  };

  private readonly statusCodeToExceptionMap: Record<
    number,
    ExceptionConstructor
  > = {
    [HttpStatus.BAD_REQUEST]: BadRequestException,
    [HttpStatus.CONFLICT]: ConflictException,
    [HttpStatus.NOT_FOUND]: NotFoundException,
    [HttpStatus.TOO_MANY_REQUESTS]: HttpException,
  };

  private readonly userDefinedMapping?: ErrorCodesStatusMapping;

  /**
   * @param applicationRef
   * @param errorCodesStatusMapping
   */
  constructor(
    applicationRef?: HttpServer,
    errorCodesStatusMapping?: ErrorCodesStatusMapping,
  ) {
    super(applicationRef);

    this.userDefinedMapping = errorCodesStatusMapping;
  }

  /**
   * @param exception
   * @param host
   * @returns
   */
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    return this.catchClientKnownRequestError(exception, host);
  }

  private catchClientKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const statusCode =
      this.userDefinedStatusCode(exception) ||
      this.defaultStatusCode(exception);

    const message =
      this.userDefinedExceptionMessage(exception) ||
      this.defaultExceptionMessage(exception);

    if (host.getType() === 'http') {
      if (statusCode === undefined) {
        return super.catch(exception, host);
      }

      return super.catch(
        new HttpException({ statusCode, message }, statusCode),
        host,
      );
    }
  }

  private userDefinedStatusCode(
    exception: Prisma.PrismaClientKnownRequestError,
  ): number | undefined {
    const userDefinedValue = this.userDefinedMapping?.[exception.code];
    return typeof userDefinedValue === 'number'
      ? userDefinedValue
      : userDefinedValue?.statusCode;
  }

  private defaultStatusCode(
    exception: Prisma.PrismaClientKnownRequestError,
  ): number | undefined {
    const value = this.defaultMapping[exception.code];

    if (typeof value === 'number') {
      return value;
    }

    return value?.statusCode;
  }

  private userDefinedExceptionMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string | undefined {
    const userDefinedValue = this.userDefinedMapping?.[exception.code];
    return typeof userDefinedValue === 'number'
      ? undefined
      : userDefinedValue?.errorMessage;
  }

  private defaultExceptionMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    if (exception.code === 'P2002') {
      const targetMeta = (exception.meta as { target?: unknown } | undefined)
        ?.target;
      let target: string | undefined;

      if (Array.isArray(targetMeta)) {
        const targetMetaArray = targetMeta as unknown[];
        const last = targetMetaArray.at(-1);
        if (typeof last === 'string') {
          target = last;
        }
      } else if (typeof targetMeta === 'string') {
        target = targetMeta;
      }

      return `${capitalCase(target ?? 'Record')} already exists`;
    }

    const mapping = this.defaultMapping[exception.code];

    // If mapping is a structured object with errorMessage
    if (typeof mapping === 'object' && mapping?.statusCode) {
      const ExceptionClass =
        this.statusCodeToExceptionMap[mapping.statusCode] ?? HttpException;

      throw new ExceptionClass(mapping.errorMessage ?? 'Unexpected error');
    }

    // If mapping is just a statusCode
    if (typeof mapping === 'number') {
      const ExceptionClass =
        this.statusCodeToExceptionMap[mapping] ?? HttpException;
      throw new ExceptionClass(`[${exception.code}] Prisma error`);
    }

    // Fallback to generic message formatting
    const arrowIndex = exception.message.indexOf('→');
    const shortMessage =
      arrowIndex >= 0
        ? exception.message.substring(arrowIndex)
        : exception.message;

    return (
      `[${exception.code}]: ` +
      shortMessage
        .substring(shortMessage.indexOf('\n'))
        .replace(/\n/g, '')
        .trim()
    );
  }
}
