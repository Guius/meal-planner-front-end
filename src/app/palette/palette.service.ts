import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Diet, RandomRecipeDto } from './random-recipe.dto';

const fakePalette: RandomRecipeDto[] = [
  {
    name: 'coconut-king-prawn-laksa',
    description:
      'This Coconut King Prawn Laksa takes inspiration from classic restaurant dishes to bring a fine dining experience straight into your home!',
    recipeCuisine: 'Indonesian',
    totalTime: 'PT20M',
    recipeCategory: 'main course',
    recipeIngredient: [
      {
        name: 'Egg Noodle Nest',
        ingredientId: 'Egg_Noodle_Nest#grams',
        amount: '125',
        unit: 'grams',
      },
      {
        name: 'Pak Choi',
        ingredientId: 'Pak_Choi#unit(s)',
        amount: '1',
        unit: 'unit(s)',
      },
      {
        name: 'Coriander',
        ingredientId: 'Coriander#bunch(es)',
        amount: '1',
        unit: 'bunch(es)',
      },
      {
        name: 'Lime',
        ingredientId: 'Lime#unit(s)',
        amount: '0.5',
        unit: 'unit(s)',
      },
      {
        name: 'Salted Peanuts',
        ingredientId: 'Salted_Peanuts#grams',
        amount: '25',
        unit: 'grams',
      },
      {
        name: 'Yellow Thai Style Paste',
        ingredientId: 'Yellow_Thai_Style_Paste#grams',
        amount: '45',
        unit: 'grams',
      },
      {
        name: 'Coconut Milk',
        ingredientId: 'Coconut_Milk#milliliter(s)',
        amount: '180',
        unit: 'milliliter(s)',
      },
      {
        name: 'Soy Sauce',
        ingredientId: 'Soy_Sauce#milliliter(s)',
        amount: '15',
        unit: 'milliliter(s)',
      },
      {
        name: 'Peanut Butter',
        ingredientId: 'Peanut_Butter#grams',
        amount: '30',
        unit: 'grams',
      },
      {
        name: 'King Prawns',
        ingredientId: 'King_Prawns#grams',
        amount: '225',
        unit: 'grams',
      },
      {
        name: 'Mangetout',
        ingredientId: 'Mangetout#grams',
        amount: '80',
        unit: 'grams',
      },
      {
        name: 'Sugar',
        ingredientId: 'Sugar#tsp',
        amount: '0.5',
        unit: 'tsp',
      },
      {
        name: 'Water for the Sauce',
        ingredientId: 'Water_for_the_Sauce#milliliter(s)',
        amount: '250',
        unit: 'milliliter(s)',
      },
      {
        name: 'Olive Oil for the Salsa',
        ingredientId: 'Olive_Oil_for_the_Salsa#tbsp',
        amount: '1.5',
        unit: 'tbsp',
      },
    ],
    keywords: ['Quick', 'Spicy', 'Date Night'],
    diet: Diet.Meat,
    nutrition: {
      sugarContent: '7.8 g',
      proteinContent: '38.6 g',
      fatContent: '41.9 g',
      calories: '768 kcal',
      carbohydrateContent: '58.7 g',
      saturatedFatContent: '18.1 g',
      servingSize: '585',
      sodiumContent: '5.03 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: 'a) Boil a full kettle.\nb) Pour the boiled water into a large saucepan on medium heat.\nc) Add the noodles and 1/2 tsp salt to the water and cook until tender, 4 mins. \nd) Once cooked, drain in a sieve and run under cold water to stop them sticking together. ',
      },
      {
        type: 'HowToStep',
        text: 'a) Meanwhile, trim the pak choi, then cut into roughly 2cm pieces.\nb) Finely chop the coriander (stalks and all). Zest and quarter the lime (see ingredients for amount).\nc) Crush the peanuts in the unopened sachet using a rolling pin.',
      },
      {
        type: 'HowToStep',
        text: 'a) Heat a drizzle of oil in a large saucepan on medium-high heat.\nb) Add the yellow Thai style paste and cook, stirring, for 1 min.\nc) Stir in the coconut milk, soy sauce, sugar and water for the sauce (see pantry for both amounts).\nd) Bring to a boil, then lower the heat and stir in the peanut butter until well combined. ',
      },
      {
        type: 'HowToStep',
        text: "a) Drain the prawns, then add them to the laksa with the mangetout and pak choi.\nb) Stir well and cook until the prawns are cooked and veg is tender, 5-6 mins. IMPORTANT: Wash your hands and equipment after handling raw prawns. They're cooked when pink on the outside and opaque in the middle.\nc) Meawhile, in a small bowl, combine the coriander, lime zest, peanuts, olive oil for the salsa (see pantry for amount) and a squeeze of lime juice. Set aside your coriander pesto.",
      },
      {
        type: 'HowToStep',
        text: "a) Once the prawns are cooked, stir the cooked noodles into the laksa and heat through until piping hot, 1 min. Add a splash of water if it's a little too thick.\nb) Stir through a good squeeze of lime juice. \nc) Taste and season with pepper and more lime juice if you like.",
      },
      {
        type: 'HowToStep',
        text: 'a) Share your prawn laksa between your bowls and drizzle over the coriander pesto.\nb) Cut any remaining lime into wedges and serve alongside. \nEnjoy!',
      },
    ],
    recipeYield: 2,
  },
  {
    name: 'goats-cheese-and-caramelised-onion-naanizza',
    description:
      "Looking for a quick and tasty midweek dinner option? Try cooking up our Goat's Cheese & Caramelised Onion Naanizza in just 20-25 minutes for a delicious and speedy meal.",
    recipeCuisine: 'British',
    totalTime: 'PT20M',
    recipeCategory: 'main course',
    recipeIngredient: [
      {
        name: 'Baby Spinach',
        ingredientId: 'Baby_Spinach#grams',
        amount: '40',
        unit: 'grams',
      },
      {
        name: "Goat's Cheese",
        ingredientId: "Goat's_Cheese#grams",
        amount: '75',
        unit: 'grams',
      },
      {
        name: 'Plain Naans',
        ingredientId: 'Plain_Naans#unit(s)',
        amount: '2',
        unit: 'unit(s)',
      },
      {
        name: 'Marinara Sauce',
        ingredientId: 'Marinara_Sauce#grams',
        amount: '120',
        unit: 'grams',
      },
      {
        name: 'Grated Hard Italian Style Cheese',
        ingredientId: 'Grated_Hard_Italian_Style_Cheese#grams',
        amount: '20',
        unit: 'grams',
      },
      {
        name: 'Fig Jam',
        ingredientId: 'Fig_Jam#grams',
        amount: '40',
        unit: 'grams',
      },
      {
        name: 'Wild Rocket',
        ingredientId: 'Wild_Rocket#grams',
        amount: '20',
        unit: 'grams',
      },
      {
        name: 'Balsamic Glaze',
        ingredientId: 'Balsamic_Glaze#milliliter(s)',
        amount: '12',
        unit: 'milliliter(s)',
      },
    ],
    keywords: ['Calorie Smart', 'Veggie', 'Quick', 'New'],
    diet: Diet.NonMeat,
    nutrition: {
      sugarContent: '18.8 g',
      proteinContent: '23.1 g',
      fatContent: '21.8 g',
      calories: '624 kcal',
      carbohydrateContent: '82 g',
      saturatedFatContent: '9.1 g',
      servingSize: '295',
      sodiumContent: '2.07 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: 'a) Preheat your oven to 240°C/220°C fan/gas mark 9. Fill and boil your kettle. \nb) Pop the spinach into a colander in your sink. Pour over the boiled water from your kettle until wilted. \nc) Once wilted, squeeze out all of the excess water from the spinach with the back of a spoon. TIP: You may need to do this in batches.',
      },
      {
        type: 'HowToStep',
        text: "a) Crumble the goat's cheese. \nb) Pop the naans onto a baking tray. \nc) Divide the marinara sauce between them and spread out with the back of a spoon, leaving a 1cm border. ",
      },
      {
        type: 'HowToStep',
        text: "a) Sprinkle the hard Italian style cheese evenly over the sauce.\nb) Top each naanizza with the spinach and goat's cheese. \nc) Dollop on the fig jam.",
      },
      {
        type: 'HowToStep',
        text: 'a) When the oven is hot, bake the naanizzas on the top shelf until the cheese is golden and bubbling, 6-7 mins.\n ',
      },
      {
        type: 'HowToStep',
        text: "a) Just before you're ready to serve, add the rocket to a bowl and drizzle with a little olive oil.\nb) Season with salt and pepper. Toss gently to coat.",
      },
      {
        type: 'HowToStep',
        text: "a) When the naanizzas are ready, slide them onto your serving plates and cut in slices if you'd like.\nb) Serve the rocket salad alongside drizzled with the balsamic glaze.\nEnjoy!",
      },
    ],
    recipeYield: 2,
  },
  {
    name: 'speedy-cajun-beef-rigatoni',
    description:
      'Ready in less than 25 minutes, this Speedy Cajun Beef Rigatoni has it all. Punchy and smoky with a spicy kick, Cajun spice mix contains ingredients such as chilli powder, ground cumin, oregano and thyme.',
    recipeCuisine: 'Cajunsk',
    totalTime: 'PT15M',
    recipeCategory: 'main course',
    recipeIngredient: [
      {
        name: 'Rigatoni Pasta',
        ingredientId: 'Rigatoni_Pasta#grams',
        amount: '180',
        unit: 'grams',
      },
      {
        name: 'British Beef Mince',
        ingredientId: 'British_Beef_Mince#grams',
        amount: '240',
        unit: 'grams',
      },
      {
        name: 'Cajun Spice Mix',
        ingredientId: 'Cajun_Spice_Mix#sachet(s)',
        amount: '1',
        unit: 'sachet(s)',
      },
      {
        name: 'Tomato Passata',
        ingredientId: 'Tomato_Passata#carton(s)',
        amount: '1',
        unit: 'carton(s)',
      },
      {
        name: 'Creme Fraiche',
        ingredientId: 'Creme_Fraiche#grams',
        amount: '75',
        unit: 'grams',
      },
      {
        name: 'Chicken Stock Paste',
        ingredientId: 'Chicken_Stock_Paste#grams',
        amount: '10',
        unit: 'grams',
      },
      {
        name: 'Baby Spinach',
        ingredientId: 'Baby_Spinach#grams',
        amount: '40',
        unit: 'grams',
      },
      {
        name: 'Grated Hard Italian Style Cheese',
        ingredientId: 'Grated_Hard_Italian_Style_Cheese#grams',
        amount: '20',
        unit: 'grams',
      },
      {
        name: 'Sugar',
        ingredientId: 'Sugar#tsp',
        amount: '1',
        unit: 'tsp',
      },
      {
        name: 'Water for the Sauce',
        ingredientId: 'Water_for_the_Sauce#milliliter(s)',
        amount: '50',
        unit: 'milliliter(s)',
      },
    ],
    keywords: ['Family Friendly', 'Spicy', 'Quick', 'Bestseller'],
    diet: Diet.Meat,
    nutrition: {
      sugarContent: '10.8 g',
      proteinContent: '44.9 g',
      fatContent: '36.6 g',
      calories: '808 kcal',
      carbohydrateContent: '76.6 g',
      saturatedFatContent: '18.2 g',
      servingSize: '416',
      sodiumContent: '2.11 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: 'a) Boil a full kettle.\nb) Pour the boiled water into a saucepan with 1/2 tsp salt and bring back to the boil. Add the rigatoni to the water and cook until tender, 12 mins.\nc) Once cooked, drain in a colander and pop back in the pan. Drizzle with oil and stir through to stop it sticking together.',
      },
      {
        type: 'HowToStep',
        text: 'a) Meanwhile, heat a large frying pan on medium-high heat (no oil).\nb) Once hot, add the beef mince and fry until browned, 5-6 mins. Use a spoon to break it up as it cooks. IMPORTANT: Wash your hands and equipment after handling raw mince.\nc) When the mince has browned, drain and discard any excess fat. Season with salt and pepper. ',
      },
      {
        type: 'HowToStep',
        text: "a) Add the Cajun spice mix (add less if you'd prefer things milder) to the pan and cook until fragrant, 30 secs.",
      },
      {
        type: 'HowToStep',
        text: 'a) Next, stir in the passata, creme fraiche, chicken stock paste, sugar and water for the sauce (see pantry for both amounts), then bring to the boil.\nb) Once boiling, reduce the heat and simmer until the sauce has thickened, 4-5 mins. IMPORTANT: The mince is cooked when no longer pink in the middle.',
      },
      {
        type: 'HowToStep',
        text: "a) Add the spinach to the pan a handful at a time until wilted and piping hot, 1-2 mins.\nb) Stir through the hard Italian style cheese until melted. Toss the rigatoni through the sauce to coat, 1 min.\nc) Taste and season with salt and pepper if needed. Add a splash of water if it's a little too thick.",
      },
      {
        type: 'HowToStep',
        text: 'a) Share the creamy Cajun rigatoni between your bowls.\nEnjoy!',
      },
    ],
    recipeYield: 2,
  },
  {
    name: 'mediterranean-style-avocado-sunshine-salad',
    description:
      'A bowl of summer sun, this Mediterranean Style Avocado Sunshine Salad is perfect for a balanced or vegetarian lifestyle. Inspired by Greek and Italian cuisines whilst heroing fresh veg, this is sure to hit the spot.',
    recipeCuisine: 'Mediterranean',
    totalTime: 'PT35M',
    recipeCategory: 'main course',
    recipeIngredient: [
      {
        name: 'Potatoes',
        ingredientId: 'Potatoes#grams',
        amount: '450',
        unit: 'grams',
      },
      {
        name: 'Baby Cucumber',
        ingredientId: 'Baby_Cucumber#unit(s)',
        amount: '1',
        unit: 'unit(s)',
      },
      {
        name: 'Bell Pepper',
        ingredientId: 'Bell_Pepper#unit(s)',
        amount: '1',
        unit: 'unit(s)',
      },
      {
        name: 'Avocado',
        ingredientId: 'Avocado#unit(s)',
        amount: '1',
        unit: 'unit(s)',
      },
      {
        name: 'Cider Vinegar',
        ingredientId: 'Cider_Vinegar#milliliter(s)',
        amount: '30',
        unit: 'milliliter(s)',
      },
      {
        name: 'Baby Leaf Mix',
        ingredientId: 'Baby_Leaf_Mix#grams',
        amount: '50',
        unit: 'grams',
      },
      {
        name: 'Greek Style Salad Cheese',
        ingredientId: 'Greek_Style_Salad_Cheese#grams',
        amount: '50',
        unit: 'grams',
      },
      {
        name: 'Pumpkin Seeds',
        ingredientId: 'Pumpkin_Seeds#grams',
        amount: '15',
        unit: 'grams',
      },
      {
        name: 'Pesto',
        ingredientId: 'Pesto#grams',
        amount: '32',
        unit: 'grams',
      },
      {
        name: 'Sugar',
        ingredientId: 'Sugar#tsp',
        amount: '2',
        unit: 'tsp',
      },
      {
        name: 'Olive Oil for the Dressing',
        ingredientId: 'Olive_Oil_for_the_Dressing#tbsp',
        amount: '2',
        unit: 'tbsp',
      },
    ],
    keywords: ['Veggie', 'Calorie Smart', 'New', 'Climate Conscious'],
    diet: Diet.NonMeat,
    nutrition: {
      sugarContent: '11.4 g',
      proteinContent: '14.5 g',
      fatContent: '38.2 g',
      calories: '624 kcal',
      carbohydrateContent: '59.2 g',
      saturatedFatContent: '9.8 g',
      servingSize: '540',
      sodiumContent: '1.29 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: 'Preheat your oven to 220°C/200°C fan/gas mark 7.\nChop the potatoes into 1cm chunks (no need to peel) and pop them onto a large baking tray. Drizzle with oil and season with salt and pepper.\nToss to coat, then spread out in a single layer. TIP: Use two baking trays if necessary.\nWhen the oven is hot, roast on the top shelf until golden, 18-20 mins. Turn halfway through.',
      },
      {
        type: 'HowToStep',
        text: 'Meanwhile, trim the baby cucumber, then halve lengthways. Cut lengthways into roughly 1cm wide strips, then cut into 1cm pieces widthways.\nHalve the bell pepper and discard the core and seeds. Slice into thin strips.',
      },
      {
        type: 'HowToStep',
        text: "When the potatoes have roasted for about 5 mins, remove them from the oven and add the sliced pepper to the tray. \nDrizzle with a little more oil, then toss together with the potatoes. Pop back into the oven and roast for the remaining time, 10-15 mins.\nMeanwhile, halve the avocado and remove the stone. Use a tablespoon to scoop the flesh out onto your board, face-down. Slice lengthways into 1cm thick slices - you'll fan it out later.",
      },
      {
        type: 'HowToStep',
        text: 'In a large bowl, combine the cider vinegar, sugar and olive oil for the dressing (see pantry for both amounts).\nSeason with salt and pepper, then set your dressing aside.',
      },
      {
        type: 'HowToStep',
        text: 'When the potatoes and pepper have roasted, remove them from the oven and allow to cool a little. \nOnce cooled, add the roasted veg to the dressing bowl along with the chopped cucumber and baby leaves.\nToss together, then taste and add more salt and pepper if needed.',
      },
      {
        type: 'HowToStep',
        text: "Share the salad between your serving bowls, then crumble over the Greek style salad cheese and sprinkle with the pumpkin seeds. \nFan the sliced avocado out on top of the salad. Finish by drizzling over the pesto. TIP: Mix the pesto with a little olive oil to get a more drizzling consistency if you'd like.\nEnjoy! ",
      },
    ],
    recipeYield: 2,
  },
  {
    name: 'beef-potato-and-spinach-rogan-josh-curry',
    description:
      'This Beef, Potato and Spinach Rogan Josh Curry is a crowd pleaser and is one to get the family round the dinner table for. Super simple to make, and easily customised to suit the kids too.',
    recipeCuisine: 'Indian',
    totalTime: 'PT20M',
    recipeCategory: 'main course',
    recipeIngredient: [
      {
        name: 'Baking Potato',
        ingredientId: 'Baking_Potato#unit(s)',
        amount: '1',
        unit: 'unit(s)',
      },
      {
        name: 'Garlic Clove',
        ingredientId: 'Garlic_Clove#unit(s)',
        amount: '2',
        unit: 'unit(s)',
      },
      {
        name: 'British Beef Mince',
        ingredientId: 'British_Beef_Mince#grams',
        amount: '240',
        unit: 'grams',
      },
      {
        name: 'Tomato Puree',
        ingredientId: 'Tomato_Puree#grams',
        amount: '30',
        unit: 'grams',
      },
      {
        name: 'Curry Powder Mix',
        ingredientId: 'Curry_Powder_Mix#sachet(s)',
        amount: '1',
        unit: 'sachet(s)',
      },
      {
        name: 'Rogan Josh Curry Paste',
        ingredientId: 'Rogan_Josh_Curry_Paste#grams',
        amount: '50',
        unit: 'grams',
      },
      {
        name: 'Chicken Stock Paste',
        ingredientId: 'Chicken_Stock_Paste#grams',
        amount: '10',
        unit: 'grams',
      },
      {
        name: 'Plain Naans',
        ingredientId: 'Plain_Naans#unit(s)',
        amount: '2',
        unit: 'unit(s)',
      },
      {
        name: 'Peas',
        ingredientId: 'Peas#grams',
        amount: '120',
        unit: 'grams',
      },
      {
        name: 'Sugar for the Sauce',
        ingredientId: 'Sugar_for_the_Sauce#tsp',
        amount: '0.5',
        unit: 'tsp',
      },
      {
        name: 'Water for the Sauce',
        ingredientId: 'Water_for_the_Sauce#milliliter(s)',
        amount: '150',
        unit: 'milliliter(s)',
      },
      {
        name: 'Butter',
        ingredientId: 'Butter#grams',
        amount: '20',
        unit: 'grams',
      },
    ],
    keywords: ['Family Friendly', 'Quick'],
    diet: Diet.Meat,
    nutrition: {
      sugarContent: '13 g',
      proteinContent: '47 g',
      fatContent: '43.2 g',
      calories: '1007 kcal',
      carbohydrateContent: '109.7 g',
      saturatedFatContent: '15 g',
      servingSize: '598',
      sodiumContent: '3.56 g',
    },
    recipeInstructions: [
      {
        type: 'HowToStep',
        text: "a) If you don't have a toaster, heat your oven to 220°C/200°C fan/gas mark 7 for the naans. Boil a full kettle. \nb) Cut the potato into 2cm chunks (no need to peel). Peel and grate the garlic (or use a garlic press).\nc) Once boiled, pour the water into a large saucepan on high heat with 1/2 tsp salt and add the potatoes. Cook until you can easily slip a knife through, 15-18 mins. \nd) Once cooked, drain in a colander. ",
      },
      {
        type: 'HowToStep',
        text: "a) While the potatoes cook, heat a large frying pan on medium-high heat (no oil).\nb) Once hot, add the beef mince. Fry until the mince has browned, 5-6 mins. Use a spoon to break it up as it cooks, then drain and discard any excess fat. \nc) Season with salt and pepper. IMPORTANT: Wash your hands and equipment after handling raw mince. It's cooked when no longer pink in the middle.",
      },
      {
        type: 'HowToStep',
        text: 'a) Once the mince has browned, stir in the garlic, tomato puree, curry powder and rogan josh curry paste. Cook for 1 min.\nb) Stir in the chicken stock paste, sugar and water for the sauce (see pantry for both amounts).\nc) Bring to the boil, then lower the heat and simmer until thickened, 3-4 mins.',
      },
      {
        type: 'HowToStep',
        text: "a) Cut the naans in half widthways, then put in your toaster until golden.b) If you're using the oven, put the naans onto a baking tray. Sprinkle with a little water and pop them into the oven to warm through, 2-3 mins.",
      },
      {
        type: 'HowToStep',
        text: "a) Once the sauce has thickened, stir in the peas.\nb) Gently stir the cooked potatoes through the curry, adding a splash of water if it's a little thick.\nc) Season with salt and pepper, then remove from the heat.",
      },
      {
        type: 'HowToStep',
        text: "a) When everything's ready, spoon the rogan josh curry into your bowls.\nb) Spread the butter (see pantry for amount) over the naans and serve alongside for dipping and scooping.\nEnjoy!",
      },
    ],
    recipeYield: 2,
  },
];

@Injectable()
export class PaletteService {
  constructor(private http: HttpClient) {}

  getRandomRecipes(numberOfRecipes: number): Observable<RandomRecipeDto[]> {
    return of(fakePalette);

    return this.http.get<RandomRecipeDto[]>(
      `${environment.mealPlannerUrl}/meal-planner/random-recipes/${numberOfRecipes}`
    );
  }
}
