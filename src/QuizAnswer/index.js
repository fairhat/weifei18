import React from "react";
import PropTypes from "prop-types";
import { Layout, Col, Row } from "antd";

export default class QuizAnswers extends React.Component {
  static propTypes = {
    answerText: PropTypes.string,
    blueVote: PropTypes.number,
    redVote: PropTypes.number,
    totalVote: PropTypes.number,
    identifier: PropTypes.string,
  };

  static defaultProps = {
    answerText: "Antwort XYZ",
    blueVote: 0,
    redVote: 0,
    totalVote: 0,
    identifier: "A"
  };

  state = {
    blueVote: this.props.blueVote,
    redVote: this.props.redVote,
  }

  render() {
    const { answerText } = this.props;
    return (
      <Col span={12}>
        <div className="quiz-answer">
          <h2>
            {answerText}
          </h2>
          <div
            className="vote-bars"
            style={{
              position: "absolute",
              width: 110,
              height: "100%",
              background: "#eee",
              top: 0
            }}
          >
            <div
              className="vote-red"
              style={{
                display: "block",
                position: "absolute",
                left: 0,
                bottom: 0,
                width: 50,
                height: `100%`,
                transition: "height 500ms ease-out",
                background: "#ff4d4d",
                color: "black",
                fontWeight: "bold",
              }}
            >{this.props.redVote}</div>
            <div
              className="vote-blue"
              style={{
                display: "block",
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 50,
                height: `100%`,
                transition: "height 500ms ease-out",
                background: "#57b8ff",
                color: "black",
                fontWeight: "bold",
              }}
            >{this.props.blueVote}</div>
          </div>
          <div style={{
            display: "table",
            position: "absolute",
            right: 10,
            bottom: 0,
            width: 50,
            fontSize: "32px",
            fontWeight: "bold",
            height: "100%",
            textAlign: "center",
            verticalAlign: "middle",
            color: "white",
            paddingLeft: 10,
            paddingRight: 10,
            background: "black"
          }}>{this.props.identifier}</div>
        </div>
      </Col>
    );
  }
}
