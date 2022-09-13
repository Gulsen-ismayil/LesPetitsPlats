// import { getRecipes } from "./utils/util.js";
// import { init } from "./utils/util.js";
async function init() {
    const {recipes} = await getRecipes();
    displayData(recipes)
}
await init();

async function getRecipes() {
    const data = await fetch('data/recipes.json');
    const dataRecipes = await data.json()
    
    return dataRecipes;
}

function recipesFactory(recipe) {
    const sectionRecipes = document.getElementById('section-recipe');
    const {name,time,ingredients,description} = recipe
    function getUserCardDom() {
        let liste;
        let i
        for(i=0;i<ingredients.length;i++){
            liste = `${ingredients[i].ingredient}:${ingredients[i].quantity}${ingredients[i].unit}`
           console.log(i);
        }
        
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
        // const card = document.querySelector('.card')
        // const nameRecipes = document.querySelector('.name');
        // nameRecipes.innerHTML = name;
        
        // const timeRecipes = document.querySelector('.time');
        // const clock = document.querySelector('.fa-clock');
        // const minute = document.querySelector('.minute');
        // minute.innerText = time+'min';
        
        // const text = document.querySelector('.text');
        // const detail = document.querySelector('.detail');
        // const descriptionRecipes = document.querySelector('.description');
        // let liste;
        // ingredients.forEach(element => {
            //     liste +=  `${element.ingredient} : ${element.quantity} ${element.unit}`
            // });
            // detail.innerText = liste
            // console.log(ingredients);
            // descriptionRecipes.innerText = description;
            
            // return (card)
            
        }
        return {name,getUserCardDom}
    }
    function displayData(recipes) {
        recipes.forEach(recipe => { 
            const factoryRecipes = recipesFactory(recipe)
            factoryRecipes.getUserCardDom();
            // sectionRecipes.appendChild(recipesDOM)
            // sectionRecipes.innerHTML +=code;
        });
    }
    
    
    