import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/**Global state of the app
 * - Search object
 * - current recipe of object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1)get query from view
    const query = searchView.getInput();
    //const query = 'pizza';
    if (query) {
        // 2)New search object and add to state
        state.search = new Search(query);

        // 3)Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
        // 4)Search for recipes
        await state.search.getResults();

        // 5)Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        } catch(err) {
            alert('Error obtaining search results...');
            console.log(err);   
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    

    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected recipe
        if(state.search) searchView.highlightSelected(id);

        //Create new Recipe object
        state.recipe = new Recipe(id);

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            //Calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLike(id));

        } catch (err) {
            console.log(err);
            alert('Error obtaining recipe !');
        }
    }
};

/**
 * LIST CONTROLLER
 */

const controlList = () => {
    // create new list if none yet
    if (!state.list) state.list = new List();

    //Add each ingredient to list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient); //list
        listView.renderItem(item); //UI
    });
};


// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from UI
        listView.deleteItem(id);
        //delete from state
        state.list.deleteItem(id);
    } else if (e.target.matches('.shopping__count--value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
    // create new list if none yet
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;

                                                                     
    if (!state.likes.isLike(currentID)) { //User has not yet liked the recipe --> Add to likes
        //Add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );

        //Toggle like button
        likesView.toggleLikeBtn(true);

        //Add to liked list UI
        likesView.renderLike(newLike);

    } else { // Already likes recipe --> so now unlike it
        //Remove from like to state
        state.likes.deleteLike(currentID);

        //Toggle like button
        likesView.toggleLikeBtn(false);

        //Remove from liked list UI
        likesView.deleteLike(currentID);
    } 
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

});


//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease servings
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase servings
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add recipe ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
});
















