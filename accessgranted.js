/*
Copyright 2018, 2019 Nicholas D. Horne

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

function Game() {
  this.pin = undefined;
  this.entry = "";
  this.entries = [];
  this.buttons = [];
  this.lcd = document.getElementById("lcd");
  this.resetDisplayTimeout = undefined;
  
  for (let i = 0; i < 10; i++) {
    this.buttons[i] = document.getElementById("button" + i);
  }

  this.buttons.forEach(button => {
    button.addEventListener("click", event => {
      if (this.entry.length < 4) {
        this.entry += event.target.textContent;
        this.keyIn();
      }
    });
  });
  
  window.addEventListener("keydown", event => {
    if (/^\d$/.test(event.key)) {
      if (this.entry.length < 4) {
        this.entry += event.key;
        this.keyIn();
      }
    }
  });
}

Game.prototype.updateDisplay = function updateDisplay() {
  this.lcd.style.backgroundColor = "darkgrey";
  this.lcd.textContent = this.entry;
};

Game.prototype.keyIn = function keyIn() {
  clearTimeout(this.resetDisplayTimeout);
  this.updateDisplay();
  if (this.entry.length == 4) {
    setTimeout(() => this.verifyEntry(), 500);
  }
};

Game.prototype.highlightKeys = function highlightKeys() {
  this.buttons.forEach(button => {
    button.style.backgroundColor = "";
  });
  for (let key of this.pin) {
    let button = document.getElementById("button" + key);
    button.style.backgroundColor = "orange";
  }
};

Game.prototype.updateEntries = function updateEntries() {
  this.entries.push(this.entry);
};

Game.prototype.pinGen = function pinGen() {
  this.pin = "";
  for (let i = 0; i < 4; i++) {
    this.pin += Math.floor(Math.random() * 10);
  }
  //print PIN to console for debugging (or cheating)
  //console.log(this.pin);
  this.highlightKeys();
};

Game.prototype.newGame = function newGame(event) {
  event.preventDefault();
  this.pinGen();
  this.entry = "";
  this.entries = [];
  this.updateDisplay();
};

Game.prototype.verifyEntry = function verifyEntry() {
  if (this.entry == this.pin) {
    this.lcd.textContent = "Access Granted";
    this.lcd.style.backgroundColor = "green";
    this.resetDisplayTimeout = setTimeout(() => this.updateDisplay(),
      3000);
    this.updateEntries();
    alert("PIN " + this.pin + " cracked in " + this.entries.length +
      " attempt" + (this.entries.length > 1 ? "s" : ""));
    this.entries = [];
    this.pinGen();
  } else {
    this.lcd.textContent = "Access Denied";
    this.lcd.style.backgroundColor = "red";
    this.resetDisplayTimeout = setTimeout(() => this.updateDisplay(),
      1500);
    this.updateEntries();
  }
  this.entry = "";
};

Game.prototype.about = function about(event) {
  alert("Access Granted JS\n" +
    "\n" +
    "A pointless diversion by Nicholas D. Horne\n" +
    "\n" +
    "Can you actually crack a four-digit PIN on your\n" +
    "first attempt as seen in the movies on a telltale\n" +
    "worn keypad? The \"worn\" keys contained in the\n" +
    "PIN have been highlighted on the keypad. PINs\n" +
    "are four digits in length. Digits may be repeated\n" +
    "resulting in PINs with less than four keys being\n" +
    "highlighted. PINs may begin with zero. Input is\n" +
    "accepted by way of both mouse primary button\n" +
    "and keyboard number keys.");
  event.preventDefault();
};

Game.prototype.start = function start() {
  this.pinGen();
};

let game = new Game();
game.start();

//display instructions dialog box upon page load
window.addEventListener("load", event => game.about(event));
