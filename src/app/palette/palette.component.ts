import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { PaletteService } from './palette.service';
import { Diet, RandomRecipeDto } from './random-recipe.dto';
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
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

const fakePalette: RandomRecipeDto[] = [
  {
    name: 'chicken-gyoza-udon-laksa',
    description:
      'Fragrant and spicy, laksa is a noodle soup known for its rich coconut milk broth. This vibrant soup contains thick udon noodles with toppings including chicken gyoza and veg, making it a fresh and flavourful meal.',
    recipeCuisine: 'Thai',
    totalTime: 'PT25M',
    recipeCategory: 'main course',
    recipeIngredient: [
      '2 unit(s) Garlic Clove',
      '1 unit(s) Carrot',
      '1 unit(s) Pak Choi',
      '1 unit(s) Lime',
      '50 grams Red Thai Style Paste',
      '1 sachet(s) Thai Style Spice Blend',
      '180 milliliter(s) Coconut Milk',
      '15 milliliter(s) Soy Sauce',
      '1 pack(s) Chicken Gyoza',
      '220 grams Udon Noodles',
      '1 tsp Sugar',
      '150 milliliter(s) Water for the Laksa',
    ],
    keywords: ['Calorie Smart', 'Quick', 'Spicy', 'New', 'Climate Conscious'],
    diet: Diet.Meat,
    nutrition: {
      sugarContent: '12.4 g',
      proteinContent: '17.9 g',
      fatContent: '24.6 g',
      calories: '546 kcal',
      carbohydrateContent: '62 g',
      saturatedFatContent: '15 g',
      servingSize: '576',
      sodiumContent: '3.98 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: 'a) Peel and grate the garlic (or use a garlic press). \nb) Trim the carrot, then slice into 0.5cm thick rounds (no need to peel).\nc) Trim the pak choi, then separate the leaves. Cut any larger leaves in half lengthways down the middle.\nd) Zest and quarter the lime.',
      },
      {
        type: 'HowToStep',
        text: "a) Heat a drizzle of oil in a large saucepan on high heat.\nb) Once hot, add the carrot and stir-fry until tender, 6-8 mins.\nc) Lower the heat to medium and add the red Thai style paste, Thai style spice blend (add less if you'd prefer things milder) and garlic.\nd) Cook until fragrant, 1 min.",
      },
      {
        type: 'HowToStep',
        text: 'a) Add the coconut milk, soy sauce, sugar and water for the laksa (see pantry for amount) to the carrot.\nb) Stir to combine, bring to the boil and simmer until thickened slightly, 5-6 mins.',
      },
      {
        type: 'HowToStep',
        text: 'a) While your laksa simmers, heat a drizzle of oil in a large frying pan on medium-high heat.\nb) Once hot, add the gyozas and fry until golden on the bottom, 2-3 mins. Reduce the heat to medium-low, add 1 tbsp water to the pan and immediately cover with a lid or some foil.\nc) Cook until the gyozas are piping hot, 3-4 mins. Remove from the heat.',
      },
      {
        type: 'HowToStep',
        text: "a) Add the udon noodles and pak choi leaves to your laksa and simmer until warmed through, 1-2 mins.\nb) Stir in the lime zest and a squeeze of lime juice.\nc) Taste and add more salt, pepper, lime juice and sugar if needed. Add a splash of water if it's a little too thick - you want a soupy consistency!",
      },
      {
        type: 'HowToStep',
        text: 'a) Share the udon laksa between your bowls.\nb) Top with the chicken gyozas.\nc) Serve with any remaining lime wedges for squeezing over.\nEnjoy!',
      },
    ],
    recipeYield: 2,
  },
  {
    name: 'speedy-honey-chermoula-beef',
    description:
      'Perfect for a midweek meal, this Speedy Honey Chermoula Beef can be on your table in less than 25 minutes. Chermoula spice mix is widely used in North African cuisine, fragrant with paprika, turmeric and coriander.',
    recipeCuisine: 'Middle Eastern',
    totalTime: 'PT20M',
    recipeCategory: 'main course',
    recipeIngredient: [
      '150 grams Basmati Rice',
      '1 unit(s) Courgette',
      '2 unit(s) Garlic Clove',
      '1 bunch(es) Mint',
      '240 grams British Beef Mince',
      '1 sachet(s) Roasted Spice and Herb Blend',
      '30 grams Tomato Puree',
      '10 grams Chicken Stock Paste',
      '75 grams Greek Style Natural Yoghurt',
      '15 grams Honey',
      '100 milliliter(s) Water for the Sauce',
    ],
    keywords: ['Quick', 'High Protein'],
    diet: Diet.Meat,
    nutrition: {
      sugarContent: '13.9 g',
      proteinContent: '37.9 g',
      fatContent: '25.1 g',
      calories: '666 kcal',
      carbohydrateContent: '75.7 g',
      saturatedFatContent: '11.2 g',
      servingSize: '432',
      sodiumContent: '1.51 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: 'a) Boil a half-full kettle.\nb) Pour the boiled water into a large saucepan with 1/4 tsp salt on high heat. Add the rice and cook for 10-12 mins.\nc) Once cooked, drain in a sieve and pop back in the pan. Cover with a lid and leave to the side until ready to serve.',
      },
      {
        type: 'HowToStep',
        text: 'a) Meanwhile, trim the courgette, then quarter lengthways. Chop widthways into 1cm chunks\nb) Heat a drizzle of oil in a large frying pan on high heat. \nc) When hot, add the courgette and cook until charred, 6-8 mins total.',
      },
      {
        type: 'HowToStep',
        text: 'a) Meanwhile, peel and grate the garlic (or use a garlic press).\nb) Pick the mint leaves from their stalks and roughly chop (discard the stalks).\nc) Once the courgette is cooked, season with salt and pepper, then transfer to a medium bowl. \nd) Wipe out the (now empty) frying pan.',
      },
      {
        type: 'HowToStep',
        text: "a) Heat the frying pan on medium-high heat (no oil).\nb) Once hot, add the beef mince. Fry until the mince has browned, 5-6 mins. Use a spoon to break it up as it cooks. IMPORTANT: Wash your hands and equipment after handling raw mince. It's cooked when no longer pink in the middle.\nc) When the mince has browned, drain and discard any excess fat. Season with salt and pepper. ",
      },
      {
        type: 'HowToStep',
        text: 'a) Add the garlic, roasted spice and herb blend and tomato puree to the beef. Stir-fry for 2 mins.\nb) Stir in the chicken stock paste and water for the sauce (see pantry for amount). Bring to the boil, then lower to a simmer. Cook until thickened slightly, 3-4 mins.\nc) In the meantime, in a small bowl, mix together the yoghurt and mint. Season with salt and pepper.\nd) When the beef has finished cooking, stir through the honey. TIP: If your honey has hardened, pop in a bowl of hot water for 1 min.',
      },
      {
        type: 'HowToStep',
        text: 'a) Stir the charred courgette through the sauce.\nb) Taste and season with salt and pepper if needed. Add a splash of water if you feel it needs it.\nc) Share the rice between your bowls.\nd) Top with your chermoula beef and finish with a dollop of mint yoghurt.\nEnjoy! ',
      },
    ],
    recipeYield: 2,
  },
  {
    name: 'indonesian-style-ginger-chicken-stew',
    description:
      'Looking for a super quick and tasty midweek dinner option? Try cooking up our Indonesian Style Ginger Chicken Stew in just 15 minutes for a delicious and speedy meal.',
    recipeCuisine: 'Asian',
    totalTime: 'PT15M',
    recipeCategory: 'main course',
    recipeIngredient: [
      '80 grams Green Beans',
      '1 pack(s) Diced British Chicken Breast',
      '1 unit(s) Lime',
      '150 grams Jasmine Rice',
      '30 grams Tomato Puree',
      '15 grams Ginger Puree',
      '1 sachet(s) Indonesian Style Spice Mix',
      '200 milliliter(s) Coconut Milk',
      '10 grams Chicken Stock Paste',
      '½ tsp Sugar',
    ],
    keywords: ['Super Quick', 'Family Friendly'],
    diet: Diet.Meat,
    nutrition: {
      sugarContent: '7.4 g',
      proteinContent: '42.1 g',
      fatContent: '25.1 g',
      calories: '692 kcal',
      carbohydrateContent: '74.3 g',
      saturatedFatContent: '20.3 g',
      servingSize: '415',
      sodiumContent: '1.88 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: '\nBoil a half-full kettle. \nWhile it boils, trim the green beans, then cut into thirds.\nHeat a drizzle of oil in a frying pan on medium-high heat.\nOnce hot, fry the chicken and green beans. Season with salt and pepper and fry for 5-6 mins. IMPORTANT: Wash hands and utensils after handling raw meat.\n',
      },
      {
        type: 'HowToStep',
        text: '\nMeanwhile, pour the boiled water into a saucepan with 1/4 tsp salt on high heat.\nBoil the rice, 10-12 mins. \nWhile the rice cooks, quarter the lime.\n',
      },
      {
        type: 'HowToStep',
        text: "\nStir in the tomato puree, ginger puree, Indonesian style spice mix, coconut milk, chicken stock paste and sugar (see pantry). \nLower the heat and simmer, 3-4 mins. IMPORTANT: Cook the chicken so there's no pink in the middle.\nAdd a good squeeze of lime juice. Taste and season with salt and pepper if needed. Remove from the heat.\n",
      },
      {
        type: 'HowToStep',
        text: '\nOnce the rice is cooked, drain well then share out between your bowls.\nSpoon over the chicken stew.\nServe with any remaining lime quarters for squeezing over.\n\nEnjoy!',
      },
    ],
    recipeYield: 2,
  },
  {
    name: 'creamy-honey-and-mustard-chicken',
    description:
      'This delicious Creamy Honey and Mustard Chicken has been expertly designed by our chefs as a lighter option to help with a balanced lifestyle.',
    recipeCuisine: 'British',
    totalTime: 'PT35M',
    recipeCategory: 'main course',
    recipeIngredient: [
      '450 grams Potatoes',
      '2 unit(s) Garlic Clove',
      '80 grams Green Beans',
      '240 grams Diced British Chicken Thigh',
      '75 grams Creme Fraiche',
      '10 grams Chicken Stock Paste',
      '17 grams Wholegrain Mustard',
      '15 grams Honey',
      '40 grams Baby Spinach',
      '10 grams Butter',
      '10 grams Flour',
      '150 milliliter(s) Water for the Sauce',
    ],
    keywords: [
      'Calorie Smart',
      'Family Friendly',
      'High Protein',
      'New',
      'SEO',
    ],
    diet: Diet.Meat,
    nutrition: {
      sugarContent: '11.7 g',
      proteinContent: '37.8 g',
      fatContent: '30.7 g',
      calories: '644 kcal',
      carbohydrateContent: '60.4 g',
      saturatedFatContent: '14 g',
      servingSize: '563',
      sodiumContent: '1.66 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: 'Bring a large saucepan of water with 1/2 tsp salt to the boil for the potatoes.\nChop the potatoes into 2cm chunks (peel first if you prefer).\nWhen boiling, add the potatoes to the water and cook until you can easily slip a knife through, 15-20 mins.',
      },
      {
        type: 'HowToStep',
        text: 'In the meantime, peel and grate the garlic (or use a garlic press).\nTrim the green beans and cut them into thirds.',
      },
      {
        type: 'HowToStep',
        text: "Heat a drizzle of oil in a large frying pan on medium-high heat.\nOnce hot, add the diced chicken and season with salt and pepper. Fry until golden brown on the outside and cooked through, 8-10 mins.\nHalfway through cooking, add the green beans. IMPORTANT: Wash your hands and equipment after handling raw chicken and its packaging. It's cooked when no longer pink in the middle.",
      },
      {
        type: 'HowToStep',
        text: 'Add the garlic, butter and flour (see pantry for both amounts) to the chicken. Cook, stirring frequently, for 1-2 mins.\nStir in the creme fraiche, chicken stock paste, wholegrain mustard and water for the sauce (see pantry for amount).\nSimmer the sauce until thickened slightly, 4-5 mins.',
      },
      {
        type: 'HowToStep',
        text: "Once the potatoes are cooked, drain in a colander and return to the pan, off the heat. Add a knob of butter and a splash of milk (if you have any) and mash until smooth. Season with salt and pepper. Cover with a lid to keep warm.\nJust before you're ready to serve, stir the honey through the sauce.\nAdd the spinach to the pan a handful at a time until wilted and piping hot, 1-2 mins. TIP: If your honey has hardened, pop it in a bowl of hot water for 1 min.",
      },
      {
        type: 'HowToStep',
        text: "Taste the sauce and season with salt and pepper if needed. Add a splash of water if it's a little thick.\nSpoon the mash onto one side of your serving bowls.\nServe your honey mustard chicken on the other half.\nEnjoy! ",
      },
    ],
    recipeYield: 2,
  },
  {
    name: 'souvlaki-inspired-halloumi-flatbreads',
    description:
      "A popular Greek street food choice, the word souvlaki literally means 'meat on skewers'. However, this delicious dish doesn't just extend to grilled meat, this vegetarian halloumi version combines indulgence, freshness and flavour all on one tasty flatbread.",
    recipeCuisine: 'Greek',
    totalTime: 'PT35M',
    recipeCategory: 'main course',
    recipeIngredient: [
      '450 grams Potatoes',
      '225 grams Halloumi',
      '½ unit(s) Red Onion',
      '12 milliliter(s) Red Wine Vinegar',
      '1 unit(s) Garlic Clove',
      '15 grams Sriracha Sauce',
      '1 unit(s) Medium Tomato',
      '2 unit(s) Plain Naans',
      '20 grams Baby Leaf Mix',
      '20 grams Butter',
      '1 tsp Sugar for the Pickle',
      '3 tbsp Mayonnaise',
      '1 tbsp Honey',
    ],
    keywords: ['Veggie', 'Bestseller'],
    diet: Diet.NonMeat,
    nutrition: {
      sugarContent: '21.1 g',
      proteinContent: '42.1 g',
      fatContent: '59.7 g',
      calories: '1201 kcal',
      carbohydrateContent: '124.8 g',
      saturatedFatContent: '23.6 g',
      servingSize: '617',
      sodiumContent: '4.05 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: 'Preheat your oven to 220°C/200°C fan/gas mark 7. Remove your butter (see pantry for amount) from the fridge and allow to come up to room temperature. \nChop the potatoes lengthways into 1cm slices, then chop into 1cm wide chips (no need to peel).\nPop the chips onto a large baking tray. Drizzle with oil, season with salt and pepper, then toss to coat. Spread out in a single layer. TIP: Use two baking trays if necessary.\nWhen the oven is hot, bake on the top shelf until golden, 25-30 mins. Turn halfway through.',
      },
      {
        type: 'HowToStep',
        text: 'Meanwhile, drain the halloumi and cut it into 2cm chunks. Place them into a small bowl of cold water and leave to soak.\nHalve, peel and slice the red onion (see ingredients for amount) as thinly as you can.\nPop it into a medium bowl and add the red wine vinegar and sugar for the pickle (see pantry for amount). Add a pinch of salt, mix together and set aside.',
      },
      {
        type: 'HowToStep',
        text: 'Peel and grate the garlic (or use a garlic press). In a small bowl, combine garlic with the softened butter. Season with salt and pepper, then set aside. \nIn another small bowl, combine the sriracha and mayonnaise (see pantry for amount). Set aside.\nCut the tomato into 1cm chunks. Pop it in the bowl of pickled onion.',
      },
      {
        type: 'HowToStep',
        text: 'Remove the halloumi from the cold water, pop it onto a plate lined with kitchen paper and dry.\nHeat a drizzle of oil in a frying pan on medium-high heat.\nOnce hot, add the halloumi and fry, turning frequently, until golden, 6-7 mins, then remove from the heat.\nDrizzle the fried halloumi with the honey (see pantry for amount) and turn to glaze it all over.',
      },
      {
        type: 'HowToStep',
        text: "Meanwhile, place the naans onto a baking tray. Spread the garlic butter over them and pop them into the oven to warm through, 3-4 mins.\nAdd the baby leaves to the bowl of pickled onion and tomato, then toss to combine. TIP: Don't add the leaves too early or they'll go soggy.",
      },
      {
        type: 'HowToStep',
        text: "When everything's ready, share the warm garlic naans between your plates.\nPile each naan with the salad and honeyed halloumi. Serve with the chips alongside (or add some to your naan like souvlaki!).\nDrizzle the sriracha mayo over the halloumi flatbreads to finish. \nEnjoy!",
      },
    ],
    recipeYield: 2,
  },
];

