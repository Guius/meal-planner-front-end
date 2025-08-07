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
  IonFooter,
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
    IonFooter,
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
  paletteRecipes: RecipeOfPalette[] = [];
  simplifiedPaletteIngredientsList: string[] = [];
  finalPaletteIngredients: Record<string, IngredientInformation> = {};

  basketRecipes: RecipeOfPalette[] = [];
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
    console.log('init!');
  }

  async downloadPdf(): Promise<void> {
    let recipes: RandomRecipeDto[] = [];
    for (let i = 0; i < this.basketRecipes.length; i++) {
      recipes.push(this.basketRecipes[i].recipe);
    }
    await this.pdfService.generatePdf(this.simplifiedIngredientsList, recipes);
  }

  ngAfterViewInit() {
    console.log(this.slidingItems);
    // Now the slidingItems list is initialized, and we can safely use it
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

  addRecipeToBasket() {}

  /**
   * Used when user refreshes selection or when page is first loaded.
   */
  getFullSetOfRandomRecipes(numberOfRecipes: number) {
    console.log(`getting ${numberOfRecipes} recipes from back end`);
    this.service
      .getRandomRecipes(
        numberOfRecipes,
        this.paletteRecipes.map((r) => r.recipe.id),
        this.basketRecipes.map((r) => r.recipe.id)
      )
      .subscribe({
        next: (data) => {
          console.info(data);
          this.rawRecipes = data;
          this.paletteRecipes = data.map((val) => {
            return {
              recipe: val,
              locked: false,
            };
          });

          // get the final ingredients list
          this.finalIngredients = {};
          /**
           * First create an object whose keys is every ingredient id.
           * If that key already exists, then add the amounts together
           */
          for (
            let recipeNumber = 0;
            recipeNumber < this.paletteRecipes.length;
            recipeNumber++
          ) {
            const recipe = this.paletteRecipes[recipeNumber];
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
          await this.presentToast('bottom', 'Error loading recipes', 'error');
          this.recipesLoaded = true;
        },
      });
  }

  async sendRecipesByEmail() {
    this.isSendingEmail = true;
    if (this.rawRecipes.length === 0) {
      await this.presentToast('bottom', 'No recipes to send!', 'warning');
    }

    this.service
      .sendRecipesToEmail(this.rawRecipes, this.simplifiedIngredientsList)
      .subscribe({
        next: async () => {
          await this.presentToast('bottom', 'Email sent!', 'success');
          this.isSendingEmail = false;
        },
        error: async () => {
          await this.presentToast(
            'bottom',
            'Email could not be sent!',
            'error'
          );

          this.isSendingEmail = false;
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
    console.log(ingredients);
    let ingredientNames = ingredients.map((val: Ingredient): string => {
      return val.name;
    });

    console.log(ingredientNames.join(', '));

    ingredientNames = this.applyFiltersToIngredientNames(ingredientNames);

    console.log(ingredientNames.join(', '));
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

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}
