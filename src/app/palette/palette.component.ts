import {
  Component,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  QueryList,
  AfterViewInit,
  ViewChildren,
} from '@angular/core';
import { chevronForward, warningOutline, close } from 'ionicons/icons';
import { PaletteService } from './palette.service';
import {
  Diet,
  Ingredient,
  RandomRecipeDto,
  RecipeOfPalette,
} from './random-recipe.dto';
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { HttpClientModule } from '@angular/common/http';
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
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormsModule, NgForm } from '@angular/forms';
import { addIcons } from 'ionicons';
import { PdfService } from './pdf.service';

export enum LengthGauge {
  Short = 'Short',
  Medium = 'Medium',
  Long = 'Long',
  Unknown = 'Unknown',
}

export interface IngredientInformation {
  unit: string;
  amount: string;
  name: string;
}

@Component({
  selector: 'app-palette',
  templateUrl: 'palette.component.html',
  styleUrl: 'palette.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [PaletteService, PdfService],
  imports: [
    IonSpinner,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonButton,
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCard,
    IonSpinner,
    IonSkeletonText,
    HttpClientModule,
    CommonModule,
    FormsModule,
  ],
})
export class PaletteComponent implements OnInit, AfterViewInit {
  @ViewChildren('slidingItem') slidingItems!: QueryList<IonItemSliding>;

  // modal
  @ViewChild(IonModal) modal!: IonModal;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string = '';
  @ViewChild(NgForm) optionsForm!: NgForm;

  rawRecipes: RandomRecipeDto[] = [];
  recipes: RecipeOfPalette[] = [];

  simplifiedIngredientsList: string[] = [];

  finalIngredients: Record<string, IngredientInformation> = {};

  paletteItemsNumber: number = 5;
  maxNumber: number = 10;
  minNumber: number = 1;

  isSendingEmail = false;
  recipesLoaded = false;
  errorLoadingRecipes = false;

  alertButtons = ['Action'];

  constructor(
    private service: PaletteService,
    private toastController: ToastController,
    private pdfService: PdfService
  ) {
    addIcons({ warningOutline, chevronForward, close });
  }

  ngOnInit() {
    this.getRandomRecipes(this.paletteItemsNumber);
  }

  async downloadPdf(): Promise<void> {
    let recipes: RandomRecipeDto[] = [];
    for (let i = 0; i < this.recipes.length; i++) {
      recipes.push(this.recipes[i].recipe);
    }
    await this.pdfService.generatePdf(this.simplifiedIngredientsList, recipes);
  }

  ngAfterViewInit() {
    console.log(this.slidingItems);
    // Now the slidingItems list is initialized, and we can safely use it
  }

