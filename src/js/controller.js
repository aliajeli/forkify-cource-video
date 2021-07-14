import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// import icons from '../img/icons.svg'

// polyfills async/await
import 'regenerator-runtime/runtime';
// polyfills every thing else
import 'core-js/stable';

// console.log(icons);

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //   Get the Hash from url
    const id = window.location.hash.slice(1);
    //  console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    //  Update Results view to mark selected search View
    resultsView.update(model.getSearchResultsPage());
    //  updating bookmarks View
    bookmarksView.update(model.state.bookmarks);
    //  console.log(model.state.recipe);
    await model.loadRecipe(id);
    //  console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    //  console.log(state.recipe);
  } catch (error) {
    //  console.log(error);
    recipeView.renderError();
    console.log(error);
  }
};
// controlRecipes();

const controlSearchResults = async function () {
  try {
    //   Get Search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    //   Load search results
    await model.loadSearchResults(query);
    //   Render results
    //  resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //   Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //   Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //   Render New pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //   update the recipes servings ( in state )
  model.updateServings(newServings);
  //   update the recipe View
  //   recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //   Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //   Update recipe View
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //   Show loading spinner
    addRecipeView.renderSpinner();
    console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //   Render Recipe
    recipeView.render(model.state.recipe);

    //   Success message
    addRecipeView.renderMessage();

    //   Render the bookmark View
    bookmarksView.render(model.state.bookmarks);

    //   Change ID in url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //   Close form window
    setTimeout(function () {
      addRecipeView.toggleWindows();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }

  // upload the new recipe data
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  // controlServings();
};
init();
// window.addEventListener('load', controlRecipes);
