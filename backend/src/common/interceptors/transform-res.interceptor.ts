import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class AppResponseDto<T> {
  data: T;
}
export interface AppResponse<T> {
  data: T;
}

@Injectable()
export class TransformResInterceptor<T> implements NestInterceptor<
  T,
  AppResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<AppResponse<T>> {
    return next.handle().pipe(
      map((response): AppResponse<T> => {
        // Check if the response contains a `meta` & `data` field
        if (
          response &&
          typeof response === "object" &&
          "meta" in response &&
          "data" in response
        ) {
          return response as AppResponse<T>;
        }
        // Default response structure without `meta`
        return { data: response as T };
      }),
    );
  }
}
