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
import { provideHttpClient } from '@angular/common/http';

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
    private _authenticationService: AuthenticationService
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
      console.log('Form Values:', this.loginForm.value);
    }
  }
}
