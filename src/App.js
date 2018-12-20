import React, { Component } from "react";
import "./App.css";
import { Layout, Row, Col, Button } from "antd";
import "antd/dist/antd.min.css";
import QuizAnswers from "./QuizAnswers";
import QuizDuelBar from "./QuizDuelBar";
import QuizTimer from "./QuizTimer/";
import Nes from "nes";
import moment from "moment";

const client = new Nes.Client("ws://localhost:8000");

const start = async () => {
  await client.connect()
}

class App extends Component {

  state = {
    question: {
      answers: [ { text: "" }, { text: "" }, { text: "" }, { text: "" } ],
      timeout: moment.utc(),
      votes: [],
    },
    currentCategory: "",
    categories: [],
    redVotes: 0,
    blueVotes: 0,
    redPoints: 0,
    bluePoints: 0,
  }

  async componentDidMount() {
    await start()
    this.getQuestion()
    this.getCurrentQuestion()
  }

  getQuestion = async () => {
    client.subscribe("/q", this.receiveQuestion);
  }

  getCurrentQuestion = async () => {
    const data = await client.request("/current");
    this.receiveQuestion(data.payload);
  }

  nextQuestion = async () => {
    const data = await client.request("/question");
  }

  receiveQuestion = update => {
    this.setState({ question: update })
  }

  evaluateQuestion = async () => {
    console.log("eval");
    const data = await client.request("/eval");
    const stats = await client.request("/statistics");

    this.setState({
      question: data.payload,
      bluePoints: stats.payload.bluePoints,
      redPoints: stats.payload.redPoints,
    })
  }

  getWinner = async () => {
    const data = await client.request("/winner");

    alert(`User: ${data.payload.id} Points: ${data.payload.points} Team: ${data.payload.team}`)
  }

  render() {
    const { question, currentCategory,
      categories, redPoints, bluePoints
    } = this.state;
    const {
      timeout, time
    } = question;

    // const timeDiff = moment.utc(timeout).subtract(moment.utc())

    return (
      <div className="App">
        <div
          className="quiz-image"
          style={{ background: "black" }}
        >
          <img src={question.image} alt="" height="300" style={{ position: "absolute", left: "50%", transform: "translate(-250px)" }} />
          <Button onClick={this.nextQuestion} type="primary">Next Question</Button>
          <Button onClick={this.getWinner} type="secondary" style={{ marginLeft: 10 }}>Find Winner</Button>
        </div>
        <QuizTimer timeout={timeout} duration={time} onFinish={this.evaluateQuestion} />
        <div className="quiz-count-delimiter" />
        <div className="quiz-count">
          <p style={{ textAlign: "center", paddingTop: 0, marginTop: 10 }}>
            <h3 className="quiz-count">{currentCategory}</h3>
          </p>
        </div>
        <div className="quiz-question">
          <h1>
            {question.question}
          </h1>
        </div>
        <div className="quiz-content" style={{ padding: 30 }}>
          <QuizAnswers
            answer1={question.answers[0].text}
            answer2={question.answers[1].text}
            answer3={question.answers[2].text}
            answer4={question.answers[3].text}
            votes={question.votes}
          />
        </div>

        <QuizDuelBar redPoints={redPoints} bluePoints={bluePoints} />
      </div>
    );
  }
}

export default App;
