var status = "new";
var fade_delay = 500;
var name;
var infected = 1;

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
});

function start_main() {
  $(".main h1").text("Hi there, " + name + "!");
  $(".main").fadeIn("slow");
}

function increaseInfected() {
  infected = Math.ceil(infected * 1.01);
  $("#infected").text(infected);
}

function save() {
  var save = {
    status: status,
    name: name,
    infected: infected
  };
  localStorage.setItem("save", JSON.stringify(save));
}

function load() {
  var savegame = JSON.parse(localStorage.getItem("save"));

  if (typeof savegame.status !== "undefined") status = savegame.status;
  if (typeof savegame.name !== "undefined") name = savegame.name;
  if (typeof savegame.infected !== "undefined") infected = savegame.infected;

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
