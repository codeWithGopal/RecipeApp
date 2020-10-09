import Search from './models/Search'; // import from Search.js
import * as searchView from './views/searchView'; // import from searchView.js
import { elements, renderLoader, clearLoader, elementStrings } from './views/base'; // Import from base.js


/* Global state of the app

*- Search Object 
*- recipe object 
*-shopping lits object 
*- Liked recipes 
*/

// The state object is enpty, so whenever we refresh the page then it should be fine for our app
const state = {};

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
        await state.search.getResults();

        //5. Render thre results on UI

        clearLoader(); // remove the loader so when data loads
        searchView.renderResults(state.search.results);


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
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
        console.log(goToPage);
    }
});