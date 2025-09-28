import { Component } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { AppSubtitleComponent } from '../components/subtitle/subtitle.component';
import { IonContent } from '@ionic/angular/standalone';
import { SelectLabelComponent } from '../components/select-label/select-label.component';
import { MultipleChoiceComponent } from '../components/multiple-choice/multiple-choice.component';

@Component({
  selector: 'app-user-preferences',
  templateUrl: 'user-preferences.component.html',
  styleUrls: ['user-preferences.component.scss'],
  standalone: true,
  imports: [
    AppHeaderComponent,
    AppSubtitleComponent,
    IonContent,
    SelectLabelComponent,
    MultipleChoiceComponent,
  ],
})
export class UserPreferencesComponent {
  constructor(private userPreferencesService: UserPreferencesService) {}
}
