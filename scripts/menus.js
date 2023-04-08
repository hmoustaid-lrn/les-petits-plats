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