document.addEventListener('DOMContentLoaded', function () {
    const tablero = document.getElementById('tablero');
    const btnLanzarDado = document.getElementById('lanzarDado');
    const resultadoDadoDiv = document.getElementById('resultadoDado');
    const serpientesYEscaleras = {
        2: 38,
        7: 14,
        16: 6,
        47: 26,
        49: 11,
        56: 53,
        62: 19,
        64: 60,
        87: 24,
        93: 73,
        95: 75,
        98: 78
    };

    const colores = ["color-1", "color-2", "color-3", "color-4", "color-5"];
    const casillas = generarTablero();

    let jugadorPos = 0;
    let jugadorFicha = document.createElement('div');
    jugadorFicha.className = 'jugador';
    casillas[9][0].appendChild(jugadorFicha); // Inicia en la casilla que contiene el número 1

    btnLanzarDado.addEventListener('click', function () {
        const dado = Math.floor(Math.random() * 6) + 1;
        resultadoDadoDiv.textContent = 'Resultado del dado: ' + dado;

        // Realiza el movimiento del jugador
        moverJugador(dado);

        /*if (jugadorPos === 99) {
            alert('¡Has ganado!');
        }*/
    });

    function generarTablero() {
        const colores = ["color-1", "color-2", "color-3", "color-4", "color-5"]; // Clases de colores en CSS
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
    
        // Itera sobre cada casilla y mueve al jugador a la nueva posición
        for (let i = jugadorPos + 1; i <= nuevaPosicion; i++) {
            let numero;
            if (Math.floor((i - 1) / 10) % 2 === 0) {
                // Filas pares: izquierda a derecha
                numero = (i - 1) % 10 + 1 + (10 * Math.floor((i - 1) / 10));
            } else {
                // Filas impares: derecha a izquierda
                numero = 10 * Math.floor((i - 1) / 10) + 1 + (9 - (i - 1) % 10);
            }
    
            const fila = 9 - Math.floor((numero - 1) / 10);
            const columna = (numero - 1) % 10;
    
            setTimeout(() => {
                moverFichaACasilla(fila, columna);
                if (fila === 0 && columna === 0) {
                    alert('¡Has ganado!');
                }
            }, i * 150);
        }
    
        jugadorPos = nuevaPosicion;
    }

    function moverFichaACasilla(fila, columna) {
        const casillaActual = casillas[fila][columna];
        const posicionCSS = casillaActual.getBoundingClientRect();
    
        // Ajusta la posición para centrar la ficha en la casilla
        const topFicha = posicionCSS.top + casillaActual.clientHeight / 2 - jugadorFicha.clientHeight / 2;
        const leftFicha = posicionCSS.left + casillaActual.clientWidth / 2 - jugadorFicha.clientWidth / 2;
    
        jugadorFicha.style.top = topFicha + 'px';
        jugadorFicha.style.left = leftFicha + 'px';
    }
});
