import { Component, OnInit } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { AppSubtitleComponent } from '../components/subtitle/subtitle.component';
import {
  IonContent,
  IonSkeletonText,
  ToastController,
} from '@ionic/angular/standalone';
import { SelectLabelComponent } from '../components/select-label/select-label.component';
import { MultipleChoiceComponent } from '../components/multiple-choice/multiple-choice.component';
import { MultipleChoiceItem } from '../components/multiple-choice/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-preferences',
  templateUrl: 'user-preferences.component.html',
  styleUrls: ['user-preferences.component.scss'],
  standalone: true,
  imports: [
    AppHeaderComponent,
    IonContent,
    MultipleChoiceComponent,
    IonSkeletonText,
    CommonModule,
  ],
})
export class UserPreferencesComponent implements OnInit {
  dietOptions: MultipleChoiceItem[] = [];
  isLoading = true;

  constructor(
    private userPreferencesService: UserPreferencesService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadDiets();
  }

  loadDiets() {
    this.isLoading = true;
    this.userPreferencesService.getDiets().subscribe({
      next: (response) => {
        console.log('getting diets.', response);
        // Transform the response data to MultipleChoiceItem format
        this.dietOptions = response.data.map((diet: any, index: number) => ({
          id: diet.id || (index + 1).toString(),
          label: diet.name || diet.label,
          selected: false,
          exclusive:
            diet.name === 'No specific diet' ||
            diet.label === 'No specific diet',
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching diets:', error);
        this.isLoading = false;
        this.presentToast(
          'bottom',
          'Failed to load diets. Please try again.',
          'error'
        );
        // Fallback to default options
        this.setDefaultDietOptions();
      },
    });
  }

  setDefaultDietOptions() {
    this.dietOptions = [
      {
        id: '1',
        label: 'No specific diet',
        selected: false,
        exclusive: true,
      },
      {
        id: '2',
        label: 'Vegetarian',
        selected: false,
      },
      {
        id: '3',
        label: 'Vegan',
        selected: false,
      },
      {
        id: '4',
        label: 'Keto',
        selected: false,
      },
      {
        id: '5',
        label: 'Mediterranean',
        selected: false,
      },
    ];
  }

  saveDiets(selectedItems: MultipleChoiceItem[]) {
    console.log('Going to save diets', selectedItems);
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
