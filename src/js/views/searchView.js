import { elements } from './base';

// To get the value from the search input 
export const getInput = () => elements.searchInput.value;

// A function to clear input 
export const clearInput = () => {
    elements.searchInput.value = '';
};

// clear the results from the previous search
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

//hight selected recipe

export const highlightSelecetd = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

// A function to limit the recipe title
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);

            }
            return acc + cur.length;
        }, 0);

        //return the result

        return `${newTitle.join(' ')}...`;
    }

    return title;
};

// A function to render a recipe 
const renderRecipe = recipe => {

    const markup = `
      <li>
          <a class="results__link" href="#${recipe.recipe_id}">
             <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
             </figure>
               <div class="results__data">
                   <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                   <p class="results__author">${recipe.publisher}</p>
               </div>
          </a>
       </li>`;

    elements.searchResList.insertAdjacentHTML('beforeend', markup); // put the element before the end of the result list class element
};

// type: 'prev' or 'next'
// A function to create a button 
const createButton = (page, type) => `  
            <button class="btn-inline results__btn--${type}" data-goto= ${type === 'prev' ? page - 1 : page + 1}>  
                <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                </svg>
            </button>
`;


// A function to render the buttons for the result
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage); // to get the total number of pages 

    let button;

    if (page === 1 && pages > 1) {
        //only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // both buttons
        button = `
                    ${createButton(page, 'prev')}
                    ${createButton(page,'next')}
        `;
    } else if (page === pages && pages > 1) {
        //only button to go to previous page
        button = createButton(page, 'prev');
    }

    elements.searchResList.insertAdjacentHTML('beforeend', button);
};


// Function to render the each of the recipe from results 
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of the current page

    const start = (page - 1) * resPerPage; // e.g (1-1)*10 = 0, (2-1)*10=10
    const end = page * resPerPage; // 1*10 = 10; 2*10= 20;

    recipes.slice(start, end).forEach(renderRecipe);
    // render the pagination button 
    renderButtons(page, recipes.length, resPerPage);

};