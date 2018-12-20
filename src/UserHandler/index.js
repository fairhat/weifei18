const shortid = require("shortid")

class UserHandler {
  constructor() {
    this.userList = [];
  }

  addUser() {
    const redCount = this.userList
      .filter(x => x.team === "RED")
      .length;
    
    const blueCount = this.userList
      .filter(x => x.team === "BLUE")
      .length;

    const team = redCount <= blueCount ? "RED" : "BLUE";
    
    const usr = {
      id: shortid.generate(),
      team: team,
      points: 0
    };

    this.userList.push(usr)

    return usr;
  }

  getUser(id) {
    return this.userList.find(x => x.id === id);
  }

  getWinner() {
    let winner = { points: -1 };

    this.userList.forEach(user => {
      if (winner.points < user.points) {
        winner = user;
      }
    })

    return winner;
  }
}

module.exports = UserHandler;