document.addEventListener('DOMContentLoaded', function () {
    const tablero = document.getElementById('tablero');
    const btnLanzarDado = document.getElementById('lanzarDado');
    const resultadoDadoDiv = document.getElementById('resultadoDado');

    // Definición de escaleras y serpientes
    const escalerasYSerpientes = {
        4: 56,
        12: 50,
        14: 55,
        22: 58,
        37: 3,
        41: 79,
        47: 16,
        54: 88,
        75: 32,
        94: 71,
        96: 42
    };

    const colores = ["color-1", "color-2", "color-3", "color-4", "color-5"];
    const casillas = generarTablero();

    // Inicialmente, coloca la imagen en la casilla [0][0]
    const imagen = document.createElement('img');
    imagen.src = 'images/modoFacil.png';
    imagen.alt = 'Escalera';
    imagen.classList.add('imagen-estilo');
    tablero.appendChild(imagen);

    const posicionCSSImagen = casillas[0][0].getBoundingClientRect();
    imagen.style.top = posicionCSSImagen.top + 'px';
    imagen.style.left = posicionCSSImagen.left + 'px';

    // Inicialmente, coloca la ficha en la casilla [9][0]
    let jugadorPos = 0;
    let jugadorFicha = document.createElement('div');
    jugadorFicha.className = 'jugador';
    casillas[9][0].appendChild(jugadorFicha);

    btnLanzarDado.addEventListener('click', function () {
        const dado = Math.floor(Math.random() * 6) + 1;
        resultadoDadoDiv.textContent = 'Resultado del dado: ' + dado;

        moverJugador(dado);
    });

    function generarTablero() {
        const colores = ["color-1", "color-2", "color-3", "color-4", "color-5"];
        const casillas = [];

        for (let fila = 1; fila <= 10; fila++) {
            const filaDiv = document.createElement("div");
            filaDiv.classList.add("fila");

            const filaCasillas = [];

            for (let i = 0; i < 10; i++) {
                const casillaDiv = document.createElement("div");
                casillaDiv.classList.add("casilla");

                let numero;
                if (fila % 2 === 1 && fila == 1) {
                    numero = 100 - i;
                } else {
                    numero = 100 - (10 * (fila - 1)) - i;
                }

                if (fila % 2 === 0 && fila == 2) {
                    numero = 100 - (2 * 10) + 1 + i;
                } else if (fila % 2 === 0) {
                    numero = 100 - (fila * 10) + 1 + i;
                }

                casillaDiv.textContent = numero;

                const colorIndex = Math.floor(Math.random() * colores.length);
                casillaDiv.classList.add(colores[colorIndex]);

                filaDiv.appendChild(casillaDiv);
                filaCasillas.push(casillaDiv);
            }

            tablero.appendChild(filaDiv);
            casillas.push(filaCasillas);
        }

        return casillas;
    }

    function moverJugador(pasos) {
        const nuevaPosicion = jugadorPos + pasos;
    
        if (nuevaPosicion >= 1 && nuevaPosicion <= 100) {
            // Movimiento normal
            for (let i = jugadorPos + 1; i <= nuevaPosicion; i++) {
                let numero;
                if (Math.floor((i - 1) / 10) % 2 === 0) {
                    numero = (i - 1) % 10 + 1 + (10 * Math.floor((i - 1) / 10));
                } else {
                    numero = 10 * Math.floor((i - 1) / 10) + 1 + (9 - (i - 1) % 10);
                }
    
                const fila = 9 - Math.floor((numero - 1) / 10);
                const columna = (numero - 1) % 10;
    
                setTimeout(() => {
                    moverFichaACasilla(fila, columna);
                }, i * 100);
            }
    
            jugadorPos = nuevaPosicion;
    
            // Validación de serpiente o escalera después del movimiento normal
            if (escalerasYSerpientes[nuevaPosicion]) {
                const diferencia = escalerasYSerpientes[nuevaPosicion] - nuevaPosicion;
                const mensaje = diferencia > 0
                    ? '¡Has subido por una escalera!'
                    : '¡Has bajado por una serpiente!';
    
                alert(mensaje);
    
                jugadorPos = escalerasYSerpientes[nuevaPosicion];
    
                const pasos = Math.abs(diferencia); // Tomamos el valor absoluto de la diferencia
    
                // Movemos la ficha retrocediendo o avanzando según la diferencia
                for (let i = 1; i <= pasos; i++) {
                    const paso = diferencia > 0 ? i : -i; // Avanzar o retroceder
                    const nuevaCasilla = nuevaPosicion + paso;
    
                    let numero;
                    if (Math.floor((nuevaCasilla - 1) / 10) % 2 === 0) {
                        numero = (nuevaCasilla - 1) % 10 + 1 + (10 * Math.floor((nuevaCasilla - 1) / 10));
                    } else {
                        numero = 10 * Math.floor((nuevaCasilla - 1) / 10) + 1 + (9 - (nuevaCasilla - 1) % 10);
                    }
    
                    const fila = 9 - Math.floor((numero - 1) / 10);
                    const columna = (numero - 1) % 10;
    
                    setTimeout(() => {
                        moverFichaACasilla(fila, columna);
                    }, (i + nuevaPosicion) * 20);
                }
    
                if (nuevaPosicion === 100) {
                    alert('¡Has ganado!');
                }
            } else {
                if (nuevaPosicion === 100) {
                    alert('¡Has ganado!');
                }
            }
        }
    }
    
        

    function moverFichaACasilla(fila, columna) {
        if (casillas[fila] && casillas[fila][columna]) {
            const casillaActual = casillas[fila][columna];
            const posicionCSS = casillaActual.getBoundingClientRect();

            const limiteTop = tablero.getBoundingClientRect().top;
            const limiteLeft = tablero.getBoundingClientRect().left;
            const limiteBottom = tablero.getBoundingClientRect().bottom - jugadorFicha.clientHeight;
            const limiteRight = tablero.getBoundingClientRect().right - jugadorFicha.clientWidth;

            const topFicha = Math.max(limiteTop, Math.min(limiteBottom, posicionCSS.top + window.scrollY + casillaActual.clientHeight / 2 - jugadorFicha.clientHeight / 2));
            const leftFicha = Math.max(limiteLeft, Math.min(limiteRight, posicionCSS.left + casillaActual.clientWidth / 2 - jugadorFicha.clientWidth / 2));

            jugadorFicha.style.top = topFicha + 'px';
            jugadorFicha.style.left = leftFicha + 'px';
        }
    }
});
