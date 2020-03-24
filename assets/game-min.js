var name,game_start,previous_infected,status="new",fade_delay=500,infected=30,uninfected=78e8,patientsTreated=0,researchLevel=0,researchBonus=0,deathRate=2.3,deaths=0,doctors=0,day=1,day_length=10;function progressButton(e,t,a){e.is(":not(:disabled)")&&(e.prop("disabled",!0),e.find(".progress").animate({width:"100%"},t,"swing",(function(){$(this).parent().prop("disabled",!1),$(this).width("0%"),a()})))}function researchTreatment(){researchLevel+=1,$(".research_level").text(researchLevel),researchBonus=1+researchLevel/10,$(".research_bonus").fadeIn("slow"),$(".research_bonus_amount").text(researchBonus)}function hireDoctor(){doctors+=1,$(".doctors").text(doctors)}function treatInfected(){researchBonus<=0&&(researchBonus=1),infected-=Math.round(1*researchBonus),patientsTreated+=Math.round(1*researchBonus),$(".infected").text(numberWithCommas(infected)),$(".patients_treated").text(numberWithCommas(patientsTreated)),patientsTreated>=20&&"start_main"==status?$(".main").fadeOut("slow",(function(){status="start_more_tools",startMoreTools()})):patientsTreated>=8&&"start_main"==status&&$(".out_of_hand").fadeIn("slow")}function startMain(){$(".main h1").text("Hi there, "+name+"!"),$(".main").fadeIn("slow",(function(){$(".actions").delay(300).fadeIn()}))}function startPrimary(){status="start_primary",$(".primary").fadeIn("slow")}function startMoreTools(){$(".more_tools").fadeIn("slow",(function(){$(".more_tools").delay(3500).fadeOut("slow",(function(){startPrimary()}))}))}function increaseInfected(){var e=infected;infected=Math.ceil(1.03*infected),new_infected=infected-e,uninfected-=new_infected,deaths=Math.ceil(infected*(deathRate/100)),$(".deaths").text(numberWithCommas(deaths)),$(".infected").text(numberWithCommas(infected)),$(".uninfected").text(numberWithCommas(uninfected))}function deployDoctors(){doctors>0&&(speed=1e3-100*doctors,progressButton($(".treat_infected"),speed,treatInfected))}function dayCounter(){current=Math.floor(Date.now()/1e3),day=Math.floor((current-game_start)/day_length),$(".days_elapsed").text(numberWithCommas(day))}function save(){var e=JSON.parse(localStorage.getItem("save"));game_start=null!==e?void 0===e.game_start?Math.floor(Date.now()/1e3):e.game_start:Math.floor(Date.now()/1e3);var t={status:status,name:name,infected:infected,uninfected:uninfected,patientsTreated:patientsTreated,researchLevel:researchLevel,researchBonus:researchBonus,deaths:deaths,doctors:doctors,day:day,game_start:game_start};localStorage.setItem("save",JSON.stringify(t))}function load(){var e=JSON.parse(localStorage.getItem("save"));null!==e&&(void 0!==e.status&&(status=e.status),void 0!==e.name&&(name=e.name),void 0!==e.infected&&(infected=e.infected),void 0!==e.uninfected&&(uninfected=e.uninfected),void 0!==e.deaths&&(deaths=e.deaths),void 0!==e.patientsTreated&&(patientsTreated=e.patientsTreated),void 0!==e.researchLevel&&(researchLevel=e.researchLevel),void 0!==e.researchBonus&&(researchBonus=e.researchBonus),void 0!==e.doctors&&(doctors=e.doctors),void 0!==e.day&&(day=e.day)),$(".infected").text(numberWithCommas(infected)),$(".uninfected").text(numberWithCommas(uninfected)),$(".patients_treated").text(numberWithCommas(patientsTreated)),$(".deaths").text(numberWithCommas(deaths)),$(".doctors").text(numberWithCommas(doctors)),$(".days_elapsed").text(numberWithCommas(day)),$(".research_level").text(researchLevel),researchBonus>1&&$(".research_bonus").show(),$(".research_bonus_amount").text(researchBonus)}function reset(){var e={status:"new",name:null,infected:20,uninfected:78e8,patientsTreated:0,researchLevel:0,researchBonus:0,deaths:0,doctors:0,day:1,game_start:Math.floor(Date.now()/1e3)};localStorage.setItem("save",JSON.stringify(e)),load()}function numberWithCommas(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}$(document).ready((function(){load(),"new"==status?$(".start h1").fadeIn("slow",(function(){$(".data").delay(fade_delay).fadeIn("slow",(function(){$(".message p:first").delay(fade_delay).fadeIn("slow",(function(){$(".message p:last").delay(fade_delay).fadeIn("slow",(function(){$(".name").delay(fade_delay).fadeIn("slow")}))}))}))})):"start_main"==status?startMain():"start_primary"==status&&startPrimary(),$('input[name="nameSearch"]').on("keypress",(function(e){"13"==(e.keyCode?e.keyCode:e.which)&&(name=$(this).val(),$(".start").fadeOut("slow",(function(){startMain(),status="start_main"})))})),$(".treat_infected").on("click",(function(e){e.preventDefault(),progressButton($(this),1e3,treatInfected)})),$(".research_treatment").on("click",(function(e){e.preventDefault(),progressButton($(this),3500,researchTreatment)})),$(".hire_doctor").on("click",(function(e){e.preventDefault(),progressButton($(this),1e4,hireDoctor)}))})),window.setInterval((function(){increaseInfected(),deployDoctors(),dayCounter(),save()}),100);