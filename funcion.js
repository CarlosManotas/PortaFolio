$(function() {
	$('#mostrar-menu').on('click', function(){
		$(this).next().slideToggle();
	})

	$('#container img').on('click', abrir);
	$('#previa').on('click', cerrar);


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

/*///////////////////////////////////////////////////////////////////

                       JUEGO PINGPONG

//////////////////////////////////////////////////////////////////*/

var
/*****

** VARIABLES CONSTANTES 

******/
WIDTH = 600,
HEIGHT = 500,
pi = Math.PI,
flechaUp = 87,
flechaDown = 83,
/*****

** ELEMENTOS DEL JUEGO 

******/
canvas,
ctx,   //CONTEXTO 2D
teclado,
/*****

** JUGADOR = {objeto} 

******/
jugador = {
	x: null,
	y: null,
	w: 20, //ANCHO 
	h: 100, //ALTO
		/*****

		** ACTUALIZAR POSICION DEL JUGADOR

		******/
	actualizar: function(){
		if (teclado[flechaUp]) this.y -= 7;
		if (teclado[flechaDown]) this.y += 7;
		// MANTENER EL JUGADOR DENTRO DEL CANVAS
		this.y = Math.max(Math.min(this.y, HEIGHT - this.h),0);
	},
		/*****

		** DIBUJAR EL JUGADOR EN EL CANVAS

		******/
	dibujar: function(){
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
},
	/*****

	** COMPUTADORA JUGADOR = {objeto}

	******/
ia = {
	x: null,
	y: null,
	w: 20,
	h: 100,
		/*****

		** ACTUALIZAR POSICION DEL JUGADOR DEPENDIENDO A DONDE VA LA PELOTA

		******/
	actualizar: function(){
		// calcular la posicion ideal
		var destino = pelota.y - (this.h - pelota.lado)*0.5;
		// movimiento hacia la posicion ideal
		this.y += (destino - this.y) * 0.1;
		// MANTENER EL JUGADOR DENTRO DEL CANVAS
		this.y = Math.max(Math.min(this.y, HEIGHT - this.h),0);
	},
		/*****

		** DIBUJAR EL JUGADOR EN EL CANVAS

		******/
	dibujar: function(){
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

},

/*****

** PELOTA = {objeto}

******/
pelota = {
	x:null,
	y: null,
	velocidad: null,
	lado: 20,
	rapidez: 12,
		/*****

		** SIRVE LA PELOTA A UN LADO ESPECIFICO
	   SI ES 1 SIRVE AL LADO DERECHO, 
	   SI ES -1 AL IZQUIERDO

		******/
	servir: function(lado){
		// AJUSTAR LA POSICION EN X & Y
		var r = Math.random();
		this.x = lado === 1 ? jugador.x + jugador.w : ia.x - this.lado;
		this.y = (HEIGHT - this.lado)*r;
		// CALCULAR FUERA DE ANGULO, ALTO/BAJO EN EL EJE Y
		// CON ANGULO MAS PRONUNCIADO
		var phi = 0.1 * pi *(1 - 2* r); 
		// DIRECCION Y MAGNITUD DE LA VELOCIDAD
		this.velocidad ={
			x: lado * this.rapidez * Math.cos(phi),
			y: this.rapidez * Math.sin(phi)
		}
	},
		/*****

		** ACTUALIZAR LA POSICION DE LA PELOTA Y MANTENERLA DENTRO DEL CANVAS

		******/
	actualizar: function(){
		//ACTUALIZA POSICION Y VELOCIDAD ACTUAL
		this.x += this.velocidad.x;
		this.y += this.velocidad.y;
		//COMPROBAR SI ESTA FUERA DEL CANVAS EN EL EJE Y
		if (0 > this.y || this.y+this.lado > HEIGHT){
			//CALCULAR Y AGREGAR EL DESPLAZAMIENTO DE LA PELOTA DENTRO DEL CANVAS
			var offset = this.velocidad.y < 0 ? 0 - this.y : HEIGHT - (this.y + this.lado);
			this.y += 2 * offset;
			//REFLRJAR LA VELOCIDAD EN EL EJE Y
			this.velocidad.y *= -1;
		}
			//FUNCION AUXILIAR DE COLISIONES 
		var ABcolision = function(ax,ay,aw,ah,bx,by,bw,bh){
			return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
		};
			//COMPROBAR COLISION EN EL EJE X DE LOS JUGADORES CON LA PELOTA
		var barra = this.velocidad.x < 0 ? jugador : ia;
		if (ABcolision(barra.x, barra.y, barra.w, barra.h, this.x, this.y, this.lado, this.lado)){
			//ESTABLECER LA POSICION EN X y CALCULAR EL REFLEJO DEL ANGULO
			this.x = barra === jugador ? jugador.x + jugador.w : ia.x - this.lado;
			var n = (this.y + this.lado - barra.y)/(barra.h + this.lado);
			var phi = 0.25*pi*(2*n - 1);
			var choque = Math.abs(phi) > 0.2*pi ? 1.5 : 1;
			this.velocidad.x = choque*(barra===jugador ? 1 : -1)* this.rapidez*Math.cos(phi);
			this.velocidad.y = choque*this.rapidez*Math.sin(phi);
		}
			// RESETEAR LA PELOTA CUANDO ESTA SALGA DEL CANVAS EN EL EJE X
		if (0 > this.x+this.lado || this.x > WIDTH){
			this.servir(barra===jugador ? 1 : -1);
		}
	},
			/*****

			** DIBUJAR LA PELOTA EN EL CANVAS

			******/
	dibujar: function(){
		ctx.fillRect(this.x, this.y, this.lado, this.lado);
	}

};
/*****

 ** COMIENZA EL JUEGO

	******/
function principal(){
	//CREAMOS EL CANVAS
	canvas = document.getElementById("marco");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	teclado = {};
	document.addEventListener ("keydown", function(evt){
		teclado[evt.keyCode] = true;
	});
	document.addEventListener ("keyup", function(evt){
		delete teclado[evt.keyCode];
	});
	inicio();
	var loop = function(){
		actualizar();
		dibujar();
		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop,canvas);
}
function inicio(){
	jugador.x = jugador.w;
	jugador.y = (HEIGHT - jugador.h)/2;
	ia.x = WIDTH - (jugador.w + ia.w);
	ia.y = (HEIGHT - ia.h)/2;
	pelota.servir(1);
}
function actualizar(){
	pelota.actualizar();
	jugador.actualizar();
	ia.actualizar();
}
function dibujar(){
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	ctx.save();
	ctx.fillStyle = "#fff";
	pelota.dibujar();
	jugador.dibujar();
	ia.dibujar();
	var w = 4;
	var x = (WIDTH - w)*0.5;
	var y = 0;
	var step = HEIGHT/20; 
	while (y < HEIGHT) {
		ctx.fillRect(x, y+step*0.25, w, step*0.5);
		y += step;
	}
	ctx.restore();
}
