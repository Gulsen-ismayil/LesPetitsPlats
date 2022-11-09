const sectionRecipes = document.getElementById('section-recipe')
const { recipes } = await getDataRecipes()

const query = {
  appliances: 'Appareils',
  ustensils: 'Ustensiles',
  ingredients: 'Ingredients'
}

const ingredientTagList = new Set()
const applianceTagList = new Set()
const ustensilsTagList = new Set()

let ingredientArrayTagList = []
let applianceArrayTagList = []
let ustensilsArrayTagList = []

// get database
async function getDataRecipes () {
  const data = await fetch('data/recipes.json')
  const dataRecipes = await data.json()
  return dataRecipes
}

// section recipes DOM
function recipesFactory (data) {
  const { name, time, ingredients, description } = data
  let liste = ''
  for (let i = 0; i < ingredients.length; i++) {
    liste = liste + `${ingredients[i].ingredient}: ${ingredients[i].quantity || ''}${ingredients[i].unit || ''} <br>`
  }

  function recipesCardDom () {
    const code = `
        <div class="card">
            <div class="image" ></div>
            <div class="content">
                <div class="name-time">
                    <p class="name">${name}</p>
                    <div class="time" >
                         <i class="fa-regular fa-clock"></i>
                         <p class="minute">${time}min</p>
                    </div>
                </div>
                <div class="text" >
                    <p class="detail">${liste}</p>
                    <p class="description">${description}</p>
                </div>
            </div>
        </div>
        `
    sectionRecipes.innerHTML += code
  }
  return { recipesCardDom }
}

// make new recipes list
function displayRecipes (recipes) {
  sectionRecipes.innerHTML = ''
  recipes.forEach(recipe => {
    const factoryRecipes = recipesFactory(recipe)
    factoryRecipes.recipesCardDom()
  })
}

// global search with input
const globalSearch = document.querySelector('.globalSearch')
globalSearch.addEventListener('change', () => { refreshRecipe(recipes) })

refreshRecipe(recipes)

// refresh all the page
function refreshRecipe (recipes) {
  let filteredRecipes = recipes
  if (globalSearch.value.length > 2 || ingredientArrayTagList.length > 0 || applianceArrayTagList.length > 0 || ustensilsArrayTagList.length > 0) {
    filteredRecipes = filterRecipes(recipes)
  }
  displayRecipes(filteredRecipes)

  if (filteredRecipes.length === 0) { // for display the text "any recipes available"
    displayMessageError()
  } else {
    hideMessageError()
  }

  const filterClassAll = document.querySelector('.filterClassAll')
  if (filterClassAll !== null && filterClassAll.className === 'filterClassAll filterClassIngredients') {
    hideListe(filterClassAll, query.ingredients)
  }
  if (filterClassAll !== null && filterClassAll.className === 'filterClassAll filterClassAppliances') {
    hideListe(filterClassAll, query.appliances)
  }
  if (filterClassAll !== null && filterClassAll.className === 'filterClassAll filterClassUstensils') {
    hideListe(filterClassAll, query.ustensils)
  }
  return filteredRecipes
}

//   section: filter by three types
const filterIngredients = document.querySelector('.filterClassIngredients')
const filterApplications = document.querySelector('.filterClassAppliances')
const filterUstensils = document.querySelector('.filterClassUstensils')

filterIngredients.addEventListener('click', filterThreeBloc)
filterApplications.addEventListener('click', filterThreeBloc)
filterUstensils.addEventListener('click', filterThreeBloc)

// display three blocs of elements
function filterThreeBloc (e) {
  if (e.target.tagName === 'INPUT') {
    return
  }
  const filtered = refreshRecipe(recipes)
  const getIngredientsList = getIngredient(filtered)
  const getApplianceList = getAppliance(filtered)
  const getUstensilsList = getUstensils(filtered)

  if (e.target.closest('.filterClassIngredients')) {
    displayfilterThreeBloc(getIngredientsList, filterIngredients, query.ingredients)
    hideListe(filterUstensils, query.ustensils)
    hideListe(filterApplications, query.appliances)
  }
  if (e.target.closest('.filterClassAppliances')) {
    displayfilterThreeBloc(getApplianceList, filterApplications, query.appliances)
    hideListe(filterUstensils, query.ustensils)
    hideListe(filterIngredients, query.ingredients)
  }
  if (e.target.closest('.filterClassUstensils')) {
    displayfilterThreeBloc(getUstensilsList, filterUstensils, query.ustensils)
    hideListe(filterApplications, query.appliances)
    hideListe(filterIngredients, query.ingredients)
  }
}

