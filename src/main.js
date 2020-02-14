$(document).ready(function(){

	let dataset = [];
	$.each(parties, function(key, val){

		dataset[val.party] = val;
		dataset[val.party].deligated = [];
console.log(dataset[val.party]	);

	});

console.log(		JSON.stringify(dataset));
	
	
		


})