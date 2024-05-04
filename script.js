
document.addEventListener('DOMContentLoaded', () => {
  const mainsearch=document.getElementById("searchInput");
  const mainbutton=document.querySelector(".searchButton");
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("click");
  const resultContainer = document.querySelector('.cards');
  
  mainbutton.addEventListener('click',()=>{
    const searchword=mainsearch.value.trim().toLowerCase();
    if (searchword === '') {
      alert("Please provide a search term.");
    } else {
      fetchMeal(searchword);
    }

  })

  const searchrandom = document.getElementById("random");

  searchrandom.addEventListener('click', fetchRandomMeal);

  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();


    if (searchTerm === '') {
      alert("Please provide a search term.");
    } else {

      fetchMeal(searchTerm);
    }
  });

  function fetchMeal(searchTerm) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data.meals || data.meals.length === 0) {

          throw new Error('No meal found');
        }

        const meal = data.meals[0]; 
        const mealId = meal.idMeal;

        
        fetchMealDetails(mealId);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        resultContainer.innerHTML = `<p>Looks like we couldn't find any matches. How about trying a different recipe or checking your input? We're excited to help you find something delicious!</p>`; // Display an error message
      });
  }

  function fetchMealDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data.meals || data.meals.length === 0) {
          
          throw new Error('Meal details not found');
        }

        const meal = data.meals[0];
        const mealName = meal.strMeal;
        const mealImage = meal.strMealThumb;
        const ingredients = [];
        const instructions = meal.strInstructions;

        
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && measure) {
            ingredients.push(`${ingredient} - ${measure}`);
          }
        }

        
        const cardHtml = `
          <div class="item7">
            <div class="item17">
              <img src="${mealImage}" alt="${mealName}" />
              <div class="ingre">
                <h2 class="title">${mealName}</h2>
                <h3>Ingredients</h3>
                <ul>
                  ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
              </div>
            </div>
            <div class="item27">
              <h2>Instructions</h2>
              <p class="process">${instructions}</p>
            </div>
          </div>
        `;
        resultContainer.innerHTML = cardHtml;
      })
      .catch(error => {
        console.error('Fetch error:', error);
        resultContainer.innerHTML = `<p>Looks like we couldn't find any matches. How about trying a different recipe or checking your input? We're excited to help you find something delicious!</p>`; // Display an error message
      });
  }

  function fetchRandomMeal() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const meal = data.meals[0];
            if (!meal) {
                throw new Error('Meal not found');
  
            }
  
            const mealName = meal.strMeal;
            const mealImage = meal.strMealThumb;
            const ingredients = [];
            const instructions = meal.strInstructions;
  
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && measure) {
                    ingredients.push(`${ingredient} - ${measure}`);
                }
            }
  
            const cardHtml = `
            <div class="item7">
            <div class="item17">
              <img src="${mealImage}" alt="${mealName}" />
              <div class="ingre">
                <h2 class="title">${mealName}</h2>
                <h3>Ingredients</h3>
                <ul>
                  ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
              </div>
            </div>
            <div class="item27">
              <h2>Instructions</h2>
              <p class="process">${instructions}</p>
            </div>
          </div>
            `;
  
            document.querySelector('.cards').innerHTML = cardHtml;
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('An error occurred while fetching the meal data.');
            resultContainer.innerHTML = `<p>Looks like we couldn't find any matches. How about trying a different recipe or checking your input? We're excited to help you find something delicious!</p>`; 
        });
  }
  

});
