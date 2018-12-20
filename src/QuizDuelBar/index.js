import React from "react";
import PropTypes from "prop-types";

export default class QuizDuelBar extends React.Component {
  static propTypes = {
    percentage: PropTypes.number,
    redPoints: PropTypes.number,
    bluePoints: PropTypes.number,
  };

  static defaultProps = {
    percentage: 50,
    redPoints: 100,
    bluePoints: 70,
  };

  render() {
    const { redPoints, bluePoints } = this.props;
    const totalPoints = redPoints + bluePoints;
    const percentage = totalPoints === 0 ? 50 : 100 * redPoints / totalPoints;

    return (
      <div
        style={{
          position: "fixed",
          width: "100vw",
          left: 0,
          bottom: 0,
          height: "80px",
          background: "#57b8ff"
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${percentage}%`,
            transition: "width 500ms ease-out",
            background: "#ff4d4d",
            height: "100%",
            display: "inline-block"
          }}
        />
        <div
          style={{
            position: "absolute",
            background: "white",
            width: "100px",
            height: "100px",
            borderRadius: 50,
            display: "inline-block",
            border: "5px inset black",
            left: `${percentage}%`,
            transition: "left 500ms ease-out",
            bottom: 0,
            transform: "translate(-50px)",
          }}
        ><h4 style={{ color: "black", textAlign: "center", fontWeight: "800", transform: "translate(0, 30px)" }}>WeiFei '18 Quiz</h4></div>
        <div
          style={{
            position: "absolute",
            fontSize: "32px",
            display: "inline-block",
            color: "black",
            fontWeight: "bold",
            top: 15,
            left: `${percentage}%`,
            transition: "left 500ms ease-out",
            transform: "translate(-150px)"
          }}>
          {redPoints}
        </div>
        <div
          style={{
            position: "absolute",
            fontSize: "32px",
            display: "inline-block",
            color: "black",
            fontWeight: "bold",
            top: 15,
            left: `${percentage}%`,
            transition: "left 500ms ease-out",
            transform: "translate(100px)"
          }}>
          {bluePoints}
        </div>
      </div>
    );
  }
}
