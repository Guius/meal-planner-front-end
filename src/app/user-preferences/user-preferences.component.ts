import { Component } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { AppSubtitleComponent } from '../components/subtitle/subtitle.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-preferences',
  templateUrl: 'user-preferences.component.html',
  styleUrls: ['user-preferences.component.scss'],
  standalone: true,
  imports: [AppHeaderComponent, AppSubtitleComponent, IonContent],
})
export class UserPreferencesComponent {
  constructor(private userPreferencesService: UserPreferencesService) {}
}
