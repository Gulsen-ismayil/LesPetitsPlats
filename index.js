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


function displayData(recipes) {
    const sectionRecipes = document.getElementById('section-recipe');
    recipes.forEach(recipe => { 
        console.log(recipe);
        let factoryRecipes = recipesFactory(recipe)
        let recipesDOM = factoryRecipes.getUserCardDom();
        sectionRecipes.appendChild(recipesDOM)
    });
}


function recipesFactory(data) {
    const {name,time,ingredients,description} = data
    function getUserCardDom() {
        const card = document.querySelector('.card')
        const nameRecipes = document.querySelector('.name');
        nameRecipes.innerHTML = name;
        
        const timeRecipes = document.querySelector('.time');
        const clock = document.querySelector('.fa-clock');
        const minute = document.querySelector('.minute');
        minute.innerText = time+'min';
        
        const text = document.querySelector('.text');
        const detail = document.querySelector('.detail');
        const descriptionRecipes = document.querySelector('.description');
        let liste;
        ingredients.forEach(element => {
            liste +=  `${element.ingredient} : ${element.quantity} ${element.unit}`
        });
        detail.innerText = liste
        console.log(ingredients);
        descriptionRecipes.innerText = description;
        
        return (card)
        
    }
    return {name,getUserCardDom}
}


