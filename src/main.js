$(document).ready(function(){

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
				console.log("Select " + $('#deleg_' + $(this).attr("delid") + ' .deleg_name' ).html() + " set to "  + $(this).html() );
				del.behavior = $(this).html();
				//console.log(JSON.stringify(party.deligated)); 
				$('#deleg_' + $(this).attr("delid") + ' .selector').removeClass('sel_selector');
				$(this).addClass('sel_selector');
				calc_behavior();
			})
		})
	})

function calc_behavior(){

	var max = 0;
	$.each(parties, function(index, party){

		parties[index].behave_A = 0;
		parties[index].behave_E = 0;
		parties[index].behave_Z = 0;
		parties[index].behave_NA = 0;

		$.each(party.deligated, function(ind, del){
			if(del.behavior === "A") ++parties[index].behave_A ;
			if(del.behavior === "Z") ++parties[index].behave_Z ;
			if(del.behavior === "E") ++parties[index].behave_E ;
			if(del.behavior === "N") ++parties[index].behave_N ;
		})

		if(party.deligated.length > max) max=party.deligated.length;
	})

	console.log("Max are " + max +" Dele");
	draw(max);
}


	function draw( range){
		var myChart = Array();
		$('#byparty').html("");
		var i = 0;

		$.each(parties, function(index, party){

			$('#byparty').append("<div class='gr_party'> <div class='gr_name'>" + party.party + "</div><img height='20px' src='' id='i" +i+ "_img' class='gr_logo'><div class='can_container'><canvas style='display: block; width: 520px; height: 47px;' class='gr_stats' id='c" +i+ "_stats' ></canvas></div></div>");

			
			$("#i"+i+ "_img").attr("src", "src/assets/"+ party.image );
			
			
			var ctx = document.getElementById( "c" + i +"_stats" );

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
								
								suggestedMax: range
							}
						}
					],
						yAxes: [{
							stacked: true,

						}]
					}
				}
			});
			i++;
		});

	}

draw();


	
	
		


})