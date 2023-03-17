function getRecipeCard(data) {
    const { id, name, servings, ingredients, time, description, appliance, ustensils } = data

    const recipeArticle = document.createElement('article')
    recipeArticle.classList.add('recipe')

    const recipeImg = document.createElement('div')
    const recipeContent = document.createElement('div')
    const recipeTop = document.createElement('div')

    const recipeTitle = document.createElement('h2')
    recipeTitle.textContent = name

    const timerIcon = document.createElement('i')
	timerIcon.classList.add('fa-regular')
	timerIcon.classList.add('fa-clock')
    const recipeTimeDiv = document.createElement('div')
    recipeTimeDiv.classList.add('time')
    const recipeTimeText = document.createElement('span')
    recipeTimeText.textContent = time + ' min'

    const recipeBottom = document.createElement('div')

    const recipeIngredients = getIngredients(ingredients)

    const recipeDescriptionDiv = document.createElement('div')
    const recipeDescription = document.createElement('p')
    recipeDescription.classList.add('description')
    recipeDescription.textContent = description

    recipeContent.appendChild(recipeTop)
    recipeContent.appendChild(recipeBottom)
    recipeTop.appendChild(recipeTitle)
    recipeTop.appendChild(recipeTimeDiv)
    recipeTimeDiv.appendChild(timerIcon.cloneNode())
    recipeTimeDiv.appendChild(recipeTimeText)
    recipeBottom.appendChild(recipeIngredients)
    recipeBottom.appendChild(recipeDescriptionDiv)
    recipeDescriptionDiv.appendChild(recipeDescription)
    recipeArticle.appendChild(recipeImg)
    recipeArticle.appendChild(recipeContent)

    return recipeArticle;
}


function getIngredients(ingredients) {
    const recipeIngredients = document.createElement('div')
    recipeIngredients.classList.add('list-of-ingredients')
    for(const ing of ingredients){
        const ingredientElement = document.createElement('p')
        ingredientElement.classList.add('ingredient')
        const name = document.createElement('span')
        name.classList.add('name')
        name.textContent = ing.ingredient + ': '
        const quantity = document.createElement('span')
        quantity.textContent = ing.unit ? `${ing.quantity} ${ing.unit}` : ing.quantity
        ingredientElement.appendChild(name)
        ingredientElement.appendChild(quantity)
        recipeIngredients.appendChild(ingredientElement)
    }
    return recipeIngredients
}