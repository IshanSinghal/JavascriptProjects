import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients; 
            //console.log(res);
            //this.result =          
        } catch (error) {
            console.log(error);
            console.log('Something went wrong');
        }
    }

    calcTime() {
        //Prep time: Assume we need 15 mins for every 3 ingredients 
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {
            //uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //Parse ingredient into count, unit and intgredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //unit exists
                //4 1/2 cups, arrCount is [4, 1/2] --> 4.5 cups
                //4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex); 
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-','+')); 
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                };
            } else if(parseInt(arrIng[0] ,10)) {
                //no unit, but 1st element is number: 1 bread
                objIng = {
                    count: parseInt(arrIng[0] ,10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if (unitIndex === -1) {
                //no unit and no number is 1st element
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

        return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

         //ingredients
        this.ingredients.forEach(ing => {
            ing.count = Math.round( 10000 * ing.count * ( newServings / this.servings )) / 10000;
        });

        this.servings = newServings;
    }

}