let recipes = [];
let filteredRecipes = [];

const searchbar = document.getElementById("searchbar");
const MIN_CHARS_TO_LAUNCH_SEARCH = 3;

const recipeSection = document.getElementById("recipes");

async function getRecipes() {
  const response = await fetch("data/recipes.json");
  recipes = await response.json();
}

function firstLoadingOfRecipes() {
  filteredRecipes = [...recipes];
  displayRecipes();
}

function searchRecipesInSearchbar() {
  closeAllMenus();
  const search = searchbar.value.toLowerCase();
  if (search.length < MIN_CHARS_TO_LAUNCH_SEARCH) {
    filteredRecipes = [...recipes];
  } else {
    filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
      let isMatch = false;
      if (recipes[i].name.toLowerCase().indexOf(search) !== -1) {
        isMatch = true;
      } else if (recipes[i].description.toLowerCase().indexOf(search) !== -1) {
        isMatch = true;
      } else {
        for (let j = 0; j < recipes[i].ingredients.length; j++) {
          if (recipes[i].ingredients[j].ingredient.toLowerCase().indexOf(search) !== -1) {
            isMatch = true;
            break;
          }
        }
      }
      if (isMatch) {
        filteredRecipes.push(recipes[i]);
      }
    }
  }
  //Il est nécessaire de permettre la combinaison des recherches avec les tags et les recherches à l'aide de la barre de recherche
  searchRecipesWithTags();
}

function registerSearchbarEvents() {
  searchbar.addEventListener("input", searchRecipesInSearchbar);
  const searchicon = document.getElementById("searchicon");
  searchicon.onclick = searchRecipesInSearchbar;
}

function displayRecipes() {
  recipeSection.innerHTML = "";
  if (!filteredRecipes.length) {
    console.log(filteredRecipes);
    handleErrorDiv(true);
    return;
  }
  handleErrorDiv(false);
  recipeSection.style.gridTemplateRows = `repeat(${Math.ceil(
    recipes.length / 3
  )}, 365px)`;
  const timerIcon = document.createElement("i");
  timerIcon.classList.add("fa-regular");
  timerIcon.classList.add("fa-clock");
  for (const recipe of filteredRecipes) {
    const recipeCard = getRecipeCard(recipe);
    recipeSection.appendChild(recipeCard);
  }
}

function handleErrorDiv(display) {
  if (display) {
    errorDiv.textContent =
      "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
    recipeSection.style.gridTemplateRows = "unset";
    errorDiv.style.display = "inherit";
  } else {
    errorDiv.style.display = "none";
  }
}

async function init() {
  await getRecipes();
  firstLoadingOfRecipes();
  registerSearchbarEvents();
  registerMenusEvents();
}

init();
