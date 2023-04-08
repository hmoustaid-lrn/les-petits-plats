let recipes = []
let filteredRecipes = []

const searchbar = document.getElementById("searchbar")
const MIN_CHARS_TO_LAUNCH_SEARCH = 3

async function getRecipes() {
    const response = await fetch ('data/recipes.json');
    recipes = await response.json();
}

function firstLoadingOfRecipes(){
    filteredRecipes = [...recipes]
    displayRecipes()
}

function searchRecipesInSearchbar() {
	const search = searchbar.value.toLowerCase()
	if (search.length < MIN_CHARS_TO_LAUNCH_SEARCH) {
		filteredRecipes = [...recipes]
	} else {
		filteredRecipes = [];
		for (let recipe of recipes) {
			if (recipe.name.toLowerCase().includes(search) || recipe.ingredients.find((ing) => ing.ingredient.toLowerCase().includes(search)) || recipe.description.toLowerCase().includes(search)) {
				filteredRecipes.push(recipe)
			}
		}
	
	}
    //Il est nécessaire de permettre la combinaison des recherches avec les tags et les recherches à l'aide de la barre de recherche
    searchRecipesWithTags()
}

function registerSearchbarEvents(){
    searchbar.addEventListener('input', searchRecipesInSearchbar)
    const searchicon = document.getElementById("searchicon")
	searchicon.onclick = searchRecipesInSearchbar
}

function displayRecipes() {
    const recipeSection = document.getElementById('recipes');
    recipeSection.innerHTML = '';
    recipeSection.style.gridTemplateRows = `repeat(${Math.ceil(recipes.length / 3)}, 365px)`
	const timerIcon = document.createElement('i')
	timerIcon.classList.add('fa-regular')
	timerIcon.classList.add('fa-clock')
    for (const recipe of filteredRecipes) {
      const recipeCard = getRecipeCard(recipe);
      recipeSection.appendChild(recipeCard);
    }
}

async function init() {
    await getRecipes()
    firstLoadingOfRecipes()
    registerSearchbarEvents()
    registerMenusEvents()
}
  
init();