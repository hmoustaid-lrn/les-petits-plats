let ingredientsTags = []
let appliancesTags = []
let ustensilsTags = []
let targetTagsArray
let searchedTags = {
	ingredient: [],
	appliance: [],
	ustensil: [],
}

/* Cette fonction extrait des tags uniques (non-répétés) à partir des recettes et les trie par ordre alphabétique.
* La méthode Set est utilisée pour filtrer les tags en doublon, et l'opérateur de décomposition ... est utilisé pour convertir le Set en un tableau. Enfin, * la méthode sort est utilisée pour trier les tags par ordre alphabétique.
*/
function extractTags(){
    ingredientsTags = [
        ...new Set(
            filteredRecipes
                .flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()))
                .map(ingredient => capitalizeFirstLetter(ingredient))
        )
    ].sort();    
    appliancesTags = [
        ...new Set(
            filteredRecipes
                .map(({ appliance }) => appliance.toLowerCase())
                .map(appliance => capitalizeFirstLetter(appliance))
        )
    ].sort();
    
    ustensilsTags = [
        ...new Set(
            filteredRecipes
                .flatMap(({ ustensils }) => ustensils.map(ustensil => ustensil.toLowerCase()))
                .map(ustensil => capitalizeFirstLetter(ustensil))
                
        )
    ].sort();    
    targetTagsArray = {
     ingredients: ingredientsTags,
     appliances: appliancesTags,
     ustensils: ustensilsTags
    }
    function capitalizeFirstLetter(string) {
     return string.charAt(0).toUpperCase() + string.slice(1);
   }
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
		searchRecipesInSearchbar()
	}
	tags.appendChild(newTag)
	newTag.appendChild(tagName)
	newTag.appendChild(removeTag)
	searchRecipesWithTags()
}

// Cette fonction est la responsable de créer les tags pour chaque menu
function displayTags(selector, tagsArray){
    const list = document.querySelector(selector);
    list.innerHTML = '';
    tagsArray.forEach(tag => createTagElement(tag, list));
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

function tagsSearchbar(event){
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