// DOM for three elements DOM
function displayfilterThreeBloc (listeElement, blocElement, nameElement) {
  const code = ` 
    <div class="divInputThreeBloc">
        <input type="search" class="classInputThreeBloc" placeholder="Rechercher un ${nameElement}">
        <i class="fa-solid fa-angle-up angleUp"></i>
    </div>
    <ul class="listLiThreeBloc"></ul>
  `
  blocElement.innerHTML = code
  blocElement.classList.replace('filter', 'filterClassAll')
  const inputSearchElement = blocElement.querySelector('.classInputThreeBloc')
  inputSearchElement.addEventListener('change', () => {
    const allBlocUl = blocElement.querySelector('ul')
    allBlocUl.innerHTML = ''
    const filteredByElement = listeElement.filter(label => {
      if (label.toLowerCase().includes(inputSearchElement.value.toLowerCase())) {
        return true
      }
      return false
    })

    filteredByElement.forEach(label => {
      const allBlocLi = document.createElement('li')
      allBlocLi.classList.add('allTypeLi')
      allBlocLi.innerText = label
      allBlocUl.appendChild(allBlocLi)
    })
  })

  listeElement.forEach(label => {
    const allBlocUl = blocElement.querySelector('ul')
    const allBlocLi = document.createElement('li')
    allBlocLi.classList.add('allTypeLi')
    allBlocLi.innerText = label
    allBlocUl.appendChild(allBlocLi)

    allBlocLi.addEventListener('click', () => { sectionTag(label, nameElement, blocElement) })
  })
}

// create tags, insert tags by element and close tags

function sectionTag (labelLi, classTag, blocName) {
  const tagIngredientsBloc = document.querySelector('.IngredientsDiv')
  const textTagIngredientsBloc = tagIngredientsBloc.innerText
  const tagAppliancesBloc = document.querySelector('.AppliancesDiv')
  const textTagAppliancesBloc = tagAppliancesBloc.innerText
  const tagUstensilsBloc = document.querySelector('.UstensilsDiv')
  const textTagUstensilsBloc = tagUstensilsBloc.innerText

  const code = `
    <div class="${classTag} tagDiv">
        <p>${labelLi}</p>
        <i class="fa-regular fa-circle-xmark closeTag"></i>
    </div>
    `
  if (textTagIngredientsBloc.includes(labelLi) === false && blocName.className === 'filterClassAll filterClassIngredients') {
    ingredientTagList.add(labelLi)
    tagIngredientsBloc.innerHTML += code
  }
  if (textTagAppliancesBloc.includes(labelLi) === false && blocName.className === 'filterClassAll filterClassAppliances') {
    applianceTagList.add(labelLi)
    tagAppliancesBloc.innerHTML += code
  }
  if (textTagUstensilsBloc.includes(labelLi) === false && blocName.className === 'filterClassAll filterClassUstensils') {
    ustensilsTagList.add(labelLi)
    tagUstensilsBloc.innerHTML += code
  }

  const closeTag = document.querySelectorAll('.closeTag')
  for (let i = 0; i < closeTag.length; i++) {
    let textTag
    closeTag[i].addEventListener('click', (e) => {
      textTag = e.target.closest('.tagDiv').innerText
      e.target.closest('.tagDiv').style.display = 'none'
      if (ingredientTagList.has(textTag)) {
        ingredientTagList.delete(textTag)
        ingredientArrayTagList = Array.from(ingredientTagList)
        refreshRecipe(recipes)
      }
      if (applianceTagList.has(textTag)) {
        applianceTagList.delete(textTag)
        applianceArrayTagList = Array.from(applianceTagList)
        refreshRecipe(recipes)
      }
      if (ustensilsTagList.has(textTag)) {
        ustensilsTagList.delete(textTag)
        ustensilsArrayTagList = Array.from(ustensilsTagList)
        refreshRecipe(recipes)
      }
    })
  }
  ingredientArrayTagList = Array.from(ingredientTagList)
  applianceArrayTagList = Array.from(applianceTagList)
  ustensilsArrayTagList = Array.from(ustensilsTagList)
}

