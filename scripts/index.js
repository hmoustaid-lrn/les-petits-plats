let recipes = []
let filteredRecipes = []
let ingredientsTags = []
let appliancesTags = []
let ustensilsTags = []
const searchbar = document.getElementById("searchbar")

async function getRecipes() {
    const response = await fetch ('data/recipes.json');
    recipes = await response.json();
    extractTags()
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
    displayTags()
}


/* Cette fonction extrait des tags uniques (non-répétés) à partir des recettes et les trie par ordre alphabétique.
* La méthode Set est utilisée pour filtrer les tags en doublon, et l'opérateur de décomposition ... est utilisé pour convertir le Set en un tableau. Enfin, * la méthode sort est utilisée pour trier les tags par ordre alphabétique.
*/
function extractTags(){
   ingredientsTags = [...new Set(recipes.flatMap(recipe => recipe.ingredients.map(ingredient => capitalizeFirstLetter(ingredient.ingredient))))].sort();
   appliancesTags = [...new Set(recipes.map(recipe => capitalizeFirstLetter(recipe.appliance)))].sort();
   ustensilsTags = [...new Set(recipes.flatMap(recipe => recipe.ustensils.map(ustensil => capitalizeFirstLetter(ustensil))))].sort();
   function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

/* Cette fonction est la responsable d'afficher le menu des tags correspondant quand le flêche vers le bas est cliqué
* Quand le flêche vers le haut est cliqué le menu se ferme
*/
function registerMenusEvents(){
    const ingredients = document.querySelector("#ingredients")
    const appliances = document.querySelector("#appliances")
    const ustensils = document.querySelector("#ustensils")
    const elements = [ingredients, appliances, ustensils];
    for (let element of elements) {
        element.onclick = openMenu
    }
    const chevrons = document.querySelectorAll('.fa-chevron-up');
    for (let chevron of chevrons) {
        chevron.onclick = closeMenu
    }
}

function openMenu({ target }) {
    if(target.hasAttribute("id")){
        target = target
    }else{
        target = target.parentNode
    }
    const menu = document.querySelector(`#${target.id}`)
	menu.style.display = 'none'
    const menu_input = document.querySelector(`#${target.id}_input`)
    menu_input.style.display = 'block'
}

function closeMenu({ target }) {
    const menu_input =  target.parentElement.parentElement
    const menuString = menu_input.id.split("_")[0]
    const menu = document.querySelector(`#${menuString}`)
    menu_input.removeAttribute('style');
	menu.style.display = 'block'
}

// Cette fonction est la responsable de créer les tags pour chaque menu
function displayTags(){
    const ingredients_input = document.querySelector("#ingredients_input")
    const ingredients_list = document.querySelector("#ingredients_list")
    ingredientsTags.forEach((ingredient) => {
        createTagElement(ingredient, ingredients_list)
    })
    const appliances_input = document.querySelector("#appliances_input")
    const appliances_list = document.querySelector("#appliances_list")
    appliancesTags.forEach((appliance) => {
        createTagElement(appliance, appliances_list)
    })
    const ustensils_input = document.querySelector("#ustensils_input")
    const ustensils_list = document.querySelector("#ustensils_list")
    ustensilsTags.forEach((ustensil) => {
        createTagElement(ustensil, ustensils_list)
    })
}

function createTagElement(tag, listEl) {
    const tagElement = document.createElement('li')
    tagElement.textContent = tag
    listEl.appendChild(tagElement)
}

async function init() {
    await getRecipes();
    registerMenusEvents()
    searchRecipes();
    registerSearchbarEvents()
}
  
init();