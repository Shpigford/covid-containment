var status = "new";
var fade_delay = 500;
var name;
var infected = 30;
var uninfected = 7800000000;
var patientsTreated = 0;
var researchLevel = 0;
var researchBonus = 0;
var deathRate = 2.3;
var deaths = 0;
var doctors = 0;
var day = 1;
var day_length = 10; // In seconds
var game_start;
var previous_infected;

$(document).ready(function() {
  load();

  if (status == "new") {
    $(".start h1").fadeIn("slow", function() {
      $(".data")
        .delay(fade_delay)
        .fadeIn("slow", function() {
          $(".message p:first")
            .delay(fade_delay)
            .fadeIn("slow", function() {
              $(".message p:last")
                .delay(fade_delay)
                .fadeIn("slow", function() {
                  $(".name")
                    .delay(fade_delay)
                    .fadeIn("slow");
                });
            });
        });
    });
  } else if (status == "start_main") {
    startMain();
  } else if (status == "start_primary") {
    startPrimary();
  }

  $('input[name="nameSearch"]').on("keypress", function(e) {
    var keycode = e.keyCode ? e.keyCode : e.which;
    if (keycode == "13") {
      name = $(this).val();
      $(".start").fadeOut("slow", function() {
        startMain();
        status = "start_main";
      });
    }
  });

  $(".treat_infected").on("click", function(e) {
    e.preventDefault();

    progressButton($(this), 1000, treatInfected);
  });

  $(".research_treatment").on("click", function(e) {
    e.preventDefault();

    progressButton($(this), 3500, researchTreatment);
  });

  $(".hire_doctor").on("click", function(e) {
    e.preventDefault();

    progressButton($(this), 10000, hireDoctor);
  });
});

function progressButton(button, time, callback) {
  if (button.is(":not(:disabled)")) {
    button.prop("disabled", true);

    button.find(".progress").animate(
      {
        width: "100%"
      },
      time,
      "swing",
      function() {
        $(this)
          .parent()
          .prop("disabled", false);
        $(this).width("0%");
        callback();
      }
    );
  }
}

function researchTreatment() {
  researchLevel = researchLevel + 1;

  $(".research_level").text(researchLevel);

  researchBonus = 1 + researchLevel / 10;

  $(".research_bonus").fadeIn("slow");
  $(".research_bonus_amount").text(researchBonus);
}

function hireDoctor() {
  doctors = doctors + 1;
  $(".doctors").text(doctors);
}

function treatInfected() {
  if (researchBonus <= 0) {
    researchBonus = 1;
  }

  infected = infected - Math.round(1 * researchBonus);
  patientsTreated = patientsTreated + Math.round(1 * researchBonus);

  $(".infected").text(numberWithCommas(infected));
  $(".patients_treated").text(numberWithCommas(patientsTreated));

  if (patientsTreated >= 20 && status == "start_main") {
    $(".main").fadeOut("slow", function() {
      status = "start_more_tools";
      startMoreTools();
    });
  } else if (patientsTreated >= 8 && status == "start_main") {
    $(".out_of_hand").fadeIn("slow");
  }
}

function startMain() {
  $(".main h1").text("Hi there, " + name + "!");
  $(".main").fadeIn("slow", function() {
    $(".actions")
      .delay(300)
      .fadeIn();
  });
}

function startPrimary() {
  status = "start_primary";
  $(".primary").fadeIn("slow");
}

function startMoreTools() {
  $(".more_tools").fadeIn("slow", function() {
    $(".more_tools")
      .delay(3500)
      .fadeOut("slow", function() {
        startPrimary();
      });
  });
}

function increaseInfected() {
  var old_infected = infected;
  infected = Math.ceil(infected * 1.02);
  new_infected = infected - old_infected;

  uninfected = uninfected - new_infected;

  deaths = Math.ceil(infected * (deathRate / 100));

  $(".deaths").text(numberWithCommas(deaths));
  $(".infected").text(numberWithCommas(infected));
  $(".uninfected").text(numberWithCommas(uninfected));
}

function deployDoctors() {
  if (doctors > 0) {
    //$(".treat_infected:not(:disabled)").trigger("click");
    speed = 1000 - doctors * 100;
    progressButton($(".treat_infected"), speed, treatInfected);
  }
}

function dayCounter() {
  current = Math.floor(Date.now() / 1000);
  day = Math.floor((current - game_start) / day_length);

  $(".days_elapsed").text(numberWithCommas(day));
}

function save() {
  var savegame = JSON.parse(localStorage.getItem("save"));

  if (savegame !== null) {
    if (typeof savegame.game_start == "undefined") {
      game_start = Math.floor(Date.now() / 1000);
    } else {
      game_start = savegame.game_start;
    }
  } else {
    game_start = Math.floor(Date.now() / 1000);
  }

  var save = {
    status: status,
    name: name,
    infected: infected,
    uninfected: uninfected,
    patientsTreated: patientsTreated,
    researchLevel: researchLevel,
    researchBonus: researchBonus,
    deaths: deaths,
    doctors: doctors,
    day: day,
    game_start: game_start
  };
  localStorage.setItem("save", JSON.stringify(save));
}

function load() {
  var savegame = JSON.parse(localStorage.getItem("save"));

  if (savegame !== null) {
    if (typeof savegame.status !== "undefined") status = savegame.status;
    if (typeof savegame.name !== "undefined") name = savegame.name;
    if (typeof savegame.infected !== "undefined") infected = savegame.infected;
    if (typeof savegame.uninfected !== "undefined")
      uninfected = savegame.uninfected;
    if (typeof savegame.deaths !== "undefined") deaths = savegame.deaths;
    if (typeof savegame.patientsTreated !== "undefined")
      patientsTreated = savegame.patientsTreated;
    if (typeof savegame.researchLevel !== "undefined")
      researchLevel = savegame.researchLevel;
    if (typeof savegame.researchBonus !== "undefined")
      researchBonus = savegame.researchBonus;
    if (typeof savegame.doctors !== "undefined") doctors = savegame.doctors;
    if (typeof savegame.day !== "undefined") day = savegame.day;
  }

  $(".infected").text(numberWithCommas(infected));
  $(".uninfected").text(numberWithCommas(uninfected));
  $(".patients_treated").text(numberWithCommas(patientsTreated));
  $(".deaths").text(numberWithCommas(deaths));
  $(".doctors").text(numberWithCommas(doctors));
  $(".days_elapsed").text(numberWithCommas(day));

  $(".research_level").text(researchLevel);
  if (researchBonus > 1) {
    $(".research_bonus").show();
  }
  $(".research_bonus_amount").text(researchBonus);
}

function reset() {
  var save = {
    status: "new",
    name: null,
    infected: 20,
    uninfected: 7800000000,
    patientsTreated: 0,
    researchLevel: 0,
    researchBonus: 0,
    deaths: 0,
    doctors: 0,
    day: 1,
    game_start: Math.floor(Date.now() / 1000)
  };
  localStorage.setItem("save", JSON.stringify(save));
  load();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.setInterval(function() {
  if (Math.random() > 0.82) {
    increaseInfected();
  }
  deployDoctors();
  dayCounter();
  save();
}, 100);
