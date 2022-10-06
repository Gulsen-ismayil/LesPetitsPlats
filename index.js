const sectionRecipes = document.getElementById('section-recipe');
const { recipes } = await getRecipes();
updateUI(recipes);

const query = {
    appareils: 'Appareils',
    ustensiles: 'Ustensiles',
    ingredients: 'Ingredients'
}

let ingredientTagList = new Set();
let applianceTagList = new Set();
let ustensilesTagList = new Set();

// retrieve data
async function getRecipes() {
    const data = await fetch('data/recipes.json');
    const dataRecipes = await data.json()
    return dataRecipes;
}

// recipes html,displayrecipes 
function recipesFactory(data) {
    const { name, time, ingredients, description } = data
    let liste = ''
    for (let i = 0; i < ingredients.length; i++) {
        liste = liste + `${ingredients[i].ingredient}:${ingredients[i].quantity}${ingredients[i].unit || ''} <br>`
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

function updateUI(recipes) {
    let filteredRecipes = filterSearch(recipes)
    displayRecipes(filteredRecipes)
    const filterAll = document.querySelector('.filterAll')
    if (filterAll) {
        hideListe(filterAll, query.ustensiles)
        hideListe(filterAll, query.appareils)
        hideListe(filterAll, query.ingredients)
    }
}

// input research
let inputSearch = document.querySelector('.input-search');
inputSearch.addEventListener('change', () => { updateUI(recipes) })

// array after filtered recipes
function filterSearch(recipess) {
    const text = document.querySelector('.input-search').value;

    let filteredData = recipess.filter((recipe) => {
        if ((recipe.name.includes(text) || recipe.description.includes(text) || recipe.ingredients.some(({ ingredient }) => {  // un objet . si non on peut ecrire aussi : ingredient => { return ingredient.ingredient.includes()}
            if (ingredient.includes(text)) {
                return true
            }
        })
        )
        ) {
            return true
        }
    })
    return filteredData
}

// const hasSelectedIngredients = Array.from(ingredientTagList).every((selectedIngredient) => {
//     console.log(hasSelectedIngredients);
//     return recipe.ingredients.some((ingredient)=>{
//         if(ingredient.ingredient === selectedIngredient) {
//             return true
//         } else {
//             return false
//         }
//     })
// })

// const hasMyRecipieAllWantedIngredient = Array.from(ingredientList).every((wantedSelectedIngredient) => {
//     return recipie.ingredients.some((ingredient) => {
//         if (ingrededient.ingredient ===  wantedSelectedIngredient) {
//             return true
//         } else {
//             return false
//         }
//     })

// const hasMyRecipieAllWantedUstencils= //  code à écrire


// const hasMyRecipieAllAppliances = // code à écrire


//   section type
const filterIngredients = document.querySelector('.filter1');
const filterApplications = document.querySelector('.filter2');
const filterUstensiles = document.querySelector('.filter3');

// selecte by type
filterIngredients.addEventListener('click', filterClick);
filterApplications.addEventListener('click', filterClick);
filterUstensiles.addEventListener('click', filterClick);

// display by theme
function filterClick(e) {
    const filtered = filterSearch(recipes);
    const getRecipeIngredient = getIngredient(filtered);
    const getRecipeAppliance = getAppliance(filtered);
    const getRecipeUstensils = getUstensils(filtered);
    if (e.target.className === 'filter filter1') {
        displayFilterClick(getRecipeIngredient, filterIngredients, query.ingredients)
        hideListe(filterUstensiles, query.ustensiles);
        hideListe(filterApplications, query.appareils);
    }
    if (e.target.className === 'filter filter2') {
        displayFilterClick(getRecipeAppliance, filterApplications, query.appareils)
        hideListe(filterUstensiles, query.ustensiles);
        hideListe(filterIngredients, query.ingredients)
    }
    if (e.target.className === 'filter filter3') {
        displayFilterClick(getRecipeUstensils, filterUstensiles, query.ustensiles)
        hideListe(filterApplications, query.appareils);
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
    DOMFilterClick.classList.replace('filter', 'filterAll');
    const searchType = DOMFilterClick.querySelector('.input-allType');
    // let text = searchType.value.   (si je declare text egale searchType.value cela ne marche pas  pour koi?)

    listeByType.forEach(label => {
        const allBlocUl = DOMFilterClick.querySelector('ul');
        const allBlocLi = document.createElement('li');
        allBlocLi.classList.add('allTypeLi');
        allBlocLi.innerText = label;
        allBlocUl.appendChild(allBlocLi);

        allBlocLi.addEventListener('click', () => { DisplaySectionTag(label, labelPlaceHolder, DOMFilterClick) })
    })

    searchType.addEventListener('change', () => {
        const allBlocUl = DOMFilterClick.querySelector('ul');
        allBlocUl.innerHTML = ''
        let filteredByType = listeByType.filter(label => {
            if (label.includes(searchType.value)) {
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
}


// get filtered li liste and display it 
function DisplaySectionTag(label, labelPlaceHolder, DOMFilterClick) {
    sectionTag(label, labelPlaceHolder, DOMFilterClick);
}

function sectionTag(labelLi, classTag, blocName) {
    const tagIngredientsBloc = document.querySelector('.IngredientsDiv');
    const tagAppareilsBloc = document.querySelector('.AppareilsDiv');
    const tagUstensilesBloc = document.querySelector('.UstensilesDiv');

    const code = `
    <div class="${classTag} tagDiv">
    <p>${labelLi}</p>
    <i class="fa-regular fa-circle-xmark closeTag"></i>
    </div>
    `
    if (ingredientTagList.has(labelLi) == false && blocName.className == 'filterAll filter1') {
        ingredientTagList.add(labelLi);
        tagIngredientsBloc.innerHTML += code;
    }
    if (applianceTagList.has(labelLi) == false && blocName.className == 'filterAll filter2') {
        applianceTagList.add(labelLi)
        tagAppareilsBloc.innerHTML += code;
    }
    if (ustensilesTagList.has(labelLi) == false && blocName.className == 'filterAll filter3') {
        ustensilesTagList.add(labelLi)
        tagUstensilesBloc.innerHTML += code;
    }

    const elementDiv = document.querySelector(`.${classTag}`)
    const closeTag = document.querySelectorAll('.closeTag');
    for (let i = 0; i < closeTag.length; i++) {
        closeTag[i].addEventListener('click', () => { //pour quoi je peux supprimer seulement le premier element?
                elementDiv.style.display = 'none'
                console.log('g');
            });
    }
}

// hide three bloc
function hideListe(element, query) {
    element.classList.replace('filterAll', 'filter');
    const code = `
    <p class="textButton">${query}</p>
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
function getAppliance(recipess) {
    let arrayApplianceBeforeSet = []
    recipess.forEach(recipe => {
        arrayApplianceBeforeSet.push(recipe.appliance)
    })
    let objectNameAppliance = new Set(arrayApplianceBeforeSet);
    const arrayApplianceAfterSet = Array.from(objectNameAppliance)
    return arrayApplianceAfterSet
}

// ustensiles 
function getUstensils(recipess) {
    let arrayUstensilsBeforeSet = []
    recipess.forEach(recipe => {
        recipe.ustensils.forEach(ustensil => {
            arrayUstensilsBeforeSet.push(ustensil)
        })
    })
    let objectNameUstensils = new Set(arrayUstensilsBeforeSet)
    const arrayUstensilsAfterSet = Array.from(objectNameUstensils)
    return arrayUstensilsAfterSet
}
