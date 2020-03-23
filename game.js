var status = "new";
var fade_delay = 500;
var name;
var infected = 1;
var patientsTreated = 0;
var researchLevel = 0;
var researchLevelProgress = 0;

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
        start_main();
        status = "start_main";
      });
    }
  });

  $(".treat_infected").on("click", function(e) {
    e.preventDefault();

    treatInfected();
  });

  $(".research_treatment").on("click", function(e) {
    e.preventDefault();

    researchTreatment();
  });
});

function researchTreatment() {
  researchLevelProgress = researchLevelProgress + 25 / (researchLevel * 1.5);

  if (researchLevelProgress >= 100) {
    researchLevel = researchLevel + 1;
    researchLevelProgress = 0;

    $(".research_level").text(researchLevel);
  }

  $(".research .progress-bar").css("width", researchLevelProgress + "%");
}

function treatInfected() {
  infected = infected - 1;
  patientsTreated = patientsTreated + 1;

  $("#infected").text(infected);

  if (patientsTreated >= 25) {
    $(".patients_treated").text(patientsTreated);
    $(".actions").fadeOut("slow", function() {
      $(".out_of_hand")
        .delay(fade_delay)
        .fadeIn("slow");
    });
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
    researchLevelProgress: researchLevelProgress
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
  if (typeof savegame.researchLevelProgress !== "undefined")
    researchLevelProgress = savegame.researchLevelProgress;

  $("#infected").text(infected);
}

function reset() {
  var save = {
    status: "new",
    name: null,
    infected: 1
  };
  localStorage.setItem("save", JSON.stringify(save));
  load();
}

window.setInterval(function() {
  increaseInfected();
  save();
}, 1000);
