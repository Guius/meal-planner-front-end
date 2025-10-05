import { Component, OnInit } from '@angular/core';
import {
  UserPreferencesService,
  CookDietDto,
} from './user-preferences.service';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { AppSubtitleComponent } from '../components/subtitle/subtitle.component';
import { IonContent, ToastController } from '@ionic/angular/standalone';
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
    CommonModule,
  ],
})
export class UserPreferencesComponent implements OnInit {
  dietOptions: MultipleChoiceItem[] = [];
  isLoading = true;

  // Skeleton items for loading state
  skeletonItems: MultipleChoiceItem[] = [
    { id: 'skeleton-1', label: '', selected: false },
    { id: 'skeleton-2', label: '', selected: false },
    { id: 'skeleton-3', label: '', selected: false },
  ];

  constructor(
    private userPreferencesService: UserPreferencesService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadDiets();
  }

  loadDiets() {
    this.isLoading = true;

    // First, get all available diets
    this.userPreferencesService.getDiets().subscribe({
      next: (dietsResponse) => {
        // Transform the response data to MultipleChoiceItem format
        this.dietOptions = [];
        this.dietOptions.push({
          id: '1',
          label: 'No specific diet',
          selected: false,
          exclusive: true,
        });

        const dietsFromBackend = dietsResponse.data.map(
          (diet: any, index: number) => ({
            id: diet.id || (index + 1).toString(),
            label: diet.name || diet.label,
            selected: false,
            exclusive:
              diet.name === 'No specific diet' ||
              diet.label === 'No specific diet',
          })
        );

        this.dietOptions = this.dietOptions.concat(dietsFromBackend);

        // Now fetch user's selected diets
        this.userPreferencesService.getMyDiets().subscribe({
          next: (myDietsResponse) => {
            this.handleMyDietsResponse(myDietsResponse);
            this.isLoading = false;
          },
          error: (error) => {
            this.handleMyDietsError(error);
            this.isLoading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error fetching diets:', error);
        this.isLoading = false;
        this.presentToast(
          'bottom',
          'Failed to load diets. Please try again.',
          'error'
        );
      },
    });
  }

  private handleMyDietsResponse(myDietsResponse: any) {
    if (myDietsResponse.data.length === 0) {
      // User has chosen diets but has no specific diet
      // Mark "No specific diet" as selected
      const noSpecificDiet = this.dietOptions.find(
        (diet) => diet.label === 'No specific diet'
      );
      if (noSpecificDiet) {
        noSpecificDiet.selected = true;
      }
    } else {
      // Mark selected diets based on IDs
      myDietsResponse.data.forEach((selectedDiet: CookDietDto) => {
        const dietOption = this.dietOptions.find(
          (diet) => diet.id === selectedDiet.id
        );
        if (dietOption) {
          dietOption.selected = true;
        }
      });
    }
  }

  private handleMyDietsError(error: any) {
    console.error('Error fetching my diets:', error);

    // Check if it's a NotFoundException (404)
    if (
      error.status === 404 ||
      (error.message && error.message.includes('404'))
    ) {
      // User has not yet chosen diets - this is normal, don't show error toast
      // Just leave all options unselected
      return;
    }

    // For other errors, show error toast
    this.presentToast(
      'bottom',
      'Failed to load your diet preferences. Please try again.',
      'error'
    );
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
