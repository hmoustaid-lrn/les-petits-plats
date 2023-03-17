async function getRecipes() {
    const response = await fetch ('data/recipes.json');
    const recipes = await response.json();
    return recipes;
}

async function displayRecipes(recipes) {
    const recipeSection = document.getElementById('recipes');
    recipeSection.innerHTML = '';
    recipeSection.style.gridTemplateRows = `repeat(${Math.ceil(recipes.length / 3)}, 365px)`
	const timerIcon = document.createElement('i')
	timerIcon.classList.add('fa-regular')
	timerIcon.classList.add('fa-clock')
    for (const recipe of recipes) {
      const recipeCard = getRecipeCard(recipe);
      recipeSection.appendChild(recipeCard);
    }
}

async function init() {
    const { recipes } = await getRecipes();
    displayRecipes(recipes);
}
  
init();