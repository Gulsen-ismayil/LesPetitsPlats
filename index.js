const sectionRecipes = document.getElementById('section-recipe');
const {recipes} = await getRecipes();
updateUI(recipes);

async function getRecipes() {
    const data = await fetch('data/recipes.json');
    const dataRecipes = await data.json()
    return dataRecipes;
}

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


// input recherche 

let inputSearch = document.querySelector('input');
inputSearch.addEventListener('change',() =>{updateUI(recipes)})

function displayRecipes(recipes) {
    sectionRecipes.innerHTML = ''

    recipes.forEach(recipe => { 
    const factoryRecipes = recipesFactory(recipe)
    factoryRecipes.recipesCardDom();
    });
}

// sectionRecipes.innerHTML = ''
// let filteredRecipes =[];
// let inputSearch = document.querySelector('input');

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

function updateUI(recipes) {
    let filteredRecipes = filterSearch(recipes)
    displayRecipes(filteredRecipes)
  }
 
//   section par type 
const filterAll = document.querySelector('.filter')
const filterIngredients = document.querySelector('.filter1');
const filterApplications = document.querySelector('.filter2');
const filterUstensiles = document.querySelector('.filter3');

filterIngredients.addEventListener('click',filterType);
filterApplications.addEventListener('click',filterType);
filterUstensiles.addEventListener('click',filterType);


function filterType(e) {
    const filtered = filterSearch(recipes);
    const nameOfIngredient = nameIngredient(filtered);
    const nameOfAppliance = nameAppliance(filtered);
    const nameOfUstensils = nameUstensils(filtered);
    console.log(nameOfIngredient);
    if(e.target.className === 'filter filter1'){
        displayFilterType(nameOfIngredient,filterIngredients)
        filterIngredients.classList.replace('filter','filterAll')
        // filterApplications.style.display = 'none';
        // filterUstensiles.style.display = 'none';
        console.log('ingredient')
    }
    if(e.target.className === 'filter filter2'){
        displayFilterType(nameOfAppliance,filterApplications)
        filterApplications.classList.replace('filter','filterAll')
        // filterIngredients.style.display = 'none';
        // filterUstensiles.style.display = 'none';
        console.log('appreil');
    }
    if(e.target.className === 'filter filter3'){
        displayFilterType(nameOfUstensils,filterUstensiles)
        filterUstensiles.classList.replace('filter','filterAll')
        // filterApplications.style.display = 'none';
        // filterIngredients.style.display ='none';
        console.log('ustensiles');
    }
}

function displayFilterType(nameOfFilterType,blocOfFilterType) {
    const code = ` 
    <div class="bloc-ingredient">
      <input type="search" class="input-ingredient" placeholder="Rechercher un ingrédient">
      <i class="fa-solid fa-angle-up angleUp"></i>
    </div>
    <ul class="card-nameIngredient"></ul>
    `
    blocOfFilterType.innerHTML = code;
    nameOfFilterType.forEach(name=>{
        const eachIngredientUl = blocOfFilterType.querySelector('ul');
        const eachIngredientLi = document.createElement('li');
        eachIngredientLi.classList.add('each-ingredientLi');
        eachIngredientLi.innerText = name;

        eachIngredientUl.appendChild(eachIngredientLi);
    })
}

// ingredient 

function nameIngredient(recipess){
    let arrayIngredientBeforeSet = [] 
    recipess.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            arrayIngredientBeforeSet.push(ingredient.ingredient)
        })
    })
    let objectNameIngredient = new Set(arrayIngredientBeforeSet);//creer nouveau tableau without doublont
    const arrayIngredientAfterSet = Array.from(objectNameIngredient)
   
    return arrayIngredientAfterSet
}

// appliance

function nameAppliance(recipess) {
    let arrayApplianceBeforeSet = []
    recipess.forEach(recipe=> {
        arrayApplianceBeforeSet.push(recipe.appliance)
    })
    let objectNameAppliance = new Set(arrayApplianceBeforeSet);
    const arrayApplianceAfterSet = Array.from(objectNameAppliance)
    return arrayApplianceAfterSet
}

// ustensiles 

function nameUstensils(recipess) {
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


// function displayFilterType(nameOfFilterType,blocOfFilterType) {
//     const code = ` 
//     <div class="bloc-ingredient">
//       <input type="search" class="input-ingredient" placeholder="Rechercher un ingrédient">
//       <i class="fa-solid fa-angle-up angleUp"></i>
//     </div>
//     <ul class="card-nameIngredient"></ul>
//     `
//     blocOfFilterType.innerHTML = code;
//     nameOfFilterType.forEach(name=>{
//         const eachIngredientUl = document.querySelector('ul');
//         const eachIngredientLi = document.createElement('li');
//         eachIngredientLi.classList.add('each-ingredientLi');
//         eachIngredientLi.innerText = name;

//         eachIngredientUl.appendChild(eachIngredientLi);
//     })

// }

// function displayIngredient() {
//     const nameOfIngredient = nameIngredient()
//     // filterIngredients.classList.add('filter-ingredient');
//     const code = ` 
//     <div class="bloc-ingredient">
//       <input type="search" class="input-ingredient" placeholder="Rechercher un ingrédient">
//       <i class="fa-solid fa-angle-up"></i>
//     </div>
//     <ul class="card-nameIngredient"></ul>
//     `
//     filterIngredients.innerHTML = code;
//     nameOfIngredient.forEach(name=>{ 
//         const eachIngredientUl = document.querySelector('ul');
//         const eachIngredientLi = document.createElement('li');
//         eachIngredientLi.classList.add('each-ingredientLi')
//         eachIngredientLi.innerText = name;

//         eachIngredientUl.appendChild(eachIngredientLi);
//         filterIngredients.appendChild(eachIngredientUl);
//     }) 
// }
