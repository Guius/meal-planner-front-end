import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgClass, UpperCasePipe, CommonModule } from '@angular/common';
import { Ingredient, RandomRecipeDto } from './random-recipe.dto';
import { PaletteService } from './palette.service';
import { IngredientInformation } from './palette.component';
import { UnifiedRecipe } from './palette-2.component.dtos';
import { ToastController } from '@ionic/angular';

import {
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
  IonFooter,
  IonSkeletonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-palette-2',
  templateUrl: 'palette-2.component.html',
  styleUrl: 'palette.component.css',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    UpperCasePipe,
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
    IonFooter,
    IonSkeletonText,
  ],
  providers: [PaletteService],
})
export class Palette2Component implements OnInit {
  paletteRecipes: UnifiedRecipe[] = [];
  basketRecipes: UnifiedRecipe[] = [];
  recipesLoaded: boolean = false;

  constructor(
    private service: PaletteService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.fullPaletteRefresh();
  }

  /**
   * Gets 5 recipes from the back end and replaces the palette recipes with those
   * These recipes are different recipes from what is currently in the palette and the basket
   */
  fullPaletteRefresh() {
    this.recipesLoaded = false;
    this.service
      .getRandomRecipes(
        5,
        this.paletteRecipes.map((r) => r.id),
        this.basketRecipes.map((r) => r.id)
      )
      .subscribe({
        next: (data: RandomRecipeDto[]) => {
          this.paletteRecipes = data.map((r) => this.createUnifiedRecipe(r));
          this.recipesLoaded = true;
        },
        error: (error) => {
          console.error('Error loading recipes:', error);
          this.recipesLoaded = true;
          this.presentToast('bottom', 'Failed to load recipes!', 'error');
        },
      });
  }

  /**
   * Adds a recipe from the palette to the basket.
   * Removes that recipe from the palette and replaces it with a new recipe.
   */
  async addRecipeToBasket(paletteRecipe: UnifiedRecipe) {
    if (this.paletteRecipes.length === 0) {
      console.warn('No recipes in palette to add to basket');
      await this.presentToast('bottom', 'No recipes in palette!', 'error');
      return;
    }

    const indexOfRecipeInPalette = this.paletteRecipes.findIndex(
      (recipe) => recipe.id === paletteRecipe.id
    );

    if (indexOfRecipeInPalette === -1) {
      console.error(
        'Could not find index of recipe in palette that user is trying to add to basket'
      );
      await this.presentToast(
        'bottom',
        'Recipe not found in palette!',
        'error'
      );
      return;
    }

    this.service
      .getRandomRecipe(
        this.paletteRecipes.map((r) => r.id),
        this.basketRecipes.map((r) => r.id)
      )
      .subscribe({
        next: (data: RandomRecipeDto) => {
          const newPaletteRecipe: UnifiedRecipe =
            this.createUnifiedRecipe(data);

          // Add the selected recipe to basket
          this.basketRecipes.push(paletteRecipe);

          // Replace the palette recipe with the new one
          this.paletteRecipes[indexOfRecipeInPalette] = newPaletteRecipe;

          // Show success message
          this.presentToast('bottom', 'Recipe added to basket!', 'success');
        },
        error: (error) => {
          console.error('Error getting new recipe:', error);
          this.presentToast('bottom', 'Failed to get new recipe!', 'error');
        },
      });
  }

  getOneNewRecipe() {}

  /**
   * Removes a recipe from the basket
   */
  removeRecipeFromBasket(basketRecipe: UnifiedRecipe) {
    const indexOfRecipeInBasket = this.basketRecipes.findIndex(
      (recipe) => recipe.id === basketRecipe.id
    );

    if (indexOfRecipeInBasket === -1) {
      console.error('Could not find recipe in basket to remove');
      this.presentToast('bottom', 'Recipe not found in basket!', 'error');
      return;
    }

    this.basketRecipes.splice(indexOfRecipeInBasket, 1);
    this.presentToast('bottom', 'Recipe removed from basket!', 'success');
  }

  /**
   * Sends the selected recipes from basket to email
   */
  sendBasketRecipesToEmail() {
    if (this.basketRecipes.length === 0) {
      this.presentToast('bottom', 'No recipes in basket to send!', 'warning');
      return;
    }

    // Extract the full recipe DTOs and create ingredients list
    const selectedRecipes = this.basketRecipes.map(
      (recipe) => recipe.fullRecipe
    );
    const ingredientsList = this.createCombinedIngredientsList(selectedRecipes);

    this.service
      .sendRecipesToEmail(selectedRecipes, ingredientsList)
      .subscribe({
        next: () => {
          this.presentToast(
            'bottom',
            'Recipes sent to email successfully!',
            'success'
          );
        },
        error: (error) => {
          console.error('Error sending recipes to email:', error);
          this.presentToast(
            'bottom',
            'Failed to send recipes to email!',
            'error'
          );
        },
      });
  }

  /**
   * Creates a combined ingredients list from multiple recipes
   */
  private createCombinedIngredientsList(recipes: RandomRecipeDto[]): string[] {
    const finalIngredients: Record<string, IngredientInformation> = {};

    recipes.forEach((recipe) => {
      recipe.recipeIngredient.forEach((ingredient) => {
        const id = ingredient.ingredientId;
        const amount = ingredient.amount;
        const unit = ingredient.unit;
        const name = ingredient.name;

        if (finalIngredients[id]) {
          const existingAmount = parseFloat(finalIngredients[id].amount);
          const newAmount = parseFloat(amount);
          finalIngredients[id].amount = (existingAmount + newAmount).toString();
        } else {
          finalIngredients[id] = {
            amount: amount,
            unit: unit,
            name: name,
          };
        }
      });
    });

    return this.applyFiltersToIngredientNames(
      Object.values(finalIngredients).map((val) => {
        return `${val.name} - ${val.amount} ${val.unit}`;
      })
    );
  }

  /**
   * Helper method to convert RandomRecipeDto to UnifiedRecipe
   */
  private createUnifiedRecipe(recipeDto: RandomRecipeDto): UnifiedRecipe {
    return {
      id: recipeDto.id,
      recipeDiet: recipeDto.diet,
      recipeName: this.prettifyRecipeName(recipeDto.name),
      recipeTotalTime: this.prettifyPrepTime(recipeDto.totalTime),
      simplifiedIngredientsList: this.giveMeSimpleIngredientList(
        recipeDto.recipeIngredient
      ),
      fullRecipe: recipeDto,
    };
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

  prettifyRecipeName(name: string): string {
    return (
      name.split('-').join(' ').charAt(0).toUpperCase() +
      name.split('-').join(' ').slice(1).toLowerCase()
    );
  }

  prettifyPrepTime(prepTime: string): string {
    return prepTime.split('T')[1].split('M')[0] + ' minutes';
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
