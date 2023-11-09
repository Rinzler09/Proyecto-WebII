document.addEventListener('DOMContentLoaded', function () {
    const tablero = document.getElementById('tablero');
    const btnLanzarDado = document.getElementById('btnLanzarDado');
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
    const casillas = [];

    function generarTablero() {
        for (let fila = 1; fila <= 10; fila++) {
            const filaDiv = document.createElement("div");
            filaDiv.classList.add("fila");

            for (let i = 0; i < 10; i++) {
                const casillaDiv = document.createElement("div");
                casillaDiv.classList.add("casilla");

                // Calcula el número de la casilla en función de la fila y columna
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

                // Asigna un color aleatorio de la paleta de colores
                const colorIndex = Math.floor(Math.random() * colores.length);
                casillaDiv.classList.add(colores[colorIndex]);

                filaDiv.appendChild(casillaDiv);
                casillas.push(casillaDiv);
            }

            tablero.appendChild(filaDiv);
        }
    }

    generarTablero();

    let jugadorPos = 1;
    let jugadorFicha = null;

    jugadorFicha = document.createElement('div');
    jugadorFicha.className = 'jugador';
    casillas[jugadorPos - 1].appendChild(jugadorFicha);

    btnLanzarDado.addEventListener('click', function () {
        const dado = Math.floor(Math.random() * 6) + 1;
        resultadoDadoDiv.textContent = 'Resultado del dado: ' + dado;
    
        // Calcula la nueva posición del jugador
        const nuevaPosicion = jugadorPos + dado;
    
        if (serpientesYEscaleras[nuevaPosicion]) {
            jugadorPos = serpientesYEscaleras[nuevaPosicion];
        } else if (nuevaPosicion <= 100) {
            jugadorPos = nuevaPosicion;
        }
    
        // Actualiza la posición de la ficha
        const casillaActual = casillas[jugadorPos - 1];
        const posicionCSS = casillaActual.getBoundingClientRect();
    
        jugadorFicha.style.top = posicionCSS.top + 'px';
        jugadorFicha.style.left = posicionCSS.left + 'px';
    
        if (jugadorPos === 100) {
            alert('¡Has ganado!');
        }
    });    
});
