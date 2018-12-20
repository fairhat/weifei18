import React from "react";
import PropTypes from "prop-types";
import QuizAnswer from "../QuizAnswer/";
import { Layout, Col, Row } from "antd";

export default class QuizAnswers extends React.Component {
  static propTypes = {
    answer1: PropTypes.string,
    answer2: PropTypes.string,
    answer3: PropTypes.string,
    answer4: PropTypes.string,
    votes: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    answer1: "Antwort A",
    answer2: "Antwort B",
    answer3: "Antwort C",
    answer4: "Antwort D",
    votes: []
  }

  render() {
    const { answer1, answer2, answer3, answer4, votes } = this.props;
    const redVoteA = this.props.votes.filter(x => x.team === "RED" && x.answer === 1);
    const redVoteB = this.props.votes.filter(x => x.team === "RED" && x.answer === 2);
    const redVoteC = this.props.votes.filter(x => x.team === "RED" && x.answer === 3);
    const redVoteD = this.props.votes.filter(x => x.team === "RED" && x.answer === 4);
    
    const blueVoteA = this.props.votes.filter(x => x.team === "BLUE" && x.answer === 1);
    const blueVoteB = this.props.votes.filter(x => x.team === "BLUE" && x.answer === 2);
    const blueVoteC = this.props.votes.filter(x => x.team === "BLUE" && x.answer === 3);
    const blueVoteD = this.props.votes.filter(x => x.team === "BLUE" && x.answer === 4);
    
    
    return (
      <Layout style={{ background: "none" }}>
        <Row gutter={30}>
          <QuizAnswer answerText={answer1} identifier="A" redVote={redVoteA.length} blueVote={blueVoteA.length} />
          <QuizAnswer answerText={answer2} identifier="B" redVote={redVoteB.length} blueVote={blueVoteB.length} />
        </Row>
        <Row gutter={30} style={{ marginTop: 30 }}>
          <QuizAnswer answerText={answer3} identifier="C" redVote={redVoteC.length} blueVote={blueVoteC.length} />
          <QuizAnswer answerText={answer4} identifier="D" redVote={redVoteD.length} blueVote={blueVoteD.length} />
        </Row>
      </Layout>
    );
  }
}
