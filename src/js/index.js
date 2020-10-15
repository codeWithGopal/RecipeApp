import Search from './models/Search'; // import from Search.js
import * as searchView from './views/searchView'; // import from searchView.js
import { elements, renderLoader, clearLoader, elementStrings } from './views/base'; // Import from base.js
import Recipe from './models/Recipe'; // Import from Recipe.js
import List from './models/List'; // Import form List.js
import * as recipeView from './views/recipeView'; // import from recipeView.js
import * as listView from './views/listView'; // import from listView.js


/* Global state of the app

*- Search Object 
*- recipe object 
*-shopping lits object 
*- Liked recipes 
*/

/*
SEARCH CONTROLLER
*/

// The state object is enpty, so whenever we refresh the page then it should be fine for our app
const state = {};
window.state = state; // This for the testing

const controlSearch = async() => {

    //1. Get a query from the view

    const query = searchView.getInput(); // get a value of query by using getInput method from searchView.js
    console.log(query);

    if (query) {

        //2. New search object and add to state

        state.search = new Search(query);

        //3.Preparing UI for results 
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes); // insert the loader while data is loading

        //4. Search for recipes 
        try {
            await state.search.getResults();

            //5. Render the results on UI

            clearLoader(); // remove the loader so when data loads
            searchView.renderResults(state.search.results);


        } catch (error) {
            alert('something wrong with the search');
            clearLoader();
        }


    }


};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});





// use the concept of the event delegation to add the event handler for the buttons

elements.searchResList.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // go on the page
        searchView.clearResults(); // clear the results before render new results
        searchView.renderResults(state.search.results, goToPage); // render the results
        console.log(goToPage);
    }
});

/*
RECIPE CONTROLLER
*/

const controlRecipe = async() => {
    //Get ID from the url 
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //Prepare the UI for chages
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight Seletced search item 

        if (state.search) searchView.highlightSelecetd(id);


        //Create a new recipe objets

        state.recipe = new Recipe(id);
        console.log(state.recipe); // to test and check in console

        try {
            //Get recipe data and parse ingreients

            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();


            // calculate the servings and time 

            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe

            clearLoader();
            recipeView.renderRecipe(state.recipe);


        } catch (error) {
            alert("Error processing recipe!");
        }

    }

};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/***
 * List Controller
 */

const controlList = () => {

    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingreident to the list and UI

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });


};


// Handle delete and update list item events

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {

        // detele from the state
        state.list.deleteItem(id);


        // delete from UI
        listView.deleteItem(id);
        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {

        //Decrease button is clicked 
        if (state.recipe.servings > 1) {

            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);

        }


    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();



    }

    // console.log(state.recipe);

});


window.l = new List();