export enum LengthGauge {
  Short = 'Short',
  Medium = 'Medium',
  Long = 'Long',
  Unknown = 'Unknown',
}

@Component({
  selector: 'app-palette',
  templateUrl: 'palette.component.html',
  styleUrl: 'palette.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [PaletteService],
  imports: [
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
  recipes: RandomRecipeDto[] = [];

  simplifiedIngredientsList: string[] = [];

  constructor(private service: PaletteService) {
    console.log('hello');
  }

  ngOnInit() {
    console.log('hello');
    this.recipes = fakePalette;
    // this.getRandomRecipes(5);

    // get the final ingredients list
    const ingredientsList = [];
    for (
      let recipeNumber = 0;
      recipeNumber < this.recipes.length;
      recipeNumber++
    ) {
      ingredientsList.push(this.recipes[recipeNumber].recipeIngredient);
    }

    this.simplifiedIngredientsList =
      this.giveMeFinalPaletteIngredientsList(ingredientsList);
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

  giveMeFinalPaletteIngredientsList(ingredientLists: string[][]): string[] {
    // convert ingredientsLists to simple ingredients list
    const simpleIngredientLists: string[][] = [];
    for (
      let listNumber = 0;
      listNumber < ingredientLists.length;
      listNumber++
    ) {
      const ingredientNames = ingredientLists[listNumber].map(
        (val: string): string => {
          return (
            val.split(' ').slice(2).join(' ') +
            ' - ' +
            val.split(' ').slice(0, 2).join(' ')
          );
        }
      );

      const notWaterIngredients = ingredientNames.filter(
        (word) => !word.startsWith('Water')
      );

      simpleIngredientLists.push(notWaterIngredients);
    }

    console.log(simpleIngredientLists);

    const finalIngredientsList: string[] = [];

    /**
     * Loop through each list provided and if the item is not already in the finalIngredientsList
     * then add it
     */
    for (
      let listNumber = 0;
      listNumber < simpleIngredientLists.length;
      listNumber++
    ) {
      // loop through ingredients of list n
      for (
        let ingredientNumber = 0;
        ingredientNumber < simpleIngredientLists[listNumber].length;
        ingredientNumber++
      ) {
        if (
          finalIngredientsList.includes(
            simpleIngredientLists[listNumber][ingredientNumber]
          )
        ) {
          continue;
        } else {
          finalIngredientsList.push(
            simpleIngredientLists[listNumber][ingredientNumber]
          );
        }
      }
    }

    console.log(finalIngredientsList);
    return finalIngredientsList;
  }
}
