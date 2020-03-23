var status = "new";
var fade_delay = 500;
var name;
var infected = 1;
var patientsTreated = 0;
var researchLevel = 0;
var researchBonus = 0;

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
  $(".research_bonus").text(researchBonus);
}

function treatInfected() {
  if (researchBonus <= 0) {
    researchBonus = 1;
  }

  infected = infected - Math.round(1 * researchBonus);
  patientsTreated = patientsTreated + Math.round(1 * researchBonus);

  $("#infected").text(infected);

  if (patientsTreated >= 10) {
    $(".patients_treated").text(patientsTreated);
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

function increaseInfected() {
  infected = Math.ceil(infected * 1.01);
  $("#infected").text(infected);
}

function save() {
  var save = {
    status: status,
    name: name,
    infected: infected,
    patientsTreated: patientsTreated,
    researchLevel: researchLevel,
    researchBonus: researchBonus
  };
  localStorage.setItem("save", JSON.stringify(save));
}

function load() {
  var savegame = JSON.parse(localStorage.getItem("save"));

  if (typeof savegame.status !== "undefined") status = savegame.status;
  if (typeof savegame.name !== "undefined") name = savegame.name;
  if (typeof savegame.infected !== "undefined") infected = savegame.infected;
  if (typeof savegame.patientsTreated !== "undefined")
    patientsTreated = savegame.patientsTreated;
  if (typeof savegame.researchLevel !== "undefined")
    researchLevel = savegame.researchLevel;
  if (typeof savegame.researchBonus !== "undefined")
    researchBonus = savegame.researchBonus;

  $("#infected").text(infected);
  $(".research_level").text(researchLevel);
  $(".research_bonus").text(researchBonus);
}

function reset() {
  var save = {
    status: "new",
    name: null,
    infected: 1,
    patientsTreated: 0,
    researchLevel: 0,
    researchLevelProgress: 0
  };
  localStorage.setItem("save", JSON.stringify(save));
  load();
}

window.setInterval(function() {
  increaseInfected();
  save();
}, 1000);
