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

  async onSubmit(): Promise<void> {
    this.submitted = true;
    console.log(this.loginForm.valid);
    console.log(this.loginForm.controls);
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      console.log(email, password);

      try {
        await this._authenticationService.login(email, password);
        this.presentToast('bottom', 'Logged in!', 'success');
        await this.router.navigate(['/palette']);
      } catch (err: any) {
        console.error('Login error:', err);

        // Check if it's an invalid credentials error or 401 status
        if (
          err.message &&
          (err.message.includes('Invalid credentials') ||
            err.message.includes('401'))
        ) {
          this.presentToast(
            'bottom',
            'Your email or password are wrong.',
            'error'
          );
        } else {
          this.presentToast('bottom', 'Something went wrong', 'error');
        }
      }
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
