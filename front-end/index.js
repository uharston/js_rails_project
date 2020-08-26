const carsAdapter = new CarsAdapter 

const startQuiz = document.getElementById("start-quiz")
const imageContainerDiv = document.getElementById('image-container')
const quizContainer = document.getElementById("quiz-container")

document.addEventListener('DOMContentLoaded', () => {

    startQuiz.addEventListener('click', beginQuiz)
})

function beginQuiz() {
    Car.clearBoard();
    carsAdapter.fetchQuestions();
    switchToAnswerForm();
}


function switchToAnswerForm() {
    quizContainer.innerHTML = 
    `<form id="answer-form" method="POST">
        <label>Guess The Make and Model</label>
        <input id="answer" type="text" name="answer"> 
        <input type="submit">
    </form>`
    const answerForm = document.getElementById('answer-form')
    answerForm.addEventListener('submit', Car.takeResponse)
}

// function takeResponse(e) {
//     let answer = e.target.getElementsByTagName('input')[0]
//     const car = Car.answered[Car.answered.length - 1]
//     const key = Object.keys(car)[0]
//     const result = car[key].car.checkAnswer(answer.value)
//     car[key].car.updateScore(result)
//     Car.results.push(result)
//     answer.value = ""
//     Car.nextQuestion();
//     e.preventDefault();
// }

function endOfQuiz() {
    // let results = resultsAsObject()
    // carsAdapter.fetchResults(results);
    quizContainer.innerHTML = 
    `<h2> You are done! ${Car.showResults()}</h2><br>
    <button id="start-quiz">Start the Quiz!</button>`
    const startQuiz = document.getElementById("start-quiz")
    startQuiz.addEventListener('click', beginQuiz)
    imageContainerDiv.innerHTML = ""
}

// function resultsAsObject() {
//     const array = []
//     for(let i = 0; i < 10; i++) {
//         array.push( {[Car.answered[i].id]: Car.results[i]} )
//     }
//     return array
// }



































// function sayClick() {
//     console.log("clicked yearForm!")
// }
// function fetchCarMakes() {
//     fetch("http://127.0.0.1:3000/cars")
//     .then(res => res.json())
//     .then(addMakes)
// }

// function fetchCarModels(m) {
//     console.log("clicked")
// //  
// //     fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${m}/vehicleType/car?format=json`)
// //     .then(resp => resp.json())
// //     .then(addCarModels)
// }

// function addCarModels(e) {
   
// }

// function addMakes(e) {
//     const sortedMakes = sortByMake(e)
//     sortedMakes.forEach( make => {
//         let newMake = document.createElement('option');
//         newMake.id = `${make.make_name}-option`
//         newMake.innerText = make.make_name 
//         newMake.addEventListener('change', fetchCarModels)
//         makesForm.firstElementChild.appendChild(newMake)
//     })
// }

// function sortByMake(e) {
//     return e.sort(function(a, b) {
//         var nameA = a.make_name.toUpperCase(); // ignore upper and lowercase
//         var nameB = b.make_name.toUpperCase(); // ignore upper and lowercase
//         if (nameA < nameB) {
//           return -1;
//         }
//         if (nameA > nameB) {
//           return 1;
//         }
      
//         // names must be equal
//         return 0;
//       });
// }

// fetchCarMakes()