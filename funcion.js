$(function() {
	$('#mostrar-menu').on('click', function(){
		$(this).next().slideToggle();
	})

	$('#container img').on('click', abrir);
	$('#imgFull').on('click', cerrar);


});

function abrir(){
	//alert($(this).attr('alt'));

	var nombre = $(this).attr('alt');
	var direccion = "imagenes/" + nombre + ".jpg";

	$('#imgFull').attr('src', direccion);

	$('#previa').fadeIn();
}

function cerrar(){
	$('#previa').fadeOut();
}