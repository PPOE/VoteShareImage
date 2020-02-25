$(document).ready(function(){

	$( "#setting" ).tabs({
      collapsible: true
    });
		
	$.each(deligated, function(key, val){

		$.each(parties, function(index, party){
			if(party.party === val.party){
				parties[index].deligated.push(val);
			}
		})
	})

	$.each(parties, function(index, party){
		$('#deleg').append("<div class='group_party' id='part_" + party.party+ "'><div class='party_name'>" + party.party + "</div></div>");
		$.each(party.deligated, function(key, del){
			let id_name = del.name.replace(/\s/g, '');
			$('#part_'+ party.party).append("<div class='deleg_select' id='deleg_"+ id_name +"'><span class='deleg_name'> "+ del.name +" </span><span delid='"+id_name+"' class='selector sel_A' >A</span><span delid='"+id_name+"' class='selector sel_E'>E</span><span delid='"+id_name+"' class='selector sel_Z'>Z</span><span delid='"+id_name+"' class='selector sel_N'>N</span></div>");
			$('#deleg_'+id_name + ' .selector' ).on('click', function(){
				//console.log("Select " + $('#deleg_' + $(this).attr("delid") + ' .deleg_name' ).html() + " set to "  + $(this).html() );
				del.behavior = $(this).html();
				//console.log(JSON.stringify(party.deligated)); 
				$('#deleg_' + $(this).attr("delid") + ' .selector').removeClass('sel_selector');
				$(this).addClass('sel_selector');
				calc_behavior();
			})
		})
	})

	$.each(config.logo, function (ind, log){
		$('#logoset').append("<option value='" + log.src + "'>" + log.src + "</option>")
	})

function calc_behavior(){

	var max = 0;
	$.each(parties, function(index, party){

		parties[index].behave_A = 0;
		parties[index].behave_E = 0;
		parties[index].behave_Z = 0;
		parties[index].behave_N = 0;

		$.each(party.deligated, function(ind, del){
			if(del.behavior === "A") ++parties[index].behave_A ;
			if(del.behavior === "Z") ++parties[index].behave_Z ;
			if(del.behavior === "E") ++parties[index].behave_E ;
			if(del.behavior === "N") ++parties[index].behave_N ;
		})

		if(party.deligated.length > max) max=party.deligated.length;
	})

	//console.log("Max are " + max +" Dele");
	draw(max);
}

function draw_deleg(){
	$('#bydeligated').html("");
	$.each(parties, function(index, party){
		$.each(party.deligated, function(ind, del){
			var color="";
			switch (del.behavior) {
				case "E":
					color="yellow";
					break;
				case "A":
					color="red";
					break;
				case "Z":
					color="green";
					break;
				case "N":
					color="#626262";
					break;
			
				default:
					
			}

			$('#bydeligated').append("<div class='del_holder' id='d"+ index +"_"+ ind +"_hold'></div>");
			$("#d"+ index +"_"+ ind +"_hold").append("<div class='list_name'>"+del.name+"</div>");
			$("#d"+ index +"_"+ ind +"_hold").append("<div class='list_logo'><img src='src/assets/"+party.image+"'></div>");
			$("#d"+ index +"_"+ ind +"_hold").append("<div class='list_behave' style='background-color: "+color+"; '></div>");
		})
	})
}

function draw( range ){

	var myChart = Array();
	$('#byparty').html("");
	var i = 0;

	$.each(parties, function(index, party){
	
		let set_max = 0;

		switch ($('#scale_type').val()) {
			case "max":
				set_max = range;
				break;	
			case "equal":
			
				set_max = party.deligated.length;
				break;
		
		}

		$('#byparty').append("<div class='gr_party'> <div class='gr_name'>" + party.party + "</div><div class='gr_img_holder' ><img height='20px' src='' id='i" +i+ "_img' class='gr_logo'></div><div class='can_container' id='c_holder" +i+ "_stats' ></div></div>");
		$("#i"+i+ "_img").attr("src", "src/assets/"+ party.image );


		switch ($('#graphen').val()) {
			case "cjs":
				$("#c_holder" +i+ "_stats").html("<canvas style='display: block; width: 520px; height: 47px;' class='gr_stats' id='c" +i+ "_stats' ></canvas>");

				let ctx = document.getElementById( "c" + i +"_stats" );

				myChart[i] = new Chart(ctx, {
				type: 'horizontalBar',
				data: {
					datasets: [{
							label: 'Ablehnung',
							backgroundColor: "red",
							data: [
								party.behave_A
							]
						}, {
							label: 'Enthalten',
							backgroundColor: "yellow",
							data: [
								party.behave_E
							]
						}, {
							label: 'Zustimmung',
							backgroundColor: "green",
							data: [
								party.behave_Z
							]
						}, {
							label: 'nichtanwesend',
							backgroundColor: "#626262",
							data: [
								party.behave_N
							]
						}]
				},
				options: {
					tooltips: {
						mode: 'y',
						intersect: true,
						position: 'average'
					},
					legend:{
						display: false
					},
					responsive: true,
					scales: {
						xAxes: [{
							stacked: true,
							ticks: {
								beginAtZero: false,
								stepSize: 1,
								
								suggestedMax: set_max
							}
						}
					],
						yAxes: [{
							stacked: true,

						}]
					}
				}
			});
			
			break;

			case "nero":
				
					let pr_A = (party.behave_A * 100) / set_max; 
					let pr_E = (party.behave_E * 100) / set_max; 
					let pr_Z = (party.behave_Z * 100) / set_max; 
					let pr_N = (party.behave_N * 100) / set_max; 



				$("#c_holder" +i+ "_stats").html("");
				if(party.behave_A > 0 ){
					$("#c_holder" +i+ "_stats").append("<div class='nerograf sel_A nero_count_A' style='width: "+ pr_A +"%'><span class='nero_number'>" + party.behave_A + "</span></div>");
				}
				if(party.behave_E > 0 ){
					$("#c_holder" +i+ "_stats").append("<div class='nerograf sel_E nero_count_E' style='width: "+ pr_E +"%'><span class='nero_number'>" + party.behave_E + "</span></div>");
				}
				if(party.behave_Z > 0 ){
					$("#c_holder" +i+ "_stats").append("<div class='nerograf sel_Z nero_count_Z' style='width: "+ pr_Z +"%'><span class='nero_number'>" + party.behave_Z + "</span></div>");
				}
				if(party.behave_N > 0 ){
					$("#c_holder" +i+ "_stats").append("<div class='nerograf sel_N nero_count_N' style='width: "+ pr_N +"%'><span class='nero_number'>" + party.behave_N + "</span></div>");
				}
			break;

		}
		i++;
	});
draw_deleg()
}

$('#options, #scale_type').on('change', calc_behavior);
//header
$('#location, #title_text, #datepicker, #ref_text, #orig_title_text, #logoset').on('change', set_header)




function set_header(){
	let loc = $('#location').val();
	let title = $('#title_text').val();
	let origtitle = $('#orig_title_text').val();
	let date = $('#datepicker').val();
	let ref = $('#ref_text').val();
	$('.vote_date').html("Abstimmung vom "+ date + " im " + loc +  ". Ref:  " + ref );
	$('.title').html(title);
	$('.title_small').html(origtitle);
	$('#logo_img').attr("src", "src/assets/" + $('#logoset').val());
}

 $( "#datepicker" ).datepicker();
 $( "#datepicker" ).datepicker("option", "dateFormat", "dd.mm.yy");




//result
$('#res_conf_pirates, #res_conf_eu').on('change', function (){set_result($( this ));} ); 

function set_result(target){

	switch (target.val()) {
		case "0":
			$('.' + target.attr('target')).html(target.children("option:selected").html());
			$('.' + target.attr('target')).removeClass("agree");
	
			$('.' + target.attr('target') + '_title').removeClass("hidden");
			$('.' + target.attr('target')).addClass("disagree");
			break;
		case "1":
			$('.' + target.attr('target')).html(target.children("option:selected").html());
			$('.' + target.attr('target')).removeClass("disagree");

			$('.' + target.attr('target') + '_title').removeClass("hidden");
			$('.' + target.attr('target')).addClass("agree");			
			break;
	
		default:
			$('.' + target.attr('target')).html("");
			$('.' + target.attr('target')).removeClass("disagree");
			$('.' + target.attr('target')).removeClass("agree");		

			$('.' + target.attr('target') + '_title').addClass("hidden");	
			break;
	}
}




	$('.f_cont_1').html(config.footer.left);
	$('#footer_left').val(config.footer.left);
	$('.f_cont_3').html(config.footer.right);
	$('#footer_right').val(config.footer.right);

	$('#footer_left').on('change', function(){
		$('.f_cont_1').html($('#footer_left').val());
	})
	$('#footer_right').on('change', function(){
		$('.f_cont_3').html($('#footer_right').val());
	})


let newCanvas;
$('#close_bb').on('click', function(){
	$("#blackbox").addClass("hidden");
})

function genCanvas(){
	$("#blackbox").removeClass("hidden");
	html2canvas(document.querySelector("#preview"), {scale: 1, scrollX: true, scrollX: true, x: 0, y: 0}).then(canvas => {
		
		$('#bb_canv').html(canvas);
		newCanvas = canvas;

	});
}

let viewset;
function set_view(){
 
}

$('#view, .view_ch').on('change', function(){
	if($(this).val() === "party"){
		$("#bydeligated").addClass('hidden');
		$("#byparty").removeClass('hidden');
	}

	if($(this).val() === "deleg"){	
		$("#byparty").addClass('hidden');
		$("#bydeligated").removeClass('hidden');
	}
})

$('.view_ch').on('change', function(){
	draw(2);
	genCanvas();

});
$('#gen_canvas').on('click', genCanvas);

$('#export, .export_ch').on('click', function(){
		newCanvas.toBlob(function(blob) {
				saveAs(blob, $('#title_text').val() + "_" + $('#view').children("option:selected").html() + ".png");
		});
})

 
draw(2);
set_header();
set_result($('#res_conf_pirates'));
set_result($('#res_conf_eu'));

	
		


})