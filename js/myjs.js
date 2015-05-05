/*price range*/

$(document).ready(function(){
	$("#item1 a").click(function(e){
		e.preventDefault();
		//var o={price:$("#item1 h2").text()};
		sessionStorage.setItem('items1',$("#item1 h2").text());
		console.log(sessionStorage.getItem('items1'));
	});
	document.location.pathname
	$('#isbdf').html(sessionS..getItem())
	});