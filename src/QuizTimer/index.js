import React from "react";
import PropTypes from "prop-types";
import moment from "moment"

export default class QuizTimer extends React.Component {
  static propTypes = {
    timeout: PropTypes.string,
    duration: PropTypes.number,
  }

  static defaultProps = {
    timeout: "",
    duration: 50
  }

  state = {
    timeLeft: 40,
    finished: false
  }

  componentDidMount() {
    this.tick()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timeout !== this.props.timeout) {
      this.setState({ finished: false });
    }

    this.tick(nextProps.timeout)
  }
  
  tick = (timer = this.props.timeout) => {
    const tTimeout = moment.utc(timer);
    const diff = tTimeout.diff(moment.utc())
    const timeLeft = moment.duration(diff).get("seconds")
    this.setState({ timeLeft });

    if (timeLeft >= 0) {
      setTimeout(() => this.tick(), 500);
    } else if (!this.state.finished) {
      this.props.onFinish();
      this.setState({ finished: true })
    }
  }

  render() {
    const width = 100 * this.state.timeLeft / this.props.duration;
    return (
      <div className="quiz-timer">
        <div className="quiz-timer-red" style={{ width: `${width}%` }}/>
      </div>
    )
  }
}