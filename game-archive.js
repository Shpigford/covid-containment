var infected = 1;
var currentInfected;
var viralKnowledge = 0;
var currentViralKnowledge = 1;
var currentKnowledgeBonus;
var knowledgeBonus = 0;

function increaseInfected() {
  infected = Math.ceil(infected * 1.1);
  document.getElementById("infected").innerHTML = infected;
}

function treatInfected() {
  currentInfected = +document.getElementById("infected").innerHTML;
  currentKnowledgeBonus = +document.getElementById("knowledge_bonus").innerHTML;

  if (currentKnowledgeBonus <= 0) {
    currentKnowledgeBonus = 1;
  }

  infected = currentInfected - Math.round(1 * currentKnowledgeBonus);

  if (infected < 0) {
    infected = 1;
  }

  document.getElementById("infected").innerHTML = infected;
}

function research() {
  currentViralKnowledge = +document.getElementById("viral_knowledge").innerHTML;
  viralKnowledge = Math.ceil(currentViralKnowledge + 1);

  document.getElementById("knowledge_bonus").innerHTML = (
    1 +
    viralKnowledge / 100
  ).toFixed(2);
  document.getElementById("viral_knowledge").innerHTML = viralKnowledge;
}

var fans = 0;
var fakeFans = 0;

function fanClick(number) {
  fans = fans + number;
  document.getElementById("fans").innerHTML = fans;
}

function buyFan() {
  var fanCost = Math.floor(10 * Math.pow(1.1, fakeFans)); //works out the cost of this cursor
  if (fans >= fanCost) {
    //checks that the player can afford the cursor
    fakeFans = fakeFans + 1; //increases number of cursors
    fans = fans - fanCost; //removes the cookies spent
    document.getElementById("fakeFans").innerHTML = fakeFans; //updates the number of cursors for the user
    document.getElementById("fans").innerHTML = fans; //updates the number of coofansies for the user
  }
  var nextCost = Math.floor(10 * Math.pow(1.1, fakeFans)); //works out the cost of the next cursor
  document.getElementById("fanCost").innerHTML = nextCost; //updates the cursor cost for the user
}

window.setInterval(function() {
  increaseInfected();
}, 1000);