// global filtered function
function filterRecipes (recipes) {
  const text = document.querySelector('.globalSearch').value
  const filteredData = []
  console.log(text)
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i]

    let hasSelectedIngredient = false
    if (ingredientArrayTagList.length === 0) {
      hasSelectedIngredient = true
    }
    for (let j = 0; j < ingredientArrayTagList.length; j++) {
      const selectedIngredient = ingredientArrayTagList[j]
      if (recipe.ingredients.some(({ ingredient }) => ingredient === selectedIngredient)) {
        hasSelectedIngredient = true
      }
    }

    let hasSelectedAppliance = false
    if (applianceArrayTagList.length === 0) {
      hasSelectedAppliance = true
    }
    for (let k = 0; k < applianceArrayTagList.length; k++) {
      const selectedAppliance = applianceArrayTagList[k]
      if (recipe.appliance === selectedAppliance) {
        hasSelectedAppliance = true
      }
    }

    let hasSelectedUstensils = false
    if (ustensilsArrayTagList.length === 0) {
      hasSelectedUstensils = true
    }
    for (let h = 0; h < ustensilsArrayTagList.length; h++) {
      const selectedUstensils = ustensilsArrayTagList[h]
      if (recipe.ustensils.some(ustensil => ustensil === selectedUstensils)) {
        hasSelectedUstensils = true
      }
    }
    if ((recipe.name.toLowerCase().includes(text.toLowerCase()) ||
    recipe.description.toLowerCase().includes(text.toLowerCase()) ||
    recipe.ingredients.includes(text.toLowerCase())) &&
    hasSelectedIngredient && hasSelectedAppliance && hasSelectedUstensils
    ) {
      filteredData.push(recipe)
    }
    console.log(hasSelectedIngredient, hasSelectedAppliance, hasSelectedUstensils)
  }
  // const filteredData = recipes.filter((recipe) => {
  //   const hasSelectedIngredient = ingredientArrayTagList.every(selectedIngredient => {
  //     return recipe.ingredients.some((ingredient) => {
  //       if (ingredient.ingredient === selectedIngredient) {
  //         return true
  //       } else {
  //         return false
  //       }
  //     })
  //   })
  //   const hasSelectedAppliance = applianceArrayTagList.every(selectedAppliance => {
  //     if (recipe.appliance === selectedAppliance) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   })
  //   const hasSelectedUstensils = ustensilsArrayTagList.every(selectedUstensils => {
  //     return recipe.ustensils.some((ustensil) => {
  //       if (ustensil === selectedUstensils) {
  //         return true
  //       } else {
  //         return false
  //       }
  //     })
  //   })

  //   if ((recipe.name.toLowerCase().includes(text.toLowerCase()) ||
  //   recipe.description.toLowerCase().includes(text.toLowerCase()) ||
  //   recipe.ingredients.some(({ ingredient }) => { // un objet . si non on peut ecrire aussi : ingredient => { return ingredient.ingredient.includes()}
  //     if (ingredient.toLowerCase().includes(text.toLowerCase())) {
  //       return true
  //     }
  //     return false
  //   })
  //   ) && hasSelectedIngredient && hasSelectedAppliance && hasSelectedUstensils
  //   ) {
  //     return true
  //   }
  //   return false
  // })
  console.log(filteredData)
  return filteredData
}
// hide three blocs element
function hideListe (element, query) {
  element.classList.replace('filterClassAll', 'filter')
  const code = `
    <p>${query}</p>
    <i class="fa-solid fa-angle-down angleDown"></i>
    `
  element.innerHTML = code
}

// get ingredient list
function getIngredient (recipes) {
  const arrayIngredientBeforeSet = []
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredientElement => {
      arrayIngredientBeforeSet.push(ingredientElement.ingredient)
    })
  })
  const objectNameIngredient = new Set(arrayIngredientBeforeSet) // creer nouveau tableau without doublont
  const arrayIngredientAfterSet = Array.from(objectNameIngredient)
  return arrayIngredientAfterSet
}

// get appliance list
function getAppliance (recipes) {
  const arrayApplianceBeforeSet = []
  recipes.forEach(recipe => {
    arrayApplianceBeforeSet.push(recipe.appliance)
  })
  const objectNameAppliance = new Set(arrayApplianceBeforeSet)
  const arrayApplianceAfterSet = Array.from(objectNameAppliance)
  return arrayApplianceAfterSet
}

// get ustensils list
function getUstensils (recipes) {
  const arrayUstensilsBeforeSet = []
  recipes.forEach(recipe => {
    recipe.ustensils.forEach(ustensil => {
      arrayUstensilsBeforeSet.push(ustensil)
    })
  })
  const objectNameUstensils = new Set(arrayUstensilsBeforeSet)
  const arrayUstensilsAfterSet = Array.from(objectNameUstensils)
  return arrayUstensilsAfterSet
}

// function : display message when we get any recipes
function displayMessageError () {
  const code = `
    <p class="anyrecipes">Aucune recette ne correspond à votre critère...</p>
    `
  const divMessageError = document.querySelector('.divMessageError')
  divMessageError.innerHTML = code
}

function hideMessageError () {
  const divMessageError = document.querySelector('.divMessageError')
  divMessageError.innerHTML = ''
}
