import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { PaletteService } from './palette.service';
import { RandomRecipeDto } from './random-recipe.dto';
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-palette',
  templateUrl: 'palette.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [PaletteService],
  imports: [HttpClientModule],
})
export class PaletteComponent implements OnInit {
  recipes: RandomRecipeDto[] = [];

  constructor(private service: PaletteService) {
    console.log('hello');
  }

  ngOnInit() {
    console.log('HELLLO');
    this.getRandomRecipes(2);
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
}
