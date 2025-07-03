import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../dataservice/User/auth.service';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const authToken = this.authService.GetToken();

        // Attach Authorization header if token exists
        if (authToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401 || error.status === 403) {
                        this.authService.LogOut();
                    }
                }
                return throwError(() => error);
            })
        );
    }
}