  refresh() {
    let numberOfItemsLocked = 0;
    for (let i = 0; i < this.recipes.length; i++) {
      if (this.recipes[i].locked) numberOfItemsLocked++;
    }
    // TODO: if all recipes have been locked show a message telling user we are not getting anything from back end
    if (this.paletteItemsNumber - numberOfItemsLocked === 0) {
      this.presentToast('bottom', 'You have locked all recipes');
    }
    this.getRandomRecipes(this.paletteItemsNumber - numberOfItemsLocked);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      cssClass: 'warning-toast',
    });

    await toast.present();
  }

  lockItem(itemIndex: number) {
    if (this.recipes[itemIndex]) {
      this.recipes[itemIndex].locked
        ? (this.recipes[itemIndex].locked = false)
        : (this.recipes[itemIndex].locked = true);
      console.log(this.slidingItems);
      const slidingItemsArray = this.slidingItems.toArray(); // Now it's safe to use this

      if (slidingItemsArray[itemIndex]) {
        slidingItemsArray[itemIndex].close(); // Close the sliding item at the specified index
      } else {
        console.error('Sliding item at the specified index not found.');
      }
    }
  }

  getRandomRecipes(numberOfRecipes: number) {
    console.log(`getting ${numberOfRecipes} recipes from back end`);
    this.service.getRandomRecipes(numberOfRecipes).subscribe({
      next: (data) => {
        console.info(data);
        if (this.recipes.length === 0) {
          this.rawRecipes = data;
          this.recipes = data.map((val) => {
            return {
              recipe: val,
              locked: false,
            };
          });
        } else {
          // loop through current recipes of palette
          for (let i = 0; i < this.recipes.length; i++) {
            // if recipe of palette is locked then skip it
            if (this.recipes[i].locked) continue;
            // if recipe of palette is not locked, override it with recipe from back end
            const lastRecipeOfBackEnd = data.pop();
            if (!lastRecipeOfBackEnd) {
              break;
            }
            this.recipes[i] = { recipe: lastRecipeOfBackEnd, locked: false };
            this.rawRecipes[i] = lastRecipeOfBackEnd;
          }
        }

        // get the final ingredients list
        this.finalIngredients = {};
        /**
         * First create an object whose keys is every ingredient id.
         * If that key already exists, then add the amounts together
         */
        for (
          let recipeNumber = 0;
          recipeNumber < this.recipes.length;
          recipeNumber++
        ) {
          const recipe = this.recipes[recipeNumber];
          const ingredients = recipe.recipe.recipeIngredient;

          for (let i = 0; i < ingredients.length; i++) {
            const ingredient = ingredients[i];
            const amount = ingredient.amount;
            const unit = ingredient.unit;
            const name = ingredient.name;
            const id = ingredient.ingredientId;

            if (this.finalIngredients[id]) {
              const existingAmount = parseFloat(
                this.finalIngredients[id].amount
              );
              const newAmount = parseFloat(amount);

              this.finalIngredients[id].amount = (
                existingAmount + newAmount
              ).toString();
            } else {
              this.finalIngredients[id] = {
                amount: amount,
                unit: unit,
                name: name,
              };
            }
          }
        }

        // now make the object into an array so that the front end can easily show it
        /**
         * applies filter to an array made up the ingredients dictionary
         */
        this.simplifiedIngredientsList = this.applyFiltersToIngredientNames(
          Object.values(this.finalIngredients).map((val) => {
            return `${val.name} - ${val.amount} ${val.unit}`;
          })
        );

        this.recipesLoaded = true;
      },
      error: async (err) => {
        const toast = await this.toastController.create({
          message: 'Error loading recipes',
          duration: 1500,
          position: 'bottom',
          cssClass: 'error-toast',
        });

        await toast.present();
        this.recipesLoaded = true;
      },
    });
  }

  async sendRecipesByEmail() {
    this.isSendingEmail = true;
    if (this.rawRecipes.length === 0) {
      const toast = await this.toastController.create({
        message: 'No recipes to send!',
        duration: 1500,
        position: 'bottom',
        color: 'danger',
      });

      await toast.present();
    }

    this.service
      .sendRecipesToEmail(this.rawRecipes, this.simplifiedIngredientsList)
      .subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: 'Email sent!',
            duration: 1500,
            position: 'bottom',
            cssClass: 'success-toast',
          });

          this.isSendingEmail = false;
          await toast.present();
        },
        error: async () => {
          const toast = await this.toastController.create({
            message: 'Email could not be sent!',
            duration: 1500,
            position: 'bottom',
            color: 'danger',
          });

          this.isSendingEmail = false;
          await toast.present();
        },
      });
  }

  prettifyRecipeName(name: string): string {
    return (
      name.split('-').join(' ').charAt(0).toUpperCase() +
      name.split('-').join(' ').slice(1).toLowerCase()
    );
  }

  prettifyPrepTime(prepTime: string): string {
    return prepTime.split('T')[1].split('M')[0] + ' minutes';
  }

  colorPrepTime(prepTime: string): LengthGauge {
    const time = parseInt(prepTime.split('T')[1].split('M')[0]);
    if (isNaN(time)) {
      return LengthGauge.Unknown;
    }

    if (time <= 20) {
      return LengthGauge.Short;
    } else if (time <= 45) {
      return LengthGauge.Medium;
    } else {
      return LengthGauge.Long;
    }
  }

  giveMeSimpleIngredientList(ingredients: Ingredient[]): string {
    let ingredientNames = ingredients.map((val: Ingredient): string => {
      return val.name;
    });

    ingredientNames = this.applyFiltersToIngredientNames(ingredientNames);

    return ingredientNames.join(', ');
  }

  applyFiltersToIngredientNames(ingredientNames: string[]): string[] {
    ingredientNames = ingredientNames.filter(
      (word) => !word.startsWith('Water')
    );

    // remove starting with Salt
    ingredientNames = ingredientNames.filter(
      (word) => !word.startsWith('Salt')
    );

    // remove starting with Sugar
    ingredientNames = ingredientNames.filter(
      (word) => !word.startsWith('Sugar')
    );

    // remove olive oil
    ingredientNames = ingredientNames.filter(
      (word) => !word.startsWith('Olive Oil')
    );

    return ingredientNames;
  }

  // MODAL
  submitted = false;
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.submitted = true;

    let personalValid = true;

    if (
      this.paletteItemsNumber > this.maxNumber ||
      this.paletteItemsNumber < this.minNumber
    ) {
      personalValid = false;
    }

    if (this.optionsForm.valid && personalValid) {
      this.modal.dismiss(this.name, 'confirm');
      this.recipes = [];
      this.getRandomRecipes(this.paletteItemsNumber);
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}
