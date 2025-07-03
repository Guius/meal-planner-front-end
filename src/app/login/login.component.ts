import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonButton,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonFooter,
} from '@ionic/angular/standalone';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../auth/service';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonFooter,
    IonButton,
  ],
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss',
})
export class LoginPageComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.loginForm.valid);
    console.log(this.loginForm.controls);
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      console.log(email, password);
      this._authenticationService.login(email, password).subscribe({
        next: () => {
          this.presentToast('bottom', 'Logged in!', 'success');
          return this.router.navigate(['/palette']);
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.error.message === 'INVALIDCREDENTIALS') {
              this.presentToast(
                'bottom',
                'Your email or password are wrong.',
                'error'
              );
              return;
            }
          }
          this.presentToast('bottom', 'Something went wrong', 'error');
          return;
        },
      });
    }
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    level: 'success' | 'warning' | 'error'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      cssClass: `${level}-toast custom-toast ubuntu-sans-mono`,
    });

    await toast.present();
  }
}
