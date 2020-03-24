var status = "new";
var fade_delay = 500;
var name;
var infected = 20;
var uninfected = 7800000000;
var patientsTreated = 0;
var researchLevel = 0;
var researchBonus = 0;
var deathRate = 2.3;
var deaths = 0;

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

  $('input[name="name"]').on("keypress", function(e) {
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
});

function progressButton(button, time, callback) {
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

function researchTreatment() {
  researchLevel = researchLevel + 1;

  $(".research_level").text(researchLevel);

  researchBonus = 1 + researchLevel / 10;

  $(".research_bonus").fadeIn("slow");
  $(".research_bonus_amount").text(researchBonus);
}

function treatInfected() {
  if (researchBonus <= 0) {
    researchBonus = 1;
  }

  infected = infected - Math.round(1 * researchBonus);
  patientsTreated = patientsTreated + Math.round(1 * researchBonus);

  $(".infected").text(numberWithCommas(infected));
  $(".patients_treated").text(numberWithCommas(patientsTreated));

  if (patientsTreated >= 25 && status == "start_main") {
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
      .delay(5000)
      .fadeOut("slow", function() {
        startPrimary();
      });
  });
}

function increaseInfected() {
  var old_infected = infected;
  infected = Math.ceil(infected * 1.025);
  new_infected = infected - old_infected;

  uninfected = uninfected - new_infected;

  deaths = Math.ceil(infected * (deathRate / 100));

  $(".deaths").text(numberWithCommas(deaths));
  $(".infected").text(numberWithCommas(infected));
  $(".uninfected").text(numberWithCommas(uninfected));
}

function save() {
  var save = {
    status: status,
    name: name,
    infected: infected,
    uninfected: uninfected,
    patientsTreated: patientsTreated,
    researchLevel: researchLevel,
    researchBonus: researchBonus,
    deaths: deaths
  };
  localStorage.setItem("save", JSON.stringify(save));
}

function load() {
  var savegame = JSON.parse(localStorage.getItem("save"));

  if (savegame !== null) {
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
  }
  $(".infected").text(numberWithCommas(infected));
  $(".uninfected").text(numberWithCommas(uninfected));
  $(".patients_treated").text(numberWithCommas(patientsTreated));
  $(".deaths").text(numberWithCommas(deaths));

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
    researchLevelProgress: 0
  };
  localStorage.setItem("save", JSON.stringify(save));
  load();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.setInterval(function() {
  increaseInfected();
  save();
}, 1000);
