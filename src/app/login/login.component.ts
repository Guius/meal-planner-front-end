import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonContent,
  IonButton,
  IonItemSliding,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonSpinner,
  IonSkeletonText,
  IonFooter,
} from '@ionic/angular/standalone';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Values:', this.loginForm.value);
    }
  }
}
