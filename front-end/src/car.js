 class Car {
    static all = [] 
    static unanswered = [] 
    static answered = []
    

    constructor({id, make, model, images, forQuiz, likes, dislikes}) {
        this.id = id 
        this.make = make 
        this.model = model 
        this.images = images 
        this.forQuiz = forQuiz
        this.likes = likes 
        this.dislikes = dislikes 
    
        if(this.forQuiz) {
            Car.unanswered.push( { "car": this, "answer": "" } )
        }
        else {
            Car.all.push( this )
        }
    }

    makeAndModel() {
        return `${this.make} ${this.model}`
    }

    checkAnswer(answer) {
       return this.makeAndModel() === answer ? true : false
    }

    // updateScore(score) {
    //     
    // }



    static renderCars(arg) {
        if(!arg) {
            switchToMainCssDesign();
            this.renderAllCarsBody(); 
        }
        else {
            this.renderAllCarsBody(arg);
        }
    }

    static renderAllCarsBody(arg) {
        
        const contentWrapper = document.getElementById('content-wrapper')
        contentWrapper.innerHTML = "" //make sure the div is clear of content from filters 
        
        let div = document.createElement('div')
        div.className = "w3-row-padding"

        
        div.innerHTML = this.carAllHtml(arg)
        contentWrapper.appendChild(div)

        //sort and reset button listeners 
        const sortCarsButton = document.getElementById('sort-cars')
        sortCarsButton.addEventListener("click", this.handleSortClick)
        const resetCarsButtion = document.getElementById('reset-sort')
        resetCarsButtion.addEventListener('click', this.handleResetClick)

        this.likesAndDislikesListeners()

    
    }


    static handleResetClick() {
        Car.renderAllCarsBody()
    }

    static handleSortClick() {
        Car.renderAllCarsBody('sorted')
    }

    static likesAndDislikesListeners() {
        Car.all.forEach( e => {
            let likes = document.getElementById(`like-button-${e.id}`)
            let dislikes = document.getElementById(`dislike-button-${e.id}`)
            likes.addEventListener('click', carsAdapter.patchLikes)
            dislikes.addEventListener('click', carsAdapter.patchDislikes)
        })
    }

    static sortedCars() {
        const sorted = Car.all.slice(0)
        return sorted.sort( (a, b) => {
            const nameA = a.make
            const nameB = b.make
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
    }


    static carAllHtml(arg) {
        let collection
        if(arg === 'sorted') {
            collection = this.sortedCars();
        }
        else {
            collection = Car.all 
        }
        
        const carCards = collection.map( e => {
            return `
            <div id="car-${e.id}" class="w3-third w3-margin-bottom">
                <div class="w3-card-4">
                    <div class="w3-container w3-center">
                        <h3 class="">${e.makeAndModel()}</h3>
                        <div class="img-container"> 
                            <img src="${e.images[0].url}" class="index-image-class" > <br>
                            
                        </div>
                        <button id='like-button-${e.id}' class="w3-left w3-button w3-large like-button"><i class="far fa-thumbs-up"></i><span id="like-amount-${e.id}" class="w3-left" > ${e.likes}</span>  </button>
                        
                        <button id='dislike-button-${e.id}' class="w3-right w3-button w3-large dislike-button"><i class="far fa-thumbs-down"></i> <span id="dislike-amount-${e.id}" class="w3-right" > ${e.dislikes}</span> </button>
                        

                        
                    </div>
                </div>
            </div>`
        })

        const title = `
        <br><div class="w3-container w3-center">
            <h1 class="w3-jumbo">We have ${Car.all.length} cars you can study!</h1><br>
            <hr class="w3-border-grey" style="margin:auto;width:40%"><br>
            <div class="w3-left">
                <span>Order:</span> 
                <button id="sort-cars"> Alphabetical </button>
            </div>
            <button id="reset-sort" class="w3-right"> Reset </button>
        </div><br>`
        carCards.unshift(title)
        return carCards.join(' ')

    
    }




     
    static addImageToDom(i = 0) {
        let car = this.unanswered.pop() //How are the element's structured in this array? {3: {car: Car, answer: ""} } => try this: {id: 3, car: Car, answer: ""}
        this.answered.push(car)
        const imageContainer = document.getElementById('image-container')
        imageContainer.innerHTML = `<img src=${Car.answered[this.answered.length - 1].car.images[0].url} id="quiz-image" class="quiz-image-class ">`      
    }

    static takeResponse(e) {
        e.preventDefault();
        let answer = e.target.getElementsByTagName('input')[0] //find the user's answer
        const car = Car.answered[Car.answered.length - 1] //find the car to compare answer
        car.userAnswer = answer.value //stores the user's answer with the car for the game
        const result = car['car'].checkAnswer(answer.value) // compare answers. return boolean 
        car.answer = result
        answer.value = "" //reset the input field for the next question 
        carsAdapter.updateScore(car) //send the answer boolean to the back-end 
        

    }

    static showStats(data) {
        const statsHtml = this.buildStatsHtml(data)
 
        const answerWrapper = document.getElementById('answer-wrapper')
        answerWrapper.innerHTML = ""

        const contentWrapper = document.getElementById('content-wrapper')
        contentWrapper.appendChild(statsHtml)
        
        const statsForm = document.getElementById('stats-form')
        statsForm.addEventListener('submit', this.nextQuestion)
    }
    
    static buildStatsHtml(data) {
        
        const statsWrapper = document.createElement('div')
        statsWrapper.id = 'stats-wrapper'
     
        const image = this.findLastImage()
      
        statsWrapper.innerHTML = `
            <div id="answer-card" class="w3-card-4 w3-center w3-hover-shadow w3-light-grey " >
                <h2 class="w3-text-black" id="question-title">${this.rightOrWrong()}</h2>
                <h3 class="w3-text-black" id="question-title">This is a ${this.findLastCar()}</h3>
                <div id="image-container">
                    <img src="${image}" id="quiz-image" class="results-image-class">
                </div><br>

                <div id='card-content'>
                    <h4><strong>${this.percentageCorrectStats(data)}</strong> of people get this answer correct</h4>
                </div>
                    <form id="stats-form" method="POST">
                        <input class="w3-button w3-block w3-green" value="Next Question" type="submit">
                    </form>
                </div>
            </div>`  
            return statsWrapper
    }

    static findLastImage() {
        return this.answered[this.answered.length - 1]['car']['images'][0].url
    }

    static findLastCar() {
        return this.answered[this.answered.length - 1]['car'].makeAndModel()    
    }

    static rightOrWrong() {
        return this.answered[this.answered.length - 1]['answer'] ? "Correct!" : "Wrong Answer" 
    }
    
    static percentageCorrectStats(car) {
        const num = (car.total_correct / car.total_games) * 100
        return `${Math.ceil(num)}%`
    }

    static percentageCorrectQuiz() {
        return Math.floor( (Car.answered.filter( e => e.answer === true ).length / 10) * 100 )
    }

     static nextQuestion() {
        //  e.preventDefault(); 
       
        if(Car.answered.length === 10) {
            switchToMainCssDesign('results'); 
        } 
        else  {
            switchToMainCssDesign('quiz');
            Car.addImageToDom()
        }
    }

    static showResults() {
        let correctAnswers = Car.answered.filter( e => e.answer === true )
        return `You got ${correctAnswers.length} out of 10 correct.`
    }

    static clearBoard() {
        this.unanswered = []
        this.answered = []  
     }

}