import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { USERROLESENUM } from 'src/app/core/constants/enums';
import * as CryptoJS from 'crypto-js';
import { AuthenticatedUserDTO } from 'src/app/core/dataservice/User/dto/auth.dto';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    loginForm: FormGroup;
    showLoading = false;
    authenticatedUser: AuthenticatedUserDTO;

    constructor(
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.initializeLoginForm();
        this.loadRememberedCredentials();
    }

    private initializeLoginForm(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            rememberMe: [false],
        });
    }

    private loadRememberedCredentials(): void {
        const rememberMe = localStorage.getItem('rememberMe');
        if (rememberMe === '1') {
            const savedLogin = localStorage.getItem('appState22132');
            if (savedLogin) {
                try {
                    const decryptedData = CryptoJS.AES.decrypt(
                        savedLogin,
                        '12213123$#$#'
                    ).toString(CryptoJS.enc.Utf8);

                    if (decryptedData) {
                        const parsedCredentials = JSON.parse(decryptedData);
                        this.loginForm.patchValue({
                            email: parsedCredentials.email || '',
                            password: parsedCredentials.password || '',
                            rememberMe: true,
                        });
                        console.log('Saved credentials loaded successfully');
                    }
                } catch (error) {
                    console.error('Error loading saved credentials:', error);
                    this.clearSavedCredentials();
                }
            }
        }
    }

    login(): void {
        if (this.isFormInvalid()) return;

        const loginData = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password,
        };

        this.showLoading = true;
        this.authService.Login(loginData).subscribe({
            next: (res: any) => this.handleLoginSuccess(res, loginData),
            error: (err) => this.handleLoginError(err),
        });
    }

    private isFormInvalid(): boolean {
        if (!this.loginForm.value.email) {
            this.showMessage('Missing Field', 'Please enter your Email la.');
            return true;
        }
        if (!this.loginForm.value.password) {
            this.showMessage('Missing Field', 'Please enter your password la.');
            return true;
        }
        return false;
    }

    private handleLoginSuccess(res: any, loginData: any): void {
        this.authService.SetAuthToken(res.token);

        // Decode and log the JWT token
        if (res.token) {
            try {
                const tokenPayload = this.decodeJWT(res.token);
                console.log('Decoded JWT Token:', tokenPayload);

                sessionStorage.setItem('userId', tokenPayload.id);
            } catch (error) {
                console.error('Error decoding JWT token:', error);
            }
        }

        // Store userId in sessionStorage (fallback from response)
        if (res.user && res.user.id) {
            sessionStorage.setItem('userId', res.user.id);
            console.log('UserId stored from response:', res.user.id);
        }

        this.saveCredentialsIfRememberMe(loginData);
        setTimeout(() => {
            this.showLoading = false;
            this.determineNextRoute();
        }, 2000);
    }

    private decodeJWT(token: string): any {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Failed to decode JWT token:', error);
            return null;
        }
    }

    private saveCredentialsIfRememberMe(loginData: any): void {
        if (this.loginForm.controls['rememberMe'].value) {
            localStorage.setItem('rememberMe', '1');
            const credentialsToSave = {
                email: loginData.email,
                password: loginData.password,
            };
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(credentialsToSave),
                '12213123$#$#'
            ).toString();
            localStorage.setItem('appState22132', encryptedData);
        } else {
            this.clearSavedCredentials();
        }
    }

    private handleLoginError(err: any): void {
        this.showLoading = false;
        const message =
            err.error.statusCode >= 500
                ? 'Our backend services are currently down. Please try again later.'
                : err.error.message;
        this.showMessage('Error', message);
    }

    private showMessage(
        summary: string,
        detail: string,
        severity: string = 'error'
    ): void {
        this.messageService.add({
            severity: severity as any,
            summary,
            detail,
        });
    }

    clearSavedCredentials(): void {
        localStorage.removeItem('appState22132');
        localStorage.removeItem('rememberMe');
        this.loginForm.patchValue({
            email: '',
            password: '',
            rememberMe: false,
        });
        this.showMessage(
            'Success',
            'Saved login credentials cleared.',
            'success'
        );
    }

    hasSavedCredentials(): boolean {
        return (
            localStorage.getItem('rememberMe') === '1' &&
            localStorage.getItem('appState22132') !== null
        );
    }

    backToHome(): void {
        this.router.navigate(['/']);
    }

    determineNextRoute(): void {
        const authenticatedUser = this.authService.GetAuthenticatedUser();
        this.navigateToRole(authenticatedUser.role);
    }

    navigateToRole(role: any): void {
        const authenticatedUser = this.authService.GetAuthenticatedUser();
        this.authService.SetCurrentRole(role);

        const route = role.name === USERROLESENUM.admin ? '/admin' : '/staff';

        if (route) {
            this.router.navigate([route]);
        } else {
            this.showMessage('Error', 'Forbidden');
        }
    }
}
