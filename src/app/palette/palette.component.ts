import {
  Component,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  QueryList,
  AfterViewInit,
  ViewChildren,
} from '@angular/core';
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
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonContent,
  IonChip,
  IonCheckbox,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonNote,
  IonText,
  IonInput,
  IonButton,
  IonItemSliding,
  IonAvatar,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

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
  providers: [PaletteService],
  imports: [
    IonItemOption,
    IonItemOptions,
    IonAvatar,
    IonItemSliding,
    IonButton,
    IonInput,
    IonText,
    IonNote,
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonCheckbox,
    IonChip,
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonCard,
    HttpClientModule,
    CommonModule,
  ],
})
export class PaletteComponent implements OnInit, AfterViewInit {
  @ViewChildren('slidingItem') slidingItems!: QueryList<IonItemSliding>;

  recipes: RecipeOfPalette[] = [];

  simplifiedIngredientsList: string[] = [];

  finalIngredients: Record<string, IngredientInformation> = {};

  paletteItemsNumber: number = 5;

  constructor(private service: PaletteService) {}

  ngOnInit() {
    this.getRandomRecipes(this.paletteItemsNumber);
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
    this.getRandomRecipes(this.paletteItemsNumber - numberOfItemsLocked);
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
            if (!lastRecipeOfBackEnd) break;
            this.recipes[i] = { recipe: lastRecipeOfBackEnd, locked: false };
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
      },
      error: (err) => {
        // TODO: put toaster up
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
}
