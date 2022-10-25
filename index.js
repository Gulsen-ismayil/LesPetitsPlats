const sectionRecipes = document.getElementById('section-recipe');
const { recipes } = await getDataRecipes();


const query = {
    appliances: 'Appareils',
    ustensils: 'Ustensiles',
    ingredients: 'Ingredients'
}

let ingredientTagList = new Set();
let applianceTagList = new Set();
let ustensilsTagList = new Set();

var ingredientArrayTagList = [];
var applianceArrayTagList = [];
var ustensilsArrayTagList = [];

// retrieve data
async function getDataRecipes() {
    const data = await fetch('data/recipes.json');
    const dataRecipes = await data.json()
    return dataRecipes;
}

// recipes html,displayrecipes 
function recipesFactory(data) {
    const { name, time, ingredients, description } = data
    let liste = ''
    for (let i = 0; i < ingredients.length; i++) {
        liste = liste + `${ingredients[i].ingredient}: ${ingredients[i].quantity || ''}${ingredients[i].unit || ''} <br>`
    }

    function recipesCardDom() {
        let code = `
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
        sectionRecipes.innerHTML += code;
    }
    return { recipesCardDom }
}

function displayRecipes(recipes) {
    sectionRecipes.innerHTML = ''
    recipes.forEach(recipe => {
        const factoryRecipes = recipesFactory(recipe)
        factoryRecipes.recipesCardDom();
    });
}

// global search baar
let inputSearch = document.querySelector('.input-search');
inputSearch.addEventListener('change', () => { refreshRecipe(recipes) })

refreshRecipe(recipes);

function refreshRecipe(recipes) {
    let filteredRecipes = recipes;
    if (inputSearch.value.length > 2 || ingredientArrayTagList.length > 0 || applianceArrayTagList.length > 0 || ustensilsArrayTagList.length > 0) {
        filteredRecipes = filterRecipes(recipes)
    }
    displayRecipes(filteredRecipes)

    if (filteredRecipes.length === 0) {    //for display the text "any recipes available"
        displayMessageError()
    } else {
        hideMessageError()
    }

    const filterClassAll = document.querySelector('.filterClassAll');
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


//   section filter by three type
const filterIngredients = document.querySelector('.filterClassIngredients');
const filterApplications = document.querySelector('.filterClassAppliances');
const filterUstensils = document.querySelector('.filterClassUstensils');

filterIngredients.addEventListener('click', filterClick);
filterApplications.addEventListener('click', filterClick);
filterUstensils.addEventListener('click', filterClick);

// display by theme
function filterClick(e) {
    if (e.target.tagName == 'INPUT') {
        return
    }
    const filtered = refreshRecipe(recipes);
    const getRecipeIngredient = getIngredient(filtered);
    const getRecipeAppliance = getAppliance(filtered);
    const getRecipeUstensils = getUstensils(filtered);
    // console.log(e);
    if (e.target.closest('.filterClassIngredients')) {
        displayFilterClick(getRecipeIngredient, filterIngredients, query.ingredients)
        hideListe(filterUstensils, query.ustensils);
        hideListe(filterApplications, query.appliances);
    }
    if (e.target.closest('.filterClassAppliances')) {
        displayFilterClick(getRecipeAppliance, filterApplications, query.appliances)
        hideListe(filterUstensils, query.ustensils);
        hideListe(filterIngredients, query.ingredients);
    }
    if (e.target.closest('.filterClassUstensils')) {
        displayFilterClick(getRecipeUstensils, filterUstensils, query.ustensils)
        hideListe(filterApplications, query.appliances);
        hideListe(filterIngredients, query.ingredients);
    }
}

// DOM for three differente type
function displayFilterClick(listeByType, DOMFilterClick, labelPlaceHolder) {
    const code = ` 
    <div class="bloc-allType">
        <input type="search" class="input-allType" placeholder="Rechercher un ${labelPlaceHolder}">
        <i class="fa-solid fa-angle-up angleUp"></i>
    </div>
    <ul class="card-allType"></ul>
    `
    DOMFilterClick.innerHTML = code;
    DOMFilterClick.classList.replace('filter', 'filterClassAll');
    const searchType = DOMFilterClick.querySelector('.input-allType');
    searchType.addEventListener('change', () => {
        const allBlocUl = DOMFilterClick.querySelector('ul');
        allBlocUl.innerHTML = ''
        let filteredByType = listeByType.filter(label => {
            if (label.toLowerCase().includes(searchType.value.toLowerCase())) {
                return true
            }
        })

        filteredByType.forEach(label => {
            const allBlocLi = document.createElement('li');
            allBlocLi.classList.add('allTypeLi');
            allBlocLi.innerText = label;
            allBlocUl.appendChild(allBlocLi);
        })
    })

    listeByType.forEach(label => {
        const allBlocUl = DOMFilterClick.querySelector('ul');
        const allBlocLi = document.createElement('li');
        allBlocLi.classList.add('allTypeLi');
        allBlocLi.innerText = label;
        allBlocUl.appendChild(allBlocLi);

        allBlocLi.addEventListener('click', () => { sectionTag(label, labelPlaceHolder, DOMFilterClick) })
    })
}


// section Tag

function sectionTag(labelLi, classTag, blocName) {
    const tagIngredientsBloc = document.querySelector('.IngredientsDiv');
    const textTagIngredientsBloc = tagIngredientsBloc.innerText;
    const tagAppliancesBloc = document.querySelector('.AppliancesDiv');
    const textTagAppliancesBloc = tagAppliancesBloc.innerText;
    const tagUstensilsBloc = document.querySelector('.UstensilsDiv');
    const textTagUstensilsBloc = tagUstensilsBloc.innerText;

    const code = `
    <div class="${classTag} tagDiv">
        <p>${labelLi}</p>
        <i class="fa-regular fa-circle-xmark closeTag"></i>
    </div>
    `
    if (textTagIngredientsBloc.includes(labelLi) == false && blocName.className == 'filterClassAll filterClassIngredients') {
        ingredientTagList.add(labelLi);
        tagIngredientsBloc.innerHTML += code;
    }
    if (textTagAppliancesBloc.includes(labelLi) == false && blocName.className == 'filterClassAll filterClassAppliances') {
        applianceTagList.add(labelLi)
        tagAppliancesBloc.innerHTML += code;
    }
    if (textTagUstensilsBloc.includes(labelLi) == false && blocName.className == 'filterClassAll filterClassUstensils') {
        ustensilsTagList.add(labelLi)
        tagUstensilsBloc.innerHTML += code;
    }

    const closeTag = document.querySelectorAll('.closeTag');
    for (let i = 0; i < closeTag.length; i++) {
        let textTag
        closeTag[i].addEventListener('click', (e) => {
            textTag = e.target.closest('.tagDiv').innerText;
            e.target.closest('.tagDiv').style.display = 'none';
            if (ingredientTagList.has(textTag)) {
                ingredientTagList.delete(textTag);
                ingredientArrayTagList = Array.from(ingredientTagList);
                refreshRecipe(recipes);
            }
            if (applianceTagList.has(textTag)) {
                applianceTagList.delete(textTag);
                applianceArrayTagList = Array.from(applianceTagList);
                refreshRecipe(recipes);
            }
            if (ustensilsTagList.has(textTag)) {
                ustensilsTagList.delete(textTag);
                ustensilsArrayTagList = Array.from(ustensilsTagList);
                refreshRecipe(recipes);
            }
        });
    }
    ingredientArrayTagList = Array.from(ingredientTagList);
    applianceArrayTagList = Array.from(applianceTagList);
    ustensilsArrayTagList = Array.from(ustensilsTagList);

}

// global filtered function 
function filterRecipes(recipes) {
    let text = document.querySelector('.input-search').value;
    let filteredData = recipes.filter((recipe) => {
        const hasSelectedIngredient = ingredientArrayTagList.every(selectedIngredient => {
            return recipe.ingredients.some((ingredient) => {
                if (ingredient.ingredient === selectedIngredient) {
                    return true
                } else {
                    return false
                }
            })
        })
        const hasSelectedAppliance = applianceArrayTagList.every(selectedAppliance => {
            if (recipe.appliance === selectedAppliance) {
                return true
            } else {
                return false
            }
        })
        const hasSelectedUstensils = ustensilsArrayTagList.every(selectedUstensils => {
            return recipe.ustensils.some((ustensil) => {
                if (ustensil === selectedUstensils) {
                    return true
                } else {
                    return false
                }
            })
        })

        if ((recipe.name.toLowerCase().includes(text.toLowerCase()) || recipe.description.toLowerCase().includes(text.toLowerCase()) || recipe.ingredients.some(({ ingredient }) => {  // un objet . si non on peut ecrire aussi : ingredient => { return ingredient.ingredient.includes()}
            if (ingredient.toLowerCase().includes(text.toLowerCase())) {
                return true
            }
        })
        )
            && hasSelectedIngredient && hasSelectedAppliance && hasSelectedUstensils
        ) {
            return true
        }
    })

    return filteredData
}

// hide three bloc
function hideListe(element, query) {
    element.classList.replace('filterClassAll', 'filter');
    const code = `
    <p>${query}</p>
    <i class="fa-solid fa-angle-down angleDown"></i>
    `
    element.innerHTML = code
}

// ingredient 
function getIngredient(recipes) {
    let arrayIngredientBeforeSet = []
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredientElement => {
            arrayIngredientBeforeSet.push(ingredientElement.ingredient)
        })
    })
    let objectNameIngredient = new Set(arrayIngredientBeforeSet);//creer nouveau tableau without doublont
    const arrayIngredientAfterSet = Array.from(objectNameIngredient)
    return arrayIngredientAfterSet
}

// appliance
function getAppliance(recipes) {
    let arrayApplianceBeforeSet = []
    recipes.forEach(recipe => {
        arrayApplianceBeforeSet.push(recipe.appliance)
    })
    let objectNameAppliance = new Set(arrayApplianceBeforeSet);
    const arrayApplianceAfterSet = Array.from(objectNameAppliance)
    return arrayApplianceAfterSet
}

// ustensils 
function getUstensils(recipes) {
    let arrayUstensilsBeforeSet = []
    recipes.forEach(recipe => {
        recipe.ustensils.forEach(ustensil => {
            arrayUstensilsBeforeSet.push(ustensil)
        })
    })
    let objectNameUstensils = new Set(arrayUstensilsBeforeSet)
    const arrayUstensilsAfterSet = Array.from(objectNameUstensils)
    return arrayUstensilsAfterSet
}

// function 
function displayMessageError() {
    const code = `
    <p class="anyrecipes">Aucune recette ne correspond à votre critère...</p>
    `
    const divMessageError = document.querySelector('.divMessageError');
    divMessageError.innerHTML = code;
}

function hideMessageError() {
    const divMessageError = document.querySelector('.divMessageError');
    divMessageError.innerHTML = ''
}
