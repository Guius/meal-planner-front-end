import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { PaletteService } from './palette.service';
import { RandomRecipeDto } from './random-recipe.dto';
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
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

export enum LengthGauge {
  Short = 'Short',
  Medium = 'Medium',
  Long = 'Long',
  Unknown = 'Unknown',
}

@Component({
  selector: 'app-palette',
  templateUrl: 'palette.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [PaletteService],
  imports: [
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
  recipes: RandomRecipeDto[] = [];

  constructor(private service: PaletteService) {
    console.log('hello');
  }

  ngOnInit() {
    console.log('hello');
    this.getRandomRecipes(5);
  }

  getRandomRecipes(numberOfRecipes: number) {
    this.service.getRandomRecipes(numberOfRecipes).subscribe({
      next: (data) => {
        console.info(data);
        this.recipes = data;
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

  giveMeSimpleIngredientList(ingredients: string[]): string {
    const ingredientNames = ingredients.map((val: string): string => {
      return val.split(' ').slice(2).join(' ');
    });

    const notWaterIngredients = ingredientNames.filter(
      (word) => !word.startsWith('Water')
    );

    return notWaterIngredients.join(', ');
  }
}
