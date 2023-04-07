let recipes = []
let filteredRecipes = []
let ingredientsTags = []
let appliancesTags = []
let ustensilsTags = []
let targetTagsArray
let searchedTags = {
	ingredient: [],
	appliance: [],
	ustensil: [],
}
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
    searchRecipesWithTags()
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


/* Cette fonction extrait des tags uniques (non-répétés) à partir des recettes et les trie par ordre alphabétique.
* La méthode Set est utilisée pour filtrer les tags en doublon, et l'opérateur de décomposition ... est utilisé pour convertir le Set en un tableau. Enfin, * la méthode sort est utilisée pour trier les tags par ordre alphabétique.
*/
function extractTags(){
   ingredientsTags = [...new Set(filteredRecipes.map(({ ingredients }) => capitalizeFirstLetter(ingredients[0].ingredient)))].sort();
   appliancesTags = [...new Set(filteredRecipes.map(({ appliance }) => capitalizeFirstLetter(appliance)))].sort();
   ustensilsTags = [...new Set(filteredRecipes.flatMap(({ ustensils }) => ustensils.map(ustensil => capitalizeFirstLetter(ustensil))))].sort();
   targetTagsArray = {
    ingredients: ingredientsTags,
    appliances: appliancesTags,
    ustensils: ustensilsTags
   }
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
        chevron.onclick = closeTarget
    }
}

function openMenu({ target }) {
    closeAllMenus()
    if(target.hasAttribute("id")){
        target = target
    }else{
        target = target.parentNode
    }
    const menu = document.querySelector(`#${target.id}`)
	menu.style.display = 'none'
    const menu_input = document.querySelector(`#${target.id}_input`)
    menu_input.style.display = 'block'
    const selector = `#${target.id}_list`
    extractTags()
    displayTags(selector, targetTagsArray[`${target.id}`])
}

function closeTarget({ target }) {
    const menuInput =  target.parentElement.parentElement
    closeMenuInput(menuInput)
    
}

function closeMenuInput(menuInput){
    const menuString = menuInput.id.split("_")[0]
    const menu = document.querySelector(`#${menuString}`)
    menuInput.removeAttribute('style');
	menu.style.display = 'block'
    menuInput.querySelector("input").value = ''
}

function closeAllMenus(){
    const ingredients_input = document.querySelector("#ingredients_input")
    const appliances_input = document.querySelector("#appliances_input")
    const ustensils_input = document.querySelector("#ustensils_input")
    const menus_input = [ingredients_input, appliances_input, ustensils_input]
    for(let menu_input of menus_input){
        closeMenuInput(menu_input)
    }
}

// Cette fonction est la responsable de créer les tags pour chaque menu
function displayTags(selector, tagsArray){
    const list = document.querySelector(selector);
    list.innerHTML = '';
    tagsArray.forEach(tag => createTagElement(tag, list));
}

function createTagElement(tag, listEl) {
    const tagElement = document.createElement('li')
    tagElement.textContent = tag
    listEl.appendChild(tagElement)
    tagElement.onclick = () => {
        const menuString = listEl.id.split("s_")[0]
        addTag(menuString, tag)
        closeAllMenus()
    }
}

// Cette fonction est responsable d'ajouter ou de supprimer les tags à la filtration
function addTag(name, value) {
    const isValueIncluded = Object.values(searchedTags).some(array => array.includes(value.toLowerCase()));
    if (isValueIncluded){
        return;
    }
	searchedTags[name].push(value.toLowerCase())
	const newTag = document.createElement('div')
	const tagName = document.createElement('span')
	const removeTag = document.createElement('i')
	newTag.classList.add('tag')
	newTag.classList.add(name)
	tagName.textContent = value
	removeTag.classList.add('fa-regular')
	removeTag.classList.add('fa-circle-xmark')
	removeTag.onclick = () => {
		searchedTags[name].splice(searchedTags[name].indexOf(value.toLowerCase()), 1)
		newTag.remove()
		searchRecipes()
	}
	tags.appendChild(newTag)
	newTag.appendChild(tagName)
	newTag.appendChild(removeTag)
	searchRecipesWithTags()
}

function searchRecipesWithTags() {
	if (!searchedTags.ingredient.length && !searchedTags.appliance.length && !searchedTags.ustensil.length) {
		return displayRecipes()
	} else {
		filteredRecipes = filteredRecipes.filter(recipe => (
            (!searchedTags.ingredient.length || searchedTags.ingredient.every(ingredient => recipe.ingredients.some(item => item.ingredient.toLowerCase() === ingredient.toLowerCase()))) &&
            (!searchedTags.appliance.length || searchedTags.appliance.includes(recipe.appliance.toLowerCase())) &&
            (!searchedTags.ustensil.length || searchedTags.ustensil.every(ustensil => recipe.ustensils.map(item => item.toLowerCase()).includes(ustensil.toLowerCase())))
          )); 
	}
	displayRecipes()
}
function searchTags(event){
    const inputValue = event.target.value.toLowerCase();
    const targetArray = {
        ingredient: ingredientsTags,
        appliance: appliancesTags,
        ustensil: ustensilsTags
    }
    const foundElements = targetArray[`${event.target.name}`].filter(element => element.toLowerCase().includes(inputValue))
    const selector = `#${event.target.name}s_list`
    displayTags(selector, [...foundElements])
}

async function init() {
    await getRecipes();
    registerMenusEvents()
    searchRecipes();
    registerSearchbarEvents()
}
  
init();