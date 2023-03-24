let recipes = []
let filteredRecipes = []
const searchbar = document.getElementById("searchbar")


async function getRecipes() {
    const response = await fetch ('data/recipes.json');
    recipes = await response.json();
}

function searchRecipes() {
	const search = searchbar.value.toLowerCase()
	if (!search || !search.length) {
		filteredRecipes = [...recipes]
	} else {
		filteredRecipes = [];
		for (let recipe of recipes) {
			if (recipe.name.toLowerCase().includes(search) || recipe.ingredients.find((ing) => ing.ingredient.toLowerCase().includes(search)) || recipe.description.toLowerCase().includes(search)) {
				filteredRecipes.push(recipe)
			}
		}
	
	}
    displayRecipes();
}

function registerSearchbarEvents(){
    searchbar.addEventListener('input', searchRecipes)
    const searchicon = document.getElementById("searchicon")
	searchicon.onclick = searchRecipes
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
    await getRecipes();
    searchRecipes();
    registerSearchbarEvents()
}
  
init();