// import { getRecipes } from "./utils/util.js";
// import { init } from "./utils/util.js";

 async function getRecipes() {
    const data = await fetch('data/recipes.json');
    const dataRecipes = await data.json()

    return dataRecipes;
}


function recipesFactory(data) {
    const {name,time,ingredients,description} = data

    function getUserCardDom() {
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
        liste =  `${element.ingredient} : ${element.quantity} ${element.unit}`
        });
        detail.innerText = liste
        console.log(ingredients);
        descriptionRecipes.innerText = description;

    }
    return {name,getUserCardDom}
}


function displayData(recipes) {
    const sectionRecipes = document.getElementById('section-recipe');
    recipes.forEach(recipe => { 
        const factoryRecipes = recipesFactory(recipe)
        const recipesDOM = factoryRecipes.getUserCardDom()
        console.log(recipe);
        sectionRecipes.appendChild(recipesDOM)
    });
}

async function init() {
   const {recipes} = await getRecipes();
   displayData(recipes)
}
await init();
