const sectionRecipes = document.getElementById('section-recipe');
const {recipes} = await getRecipes();
updateUI(recipes);

const query = {
    appareils : 'Appareils',
    ustensiles : 'Ustensiles',
    ingredients : 'Ingredients'
}

// retrieve data
async function getRecipes() {
    const data = await fetch('data/recipes.json');
    const dataRecipes = await data.json()
    return dataRecipes;
}


// recipes html,displayrecipes 
function recipesFactory(data) {
    const {name,time,ingredients,description} = data
    let liste = ''
    for(let i=0;i<ingredients.length;i++){
        liste = liste + `${ingredients[i].ingredient}:${ingredients[i].quantity}${ingredients[i].unit || '' } <br>`
    }

    function recipesCardDom() {
        let code =`
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
        sectionRecipes.innerHTML +=code;
    }
    return {recipesCardDom}
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
    if(filterAll){
        hideListe(filterAll,query.ustensiles)
        hideListe(filterAll,query.appareils)
        hideListe(filterAll,query.ingredients)
    }
  }


// input research
let inputSearch = document.querySelector('.input-search');
inputSearch.addEventListener('change',() =>{updateUI(recipes)})

// array after filtered recipes
function filterSearch(recipess){
    const text = document.querySelector('.input-search').value;
    let filteredRecipes = recipess.filter((recipe) => {
        if(recipe.name.includes(text)||
           recipe.description.includes(text)||
           recipe.ingredients.some(({ingredient}) => {  // un objet . si non on peut ecrire aussi : ingredient => { return ingredient.ingredient.includes()}
                ingredient.includes(text)})){
                     return true
                }
            })
    return filteredRecipes
}

 
//   section type
const filterIngredients = document.querySelector('.filter1');
const filterApplications = document.querySelector('.filter2');
const filterUstensiles = document.querySelector('.filter3');

// selecte by type
filterIngredients.addEventListener('click',filterType);
filterApplications.addEventListener('click',filterType);
filterUstensiles.addEventListener('click',filterType);


// display by theme
function filterType(e) {
    const filtered = filterSearch(recipes);
    const getRecipeIngredient = getIngredient(filtered);
    const getRecipeAppliance = getAppliance(filtered);
    const getRecipeUstensils = getUstensils(filtered);
    if(e.target.className === 'filter filter1'){
        displayFilterType(getRecipeIngredient,filterIngredients,query.ingredients)
        // filterIngredients.classList.replace('filter','filterAll')
        hideListe(filterUstensiles,query.ustensiles);
        hideListe(filterApplications,query.appareils);
    }
    if(e.target.className === 'filter filter2'){
        displayFilterType(getRecipeAppliance,filterApplications,query.appareils)
        // filterApplications.classList.replace('filter','filterAll')
        hideListe(filterUstensiles,query.ustensiles);
        hideListe(filterIngredients,query.ingredients)
    }
    if(e.target.className === 'filter filter3'){
        displayFilterType(getRecipeUstensils,filterUstensiles,query.ustensiles)
        // filterUstensiles.classList.replace('filter','filterAll')
        hideListe(filterApplications,query.appareils);
        hideListe(filterIngredients,query.ingredients);
    }
}

// DOM for three theme
function displayFilterType(listeByType,DOMFilterType,labelName) {
    const code = ` 
    <div class="bloc-allType">
      <input type="search" class="input-allType" placeholder="Rechercher un ${labelName}">
      <i class="fa-solid fa-angle-up angleUp"></i>
    </div>
    <ul class="card-allType"></ul>
    `
    DOMFilterType.innerHTML = code;
    DOMFilterType.classList.replace('filter','filterAll');
    const searchType = document.querySelector('.input-allType');
    // let text = searchType.value
    listeByType.forEach(name=>{
        const allBlocUl = DOMFilterType.querySelector('ul');
        const allBlocLi = document.createElement('li');
        allBlocLi.classList.add('allTypeLi');
        allBlocLi.innerText = name;
        
        allBlocUl.appendChild(allBlocLi);
    }) 

    searchType.addEventListener('change',()=>{
        const allBlocUl = DOMFilterType.querySelector('ul');
        allBlocUl.innerHTML = ''
        let filteredByType = listeByType.filter(name=>{
            if(name.includes(searchType.value)){
                return true
            }
        })
        
        filteredByType.forEach(name=>{
            const allBlocLi = document.createElement('li');
            allBlocLi.classList.add('allTypeLi');
            allBlocLi.innerText =name;
            console.log(name);
            allBlocUl.appendChild(allBlocLi);
        })
    })
}

// hide three bloc
function hideListe(element,query) {
    const blocInput = element.querySelector('.input-allType')
    const blocAngleIcon = element.querySelector('.angleUp')
    const blocUl = element.querySelector('ul')
    if(blocUl||blocInput||blocAngleIcon){
        // blocUl.style.display = 'none';
        blocInput.style.display = 'none';
        blocAngleIcon.style.display = 'none';
        blocUl.innerHTML=''
    }
    element.classList.replace('filterAll','filter');
    const initialBloc = document.querySelector('.filter'); //si je mes 'element' il ne trouve pas '.filter'
    const code = `
    <p class="textButton">${query}</p>
    <i class="fa-solid fa-angle-down angleDown"></i>
    `
    initialBloc.innerHTML=code
}

// function filterByType() {
//     console.log('filterbytype');
// }


// ingredient 
function getIngredient(recipes){
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
    recipess.forEach(recipe=> {
        arrayApplianceBeforeSet.push(recipe.appliance)
    })
    let objectNameAppliance = new Set(arrayApplianceBeforeSet);
    const arrayApplianceAfterSet = Array.from(objectNameAppliance)
    return arrayApplianceAfterSet
}

// ustensiles 

function getUstensils(recipess) {
    let arrayUstensilsBeforeSet = []
    recipess.forEach(recipe=>{
        recipe.ustensils.forEach(ustensil=>{
            arrayUstensilsBeforeSet.push(ustensil)
        })
    })
    let objectNameUstensils = new Set(arrayUstensilsBeforeSet)
    const arrayUstensilsAfterSet = Array.from(objectNameUstensils)
    return arrayUstensilsAfterSet
}
