const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");
const UserHandler = require("../UserHandler/");

class QuizRunner {
  constructor() {
    this.currentCategory = "";
    this.categories = [];
    this.currentQuestion = { answers: [] };
    this.totalPoints = 0;
    this.redPoints = 0;
    this.bluePoints = 0;
    this.quizData = {};
    this.publisher = () => {};
    this.statPublisher = () => {};
    this.userHandler = new UserHandler();
  }

  get currentQList() {
    return this.quizData[this.currentCategory] || [];
  }

  loadQuestions() {
    const quizDataRaw = fs.readFileSync(__dirname + "/../questions.json", "utf8")
    const { quizdata } = JSON.parse(quizDataRaw);
    const categories = _.keys(quizdata)

    this.categories = categories;
    this.currentCategory = categories[0];
    this.quizData = quizdata;
  }

  start(publisher, statPublisher) {
    this.nextQuestion();
    this.publisher = publisher;
    this.statPublisher = statPublisher;
  }

  getQuestionResults() {
    this.publisher(this.currentQuestion);
  }

  nextQuestion() {
    this.save();
    let currentQuestionIndex = _
    .indexOf(this.currentQList, this.currentQuestion);
    
    if (currentQuestionIndex < this.currentQList.length - 1) {

      this.currentQuestion = this.currentQList[currentQuestionIndex + 1]
      this.currentQuestion.timeout = moment.utc().add(this.currentQuestion.time, "seconds").toISOString()
      this.currentQuestion.redVotes = 0;
      this.currentQuestion.blueVotes = 0;
      this.currentQuestion.voterIds = [];
      this.currentQuestion.votes = [];

      if (!this.currentQuestion.evaled) {
        this.currentQuestion.evaled = false;
      }
      
      this.publisher(this.currentQuestion);

    } else {
      const currentCatIndex = _.indexOf(this.categories, this.currentCategory);
      let nextCat = 0;
      if (currentCatIndex !== -1 && currentCatIndex < this.categories.length - 1) {
        nextCat = currentCatIndex + 1;
      }
      this.currentCategory = this.categories[nextCat];
      this.nextQuestion();
    }
  }

  evaluateQuestion() {
    if (!this.currentQuestion.evaled) {
      // const redVotes = this.currentQuestion.redVotes;
      // const blueVotes = this.currentQuestion.blueVotes;
      const redA = this.currentQuestion.votes.filter(x => x.team === "RED" && x.answer === 1);
      const redB = this.currentQuestion.votes.filter(x => x.team === "RED" && x.answer === 2);
      const redC = this.currentQuestion.votes.filter(x => x.team === "RED" && x.answer === 3);
      const redD = this.currentQuestion.votes.filter(x => x.team === "RED" && x.answer === 4);
  
      const blueA = this.currentQuestion.votes.filter(x => x.team === "BLUE" && x.answer === 1);
      const blueB = this.currentQuestion.votes.filter(x => x.team === "BLUE" && x.answer === 2);
      const blueC = this.currentQuestion.votes.filter(x => x.team === "BLUE" && x.answer === 3);
      const blueD = this.currentQuestion.votes.filter(x => x.team === "BLUE" && x.answer === 4);
  
      const redVotes = [redA.length, redB.length, redC.length, redD.length];
      const blueVotes = [blueA.length, blueB.length, blueC.length, blueD.length];
  
      const maxRed = _.indexOf(redVotes, _.max(redVotes));
      const maxBlue = _.indexOf(blueVotes, _.max(blueVotes));
  
      if (maxRed + 1 === this.currentQuestion.correctAnswer) {
        this.redPoints += this.currentQuestion.points
      }
  
      if (maxBlue + 1 === this.currentQuestion.correctAnswer) {
        this.bluePoints += this.currentQuestion.points
      }

      this.currentQuestion.evaled = true;
    }

    // const mostRedVotes = _.maxBy(this.currentQuestion)

    return this.currentQuestion;
  }

  voteQuestion(userId, answer, timestamp) {
    const exists = this.currentQuestion.voterIds.find(x => x === userId)
    const timeLeft = moment.utc(timestamp).isBefore(moment.utc(this.currentQuestion.timeout))
    const user = this.getUser(userId);

    // console.log(exists, user);

    if (exists) {
      // user already voted
    } else if (user && timeLeft){
      if (user.team === "RED") {
        this.currentQuestion.redVotes += 1;
      } else {
        this.currentQuestion.blueVotes += 1;
      }

      if (answer === this.currentQuestion.correctAnswer) {
        user.points += this.currentQuestion.points;
      }

      this.currentQuestion.voterIds.push(userId);
      this.currentQuestion.votes.push({ userId, answer, team: user.team })
    }
  }

  getStats() {
    return {
      currentCategory: this.currentCategory,
      categories: this.categories,
      totalPoints: this.totalPoints,
      redPoints: this.redPoints,
      bluePoints: this.bluePoints,
    };
  }

  publishStats() {
    this.statPublisher({
      currentCategory: this.currentCategory,
      categories: this.categories,
      totalPoints: this.totalPoints,
      redPoints: this.redPoints,
      bluePoints: this.bluePoints,
    })
  }

  save() {
    fs.writeFileSync("results.json", JSON.stringify(this.quizData), "utf8");
  }

  addUser() {
    return this.userHandler.addUser();
  }

  getUser(id) {
    return this.userHandler.getUser(id);
  }

  getWinner() {
    return this.userHandler.getWinner();
  }
}

module.exports = QuizRunner