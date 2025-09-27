import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { UserPreferencesService } from './user-preferences.service';

@Component({
  selector: 'app-user-preferences',
  templateUrl: 'user-preferences.component.html',
  styleUrls: ['user-preferences.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class UserPreferencesComponent {
  constructor(private userPreferencesService: UserPreferencesService) {}
}
