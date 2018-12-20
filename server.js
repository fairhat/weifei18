const Hapi = require('hapi');
const Nes = require('nes');
const Path = require("path");
const QuizRunner = require("./src/QuizRunner/index")
const moment = require("moment");

const server = new Hapi.Server({
  host: "localhost",
  port: 80,
});

const quizRun = new QuizRunner();

const start = async () => {
  
  await server.register(Nes);
  await server.register(require("inert"));

    server.route({
      method: "GET",
      path: "/{param*}",
      handler: {
        directory: {
          path: "build/"
        }
      }
    })
    
    server.route({
      method: "GET",
      path: "/question",
      config: {
        id: "question",
        handler: (req, h) => {
          quizRun.nextQuestion()

          return 200;
        }
      }
    })

    server.route({
      method: "GET",
      path: "/current",
      config: {
        id: "current",
        handler: (req, h) => {
          return quizRun.currentQuestion;
        }
      }
    })

    server.route({
      method: "GET",
      path: "/stats",
      config: {
        id: "stats",
        handler: (req, h) => {
          quizRun.publishStats()

          return 200;
        }
      }
    })

    server.route({
      method: "GET",
      path: "/eval",
      config: {
        id: "eval",
        handler: (req, h) => {
          return quizRun.evaluateQuestion();
        }
      }
    })

    server.route({
      method: "GET",
      path: "/register",
      config: {
        id: "register",
        handler: (req, h) => {
          return quizRun.addUser();
        }
      }
    })

    server.route({
      method: "GET",
      path: "/winner",
      config: {
        id: "winner",
        handler: (req, h) => {
          return quizRun.getWinner();
        }
      }
    })

    server.route({
      method: "GET",
      path: "/statistics",
      config: {
        id: "statistics",
        handler: (req, h) => {
          return quizRun.getStats()
        }
      }
    })

    server.route({
      method: "POST",
      path: "/vote",
      config: {
        id: "vote",
        handler: (req, h) => {
          // console.log("vote")
          // console.log(req.payload)
          // console.log(req.params)

          quizRun.voteQuestion(
            req.payload.id,
            req.payload.answer,
            moment.utc().toISOString()
          )

          return 200;
        }
      }
    }) 
    
    server.subscription("/q");
    // server.subscription("/stats");
    
    try {
      await server.start();
    } catch (err) {
      console.log(err)
      process.exit(1)
    }
    const publisher = (data) => server.publish("/q", data);
    // const statPublisher = (data) => server.publish("/stats", data);
    quizRun.loadQuestions();
    quizRun.start(publisher, () => {})

    console.log("Server running at: ", server.info.uri);
};

start();