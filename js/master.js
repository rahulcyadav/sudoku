//var gamecomplete = false;
//var gametype = 1;
//var countx = 0;
//var counto = 0;
var input = "";
var classes = [".row1", ".row2", ".row3", ".row4", ".row5", ".row6", ".row7", ".row8", ".row9", ".col1", ".col2", ".col3", ".col4", ".col5", ".col6", ".col7", ".col8", ".col9", ".topleft", ".top", ".topright", ".left", ".centre", ".right", ".bottomleft", ".bottom", ".bottomright"];

var classes2 = ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8", "row9", "col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8", "col9", "topleft", "top", "topright", "left", "centre", "right", "bottomleft", "bottom", "bottomright"];

var status1 = [false,false,false,false,false,false,false,false,false,false];
var games;

$(document).ready(function(){
		$.getJSON("games.json", function(res) {
			games = res.games;
			if(games.length) {
				$(games).each(function(index,value){
					var opt = $("<option>Game-" + index + " " + this.difficulty + "</option>").attr("value", index);
					$("select").append(opt);
				});
			}
		});
	
	$("#board td").click(function(){
		if(!($(this).hasClass("locked"))){
			$("#selected").removeAttr("id");
			$(this).attr("id", "selected");
		}
	});
	
	$(".inputbutton").click(function(){
		input = $(this).html();
		if(input === "clear"){
			$("#selected").empty().addClass("empty").removeClass("possible userInput");
		}else{
			$("#selected").html(input).addClass("userInput").removeClass("empty possible");
		}
	});
});

function lock(){
	$("#selected").removeAttr("id");
	$("#board td").each(function(){
		if($(this).html() !== "" && !($(this).hasClass("possible"))){
			$(this).addClass("locked");
		}
	});
	$("#lock").attr({"value":"Unlock", "onclick":"unlock()"});
}

function unlock(){
	$(".locked").each(function(){
		$(this).removeClass("locked");
	});
	$("#lock").attr({"value":"Lock", "onclick":"lock()"});
}



function validate(){
	$(".marked").removeClass("marked");
	$(classes2).each(function(index,value){
		//console.log(this);
		$("#board ." + this).each(function(){
			if($(this).html() != ""){
				if(status1[parseInt($(this).html(),10)]){
					var current = $(this).html();
					$("." + value).each(function(){//debugger
						if($(this).html() === current){
							$(this).addClass( "marked" );
						}
					});
				} else{
					status1[parseInt($(this).html(),10)] = true;
				}
			}
		});
		status1 = [false,false,false,false,false,false,false,false,false,false];
	});
}

function solve(){
	showPossible();
	
	//pass1
	$(".possible").each(function(){
		var current = this;
		var count = 0;
		var temp = 0;
		
		$("td",this).each(function(){
			if($(this).html() !== ""){
				count++;
				temp = $(this).html();
			}
		});
		
		//finalize where only one possible
		if(count === 1){
			$(this).html(temp).removeClass("empty possible").addClass("solved");
			$(classes2).each(function(){
				if($(current).hasClass(this)){
					$("." + this).each(function(){
						$("td",this).each(function(){
							if($(this).html() == temp){
								$(this).empty();
							}
						});
					});
				}
			});
		}
		count = 0;
		temp = 0;
	});
	
	//pass2
	//finalize when a number is possible only once in a class
	$(classes2).each(function(){
		var possibleCount = [0,0,0,0,0,0,0,0,0];
		$("." + this).each(function(){
			$("td",this).each(function(){//debugger
				if($(this).html() != ""){
					possibleCount[parseInt($(this).html(),10) - 1]++;
				}
			});
		});
		//console.log(value);
		//debugger
		$("." + this).each(function(){//debugger
			var current1 = this;
			$("td",this).each(function(){
				if($(this).html() != ""){
					if(possibleCount[parseInt($(this).html(),10) - 1] === 1){
						var temp1 = $(this).html();
						$(current1).html(temp1).addClass("solved1").removeClass("empty possible");
						$(classes2).each(function(){
							if($(current1).hasClass(this)){
								$("." + this).each(function(){
									$("td",this).each(function(){
										if($(this).html() === temp1){
											$(this).empty();
										}
									});
								});
							}
						});
					}
				}
			});
		});
	});
}




function showPossible(){
	//mark empty cells
	$("#board td").each(function(){
		if($(this).html() === ""){
			$(this).addClass("empty");
		}
	});
	
	//mark possible numbers in empty cells
	$(".empty").each(function(){
		$(this).empty();
		var current = this;
		var count = 0;
		var temp = 0;
		var i = 0;
		
		$(classes2).each(function(index,value){
			if($(current).hasClass(this)){
				$("#board ." + this).each(function(){
					if(!$(this).hasClass("empty")){
						//console.log(this);
						status1[parseInt($(this).html(),10)] = true;
					}
				});
			}	
		});
		
		for(i = 1;i<=9;i++){
			if(!status1[i]){
				count++;
				temp = i;
			}
		}
		
		$(this).html("<table><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>").addClass("possible");
		
		$("td",this).each(function(index){
			if(!status1[index+1]){
				$(this).html(index+1);
			}
		});
		status1 = [false,false,false,false,false,false,false,false,false,false];
	});
}

function showSolution(){
	$("#solution").show();
	$("#showSolution").attr({"value":"Hide Solution", "onclick":"hideSolution()"});
}

function hideSolution(){
	$("#solution").hide();
	$("#showSolution").attr({"value":"Show Solution", "onclick":"showSolution()"});
}

function clearPossible(){
	$(".possible").empty().removeClass("possible");
}

function loadGame(){
	var loadClasses = [".row1", ".row2", ".row3", ".row4", ".row5", ".row6", ".row7", ".row8", ".row9"];
	
	$("#solution").hide();
	$("#board td").removeClass("marked empty possible locked solved solved1 userInput");
	$("#selected").removeAttr("id");
	
	$(loadClasses).each(function(index,value){
		var upperIndex = index;
		$("#board " + value).each(function(index){
			var game;
			var solution;
			if($("select").val() == "blank"){
				game = 0;
				solution = 0;
			} else{
				var game = games[$("select").val()]["game"][upperIndex][index];
				var solution = games[$("select").val()]["solution"][upperIndex][index];
			}
			
			if(game == 0){
				$(this).empty();
			} else{
				$(this).html(game).addClass("locked");
			}
			
			if(solution == 0){
				$("#solution " + value + ":eq(" + index + ")").empty();
			} else{
				$("#solution " + value + ":eq(" + index + ")").html(solution);
			}
		});
	});
}

function dummy(){
	//$("select").html("<option value='volvo'>Rahul</option>");
	//console.log(games);
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}