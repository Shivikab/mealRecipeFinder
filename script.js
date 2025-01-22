const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementsByClassName("result-heading");
// result heading ki koi Id ni h isliye classname dala
const single_mealEl = document.getElementById("single-meal");
// single meal element

//SearchMeal from API
function searchMeal(e) {
  e.preventDefault();
  // isse jb ek elemnt search kro toh uske result ke bad 
  // search bar firse khali hojata h

  // Clear single Meal
  single_mealEl.innerHTML = "";

  //get search Term
  const term = search.value;

  //Check for empty
  if (term.trim()) { 
    //trim hoskta h mtlb kuch na kuch input dala h toh uske liye search kr skte hain mtlb
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json()) // response = jo json file degi
      .then((data) => {
        resultHeading.innerHTML = `<h2>Result For ${term} : </h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<h2> There are No Search results for ${term}</h2>`;
        } else {
          mealsEl.innerHTML = data.meals.map( //jo data aya h usko map use krke show krenge
              (meal) => `
                 <div class="meal">
                 <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                 <div class="meal-info" data-mealID="${meal.idMeal}">     
                    <h3>${meal.strMeal}</h3>
                 </div>
                 </div>
                `)
                // thumbnail mtlb sirf photo 
                // info uske bare mei basically uska nam
            .join("");
            // this join is used taki all 4 images come joint 
            // mtlb not required wala gap na aye beechme
            // sari info joined rhe
        }
      });

    //Clear Search Term
    search.value = "";
  } else {
    alert("please enter a value in search box");
    // mtlb kuch input hi ni dala
  }  
}

//Fetch Meal By Id
function getMealById(mealID) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  )
    .then((res) => res.json()) 
    // response.json aega ab response mei
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);

      // Scroll down to the single meal information section
      document.getElementById("single-meal").scrollIntoView({
        behavior: "smooth", // Smooth scroll effect
        block: "start", // Align to the top of the viewport
      });

      
    });
}

//fetch Meal 
function randomMeal(){
    //Clear Meals and Heading
    mealsEl.innerHTML='';
    resultHeading.innerHTML='';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    })
}

// random meal
function randomMeal(){
  mealsEl.innerHTML = " ";
  resultHeading.innerHTML = "";
  fetch( 
    `https://www.themealdb.com/api/json/v1/1/random.php `
  ).then(res => res.json()).then(data=> {
    const meal = data.meals[0];
    addMealToDOM(meal);
  });
}

//Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`
        ${meal[`strIngredient${i}`]} - ${
          meal[`strMeasure${i}`]
        }`
      );
    }else{
        break;
    }
  }

  // show krna h ab
  single_mealEl.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
  ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
  </ul>
  </div>
  </div>
`
}

//Event Listerner
submit.addEventListener("submit", searchMeal);
random.addEventListener('click',randomMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((item) => { 
  // const mealInfo = e.path().find((item) => {
    // e.path may not work for all browsers like chrome 
    // isliye use composed paths
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});