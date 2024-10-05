import { Component, ViewEncapsulation, OnInit } from '@angular/core';
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
export class PaletteComponent implements OnInit {
  recipes: RecipeOfPalette[] = [];

  simplifiedIngredientsList: string[] = [];

  finalIngredients: Record<string, IngredientInformation> = {};

  paletteItemsNumber: number = 5;

  constructor(private service: PaletteService) {
    console.log('hello');
  }

  ngOnInit() {
    this.getRandomRecipes(this.paletteItemsNumber);
  }

  refresh() {
    this.getRandomRecipes(this.paletteItemsNumber);
  }

  getRandomRecipes(numberOfRecipes: number) {
    this.service.getRandomRecipes(numberOfRecipes).subscribe({
      next: (data) => {
        console.info(data);
        this.recipes = data.map((val) => {
          return {
            recipe: val,
            locked: false,
          };
        });

        // get the final ingredients list
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
