document.addEventListener('DOMContentLoaded', function () {
    // Obtener referencias a elementos del DOM
    const tablero = document.getElementById('tablero');
    const btnLanzarDado = document.getElementById('lanzarDado');
    const resultadoDadoDiv = document.getElementById('resultadoDado');
    const btnIniciarPartida = document.getElementById('iniciarPartida');
    const btnAbandonarPartida = document.getElementById('abandonarPartida');

    // Obtener el parámetro 'modo' de la URL o establecerlo en 'facil' por defecto
    const modo = obtenerParametroDeURL('modo') || 'facil';

    // Contadores para el seguimiento de partidas ganadas, perdidas y abandonadas
    var contadorGanadasFacil = 0,
        contadorPerdidasFacil = 0,
        contadorGanadasDif = 0,
        contadorPedridasDif = 0,
        contadorAbandonadas = 0;

    let juegoIniciado = false;

    // Agregar un evento al botón "Iniciar Partida"
    btnIniciarPartida.addEventListener('click', function () {
        btnIniciarPartida.style.display = 'none';
        btnLanzarDado.removeAttribute('disabled');
        btnAbandonarPartida.removeAttribute('disabled');
        juegoIniciado = true;
    });

    // Función para resetear la posición del jugador en el tablero
    function resetearPosicionJugador() {
        if (jugadorFicha) {
            jugadorPos = 0;
            moverFichaACasilla(9, 0);
        }
    }

    // Función para resetear la posición de la computadora en el tablero
    function resetearPosicionComputadora() {
        if (pcFicha) {
            pcPos = 0;
            moverFichaACasilla2(9, 0);
        }
    }

    // Agregar un evento al botón "Abandonar Partida"
    btnAbandonarPartida.addEventListener('click', function () {
        juegoIniciado = false;

        // Preguntar al usuario si está seguro de abandonar la partida
        let salir = confirm("¿Está seguro de que desea abandonar la partida?");

        // Si el usuario confirma que desea abandonar la partida
        if (salir === true) {
            incrementarContadorAbandonadas();
            resetearPosicionJugador();
            resetearPosicionComputadora();

            // Redirigir a la página de inicio (index.html)
            window.location.href = 'index.html';
        }
    });

    // Función para incrementar el contador de partidas abandonadas y almacenar en el almacenamiento local
    function incrementarContadorAbandonadas() {
        // Obtener el contador actual de partidas abandonadas del almacenamiento local o establecerlo en 0
        contadorAbandonadas = parseInt(localStorage.getItem("partidasAbandonadas")) || 0;

        // Incrementar el contador
        contadorAbandonadas++;

        // Almacenar el nuevo valor del contador en el almacenamiento local
        localStorage.setItem("partidasAbandonadas", contadorAbandonadas);
    }

    // Definición de escaleras y serpientes modo dificil
    const escalerasYSerpientesDificil = {
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

    // Definición de escaleras y serpientes modo facil
    const escalerasYSerpientesFacil = {
        18: 55,
        38: 5,
        39: 82,
        63: 41,
        67: 47,
        49: 87
    };

    // Declarar la variable escalerasYSerpientes
    let escalerasYSerpientes;

    // Obtener contadores de partidas totales, fáciles, difíciles, completadas y abandonadas del almacenamiento local
    var totalCounter = localStorage.getItem("partidasTotales") || 0;
    var EasyCounter = localStorage.getItem("partidasFacil") || 0;
    var DifCounter = localStorage.getItem("partidasDificil") || 0;
    var CompletedGames = parseInt(localStorage.getItem("partidasCompletadas")) || 0;
    var counterAbandono = parseInt(localStorage.getItem("partidasAbandonadas")) || 0;

    // Comprobar el modo de juego seleccionado (fácil, difícil o no especificado)
    if (modo === 'facil') {
        // Configurar el tablero y aumentar los contadores en caso de modo fácil
        escalerasYSerpientes = escalerasYSerpientesFacil;
        totalCounter++;
        EasyCounter++;
        localStorage.setItem("partidasTotales", totalCounter);
        localStorage.setItem("partidasFacil", EasyCounter);

        // Obtener contadores específicos del modo fácil desde el almacenamiento local
        var WinOnEasy = localStorage.getItem("partidasGanadasFacil") || 0;
        var LoseOnEasy = localStorage.getItem("partidasPerdidasFacil") || 0;

    } else if (modo === 'dificil') {
        // Configurar el tablero y aumentar los contadores en caso de modo difícil
        totalCounter++;
        DifCounter++;
        escalerasYSerpientes = escalerasYSerpientesDificil;
        localStorage.setItem("partidasTotales", totalCounter);
        localStorage.setItem("partidasDificil", DifCounter);

        // Obtener contadores específicos del modo difícil desde el almacenamiento local
        var WinOnDificult = localStorage.getItem("partidasGanadasDificil") || 0;
        var LoseOnDificult = localStorage.getItem("partidasPerdidasDificil") || 0;

    } else {
        // Configurar el tablero para el modo predeterminado (fácil) si no se especifica un modo
        totalCounter++;
        escalerasYSerpientes = escalerasYSerpientesFacil;
        localStorage.setItem("partidasTotales", totalCounter);
    }


    // Definir colores disponibles para las casillas
    const colores = ["color-1", "color-2", "color-3", "color-4", "color-5"];

    // Generar el tablero de juego mediante una función generarTablero
    const casillas = generarTablero();

    // Crear una imagen para representar el tablero de acuerdo al modo de juego
    const imagen = document.createElement('img');
    let imagenModo;

    // Determinar la imagen a utilizar según el modo de juego seleccionado
    if (modo === 'facil') {
        imagenModo = 'images/modoFacil.png';
    } else if (modo === 'dificil') {
        imagenModo = 'images/modoDificil.png';
    } else {
        // Modo por defecto en caso de que no se especifique un modo válido
        imagenModo = 'images/modoFacil.png';
    }

    // Configurar la imagen con la ruta y atributos necesarios
    imagen.src = imagenModo;
    imagen.alt = 'Escalera';
    imagen.classList.add('imagen-estilo');
    tablero.appendChild(imagen);

    // Obtener la posición CSS de la imagen y colocarla en la esquina superior izquierda del tablero
    const posicionCSSImagen = casillas[0][0].getBoundingClientRect();
    imagen.style.top = posicionCSSImagen.top + 'px';
    imagen.style.left = posicionCSSImagen.left + 'px';

    // Inicializar las posiciones del jugador y la computadora en el tablero
    let jugadorPos = 0;
    let jugadorFicha = document.createElement('div');
    jugadorFicha.className = 'jugador';
    let pcPos = 0;
    let pcFicha = document.createElement('div');
    pcFicha.className = 'pc';
    casillas[9][0].appendChild(pcFicha);
    casillas[9][0].appendChild(jugadorFicha);

    // Agregar un evento al botón de lanzar dado para realizar acciones cuando se hace clic
    btnLanzarDado.addEventListener('click', function () {
        // Generar números aleatorios para los dados del jugador y la computadora
        const dado = Math.floor(Math.random() * 6) + 1;
        const dadoPc = Math.floor(Math.random() * 6) + 1;

        // Mostrar los resultados de los dados en el elemento HTML correspondiente
        resultadoDadoDiv.textContent = 'Dado de ' + localStorage.getItem("jugador") + ': ' + dado + '    ||    Dado del PC: ' + dadoPc;

        // Mover al jugador y a la computadora según los resultados de los dados
        moverJugador(dado);
        moverComputadora(dadoPc);
    });


    /**
 * Función para generar y configurar dinámicamente el tablero de juego.
 * Crea un tablero de 10x10 casillas con colores y números asignados.
 *
 * @returns {Array<Array<HTMLElement>>} Una matriz bidimensional que representa el tablero de juego,
 * donde cada elemento es un objeto HTMLElement que representa una casilla.
 */
    function generarTablero() {
        // Colores disponibles para las casillas
        const colores = ["color-1", "color-2", "color-3", "color-4", "color-5"];

        // Matriz para almacenar las casillas del tablero
        const casillas = [];

        // Bucle para crear las filas del tablero
        for (let fila = 1; fila <= 10; fila++) {
            // Crear un contenedor div para cada fila
            const filaDiv = document.createElement("div");
            filaDiv.classList.add("fila");

            // Arreglo para almacenar las casillas de la fila actual
            const filaCasillas = [];

            // Bucle para crear las casillas en cada fila
            for (let i = 0; i < 10; i++) {
                // Crear un elemento div para representar cada casilla
                const casillaDiv = document.createElement("div");
                casillaDiv.classList.add("casilla");

                // Determinar el número de la casilla basado en la posición y fila
                let numero;
                if (fila % 2 === 1 && fila == 1) {
                    numero = 100 - i;
                } else {
                    numero = 100 - (10 * (fila - 1)) - i;
                }

                // Ajustar el número para filas pares
                if (fila % 2 === 0 && fila == 2) {
                    numero = 100 - (2 * 10) + 1 + i;
                } else if (fila % 2 === 0) {
                    numero = 100 - (fila * 10) + 1 + i;
                }

                // Establecer el texto de la casilla con su número
                casillaDiv.textContent = numero;

                // Asignar un color aleatorio a la casilla
                const colorIndex = Math.floor(Math.random() * colores.length);
                casillaDiv.classList.add(colores[colorIndex]);

                // Agregar la casilla al contenedor de la fila y al arreglo de casillas de la fila
                filaDiv.appendChild(casillaDiv);
                filaCasillas.push(casillaDiv);
            }

            // Agregar la fila completa al tablero y el arreglo de casillas al arreglo principal
            tablero.appendChild(filaDiv);
            casillas.push(filaCasillas);
        }

        // Devolver la matriz bidimensional que representa el tablero de juego
        return casillas;
    }


    /**
 * Mueve la ficha del jugador en el tablero según la cantidad de pasos dados.
 *
 * @param {number} pasos - Número de pasos que el jugador debe avanzar en el tablero.
 */
    function moverJugador(pasos) {
        // Calcula la nueva posición del jugador después de los pasos dados
        const nuevaPosicion = jugadorPos + pasos;

        // Verifica que la nueva posición esté dentro del rango válido del tablero (1-100)
        if (nuevaPosicion >= 1 && nuevaPosicion <= 100) {
            // Movimiento normal: anima el movimiento de la ficha del jugador casilla por casilla
            for (let i = jugadorPos + 1; i <= nuevaPosicion; i++) {
                // Calcula la fila y columna correspondientes a la casilla actual
                const [fila, columna] = calcularFilaColumnaDesdeNumero(i);

                // Programa el movimiento de la ficha en cada casilla con un ligero retardo
                setTimeout(() => {
                    moverFichaACasilla(fila, columna);
                }, i * 1);
            }

            // Actualiza la posición del jugador después del movimiento normal
            jugadorPos = nuevaPosicion;

            // Comprueba si la nueva posición tiene una serpiente o escalera
            if (escalerasYSerpientes[nuevaPosicion]) {
                const diferencia = escalerasYSerpientes[nuevaPosicion] - nuevaPosicion;
                const mensaje = diferencia > 0 ? '¡Has subido por una escalera!' : '¡Has bajado por una serpiente!';

                // Muestra un mensaje al jugador sobre la serpiente o escalera
                alert(mensaje);

                // Actualiza la posición del jugador después de la serpiente o escalera
                jugadorPos = escalerasYSerpientes[nuevaPosicion];

                // Calcula la cantidad de pasos para el movimiento adicional
                const pasos = Math.abs(diferencia);

                // Realiza el movimiento adicional de la ficha retrocediendo o avanzando según la diferencia
                for (let i = 1; i <= pasos; i++) {
                    const paso = diferencia > 0 ? i : -i; // Avanzar o retroceder
                    const nuevaCasilla = nuevaPosicion + paso;

                    // Calcula la fila y columna correspondientes a la casilla actual
                    const [fila, columna] = calcularFilaColumnaDesdeNumero(nuevaCasilla);

                    // Programa el movimiento de la ficha en cada casilla con un retardo ajustado
                    setTimeout(() => {
                        moverFichaACasilla(fila, columna);
                    }, (i + nuevaPosicion) * 10);
                }

                // Verifica si el jugador ha llegado a la casilla final (100) después del movimiento adicional
                if (nuevaPosicion === 100) {
                    // Oculta el botón de lanzar dado y muestra un mensaje de victoria
                    btnLanzarDado.style.display = 'none';
                    alert('¡Has ganado!');

                    // Actualiza estadísticas y contadores según la modalidad del juego
                    if (modo === 'facil') {
                        WinOnEasy++;
                        CompletedGames = CompletedGames + WinOnEasy;
                        localStorage.setItem("partidasGanadasFacil", WinOnEasy);
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                    } else if (modo === 'dificil') {
                        WinOnDificult++;
                        CompletedGames = CompletedGames + WinOnDificult;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasGanadasDificil", WinOnDificult);
                        contadorGanadasFacil++;
                        localStorage.setItem("contadorGanadasFacil", contadorGanadasFacil);
                    }
                }
            } else {
                // Verifica si el jugador ha llegado a la casilla final (100) después del movimiento normal
                if (nuevaPosicion === 100) {
                    // Oculta el botón de lanzar dado y muestra un mensaje de victoria
                    btnLanzarDado.style.display = 'none';
                    alert('¡Has ganado!');

                    // Actualiza estadísticas y contadores según la modalidad del juego
                    if (modo === 'facil') {
                        WinOnEasy++;
                        CompletedGames = CompletedGames + WinOnEasy;
                        localStorage.setItem("partidasGanadasFacil", WinOnEasy);
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                    } else if (modo === 'dificil') {
                        WinOnDificult++;
                        CompletedGames = CompletedGames + WinOnDificult;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasGanadasDificil", WinOnDificult);
                    }

                    // Incrementa el contador de victorias en el modo fácil
                    contadorGanadasFacil++;
                } else if (modo === 'dificil') {
                    // Incrementa el contador de victorias en el modo difícil
                    contadorGanadasDif++;
                }
            }
        }
    }

    /**
     * Calcula la fila y columna correspondientes a un número de casilla en el tablero.
     *
     * @param {number} numero - Número de casilla en el tablero.
     * @returns {Array<number>} Un arreglo con la fila y columna correspondientes a la casilla.
     */
    function calcularFilaColumnaDesdeNumero(numero) {
        // Lógica para calcular la fila y columna desde el número de casilla
        let fila, columna;
        if (Math.floor((numero - 1) / 10) % 2 === 0) {
            fila = 9 - Math.floor((numero - 1) / 10);
            columna = (numero - 1) % 10;
        } else {
            fila = 9 - Math.floor((numero - 1) / 10);
            columna = 9 - (numero - 1) % 10;
        }
        return [fila, columna];
    }


    /**
 * Mueve la ficha de la computadora en el tablero según la cantidad de pasos dados.
 *
 * @param {number} pasos - Número de pasos que la computadora debe avanzar en el tablero.
 */
    function moverComputadora(pasos) {
        // Calcula la nueva posición de la ficha de la computadora después de los pasos dados
        const nuevaPosicionPc = pcPos + pasos;

        // Verifica que la nueva posición esté dentro del rango válido del tablero (1-100)
        if (nuevaPosicionPc >= 1 && nuevaPosicionPc <= 100) {
            // Movimiento normal: anima el movimiento de la ficha de la computadora casilla por casilla
            for (let i = pcPos + 1; i <= nuevaPosicionPc; i++) {
                // Calcula la fila y columna correspondientes a la casilla actual
                const [fila, columna] = calcularFilaColumnaDesdeNumero(i);

                // Programa el movimiento de la ficha de la computadora en cada casilla con un retardo
                setTimeout(function () {
                    setTimeout(() => {
                        moverFichaACasilla2(fila, columna);
                    }, i * 1);
                }, 2000); // La función se ejecuta 2 segundos después para que la ficha de la PC se mueva después
            }

            // Actualiza la posición de la ficha de la computadora después del movimiento normal
            pcPos = nuevaPosicionPc;

            // Comprueba si la nueva posición tiene una serpiente o escalera
            if (escalerasYSerpientes[nuevaPosicionPc]) {
                let diferencia = escalerasYSerpientes[nuevaPosicionPc] - nuevaPosicionPc;
                let mensaje = diferencia > 0 ? '¡La PC ha subido por una escalera!' : '¡La PC ha bajado por una serpiente!';

                // Muestra un mensaje sobre la serpiente o escalera a la computadora
                alert(mensaje);

                // Actualiza la posición de la ficha de la computadora después de la serpiente o escalera
                pcPos = escalerasYSerpientes[nuevaPosicionPc];

                // Calcula la cantidad de pasos para el movimiento adicional
                let pasos = Math.abs(diferencia);

                // Realiza el movimiento adicional retrocediendo o avanzando según la diferencia
                for (let i = 1; i <= pasos; i++) {
                    let paso = diferencia > 0 ? i : -i; // Avanzar o retroceder
                    let nuevaCasilla = nuevaPosicionPc + paso;

                    // Calcula la fila y columna correspondientes a la casilla actual
                    const [fila, columna] = calcularFilaColumnaDesdeNumero(nuevaCasilla);

                    // Programa el movimiento de la ficha de la computadora en cada casilla con un retardo ajustado
                    setTimeout(() => {
                        moverFichaACasilla2(fila, columna);
                    }, (i + nuevaPosicionPc) * 10);
                }

                // Verifica si la ficha de la computadora ha llegado a la casilla final (100) después del movimiento adicional
                if (nuevaPosicionPc === 100) {
                    // Oculta el botón de lanzar dado y muestra un mensaje de derrota
                    btnLanzarDado.style.display = 'none';
                    alert('¡Has perdido!');

                    // Actualiza estadísticas y contadores según la modalidad del juego
                    if (modo === 'facil') {
                        LoseOnEasy++;
                        CompletedGames = CompletedGames + LoseOnEasy;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasPerdidasFacil", LoseOnEasy);
                    } else if (modo === 'dificil') {
                        LoseOnDificult++;
                        CompletedGames = CompletedGames + LoseOnDificult;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasPerdidasDificil", LoseOnDificult);

                        contadorPerdidasFacil++;
                        localStorage.setItem("contadorPerdidasFacil", contadorPerdidasFacil);
                        btnLanzarDado.setAttribute('disabled', true);
                    } else if (modo === 'dificil') {
                        contadorPedridasDif++;
                        localStorage.setItem("contadorPerdidasFacil", contadorPedridasDif);
                        btnLanzarDado.setAttribute('disabled', true);
                    }
                }
            } else {
                // Verifica si la ficha de la computadora ha llegado a la casilla final (100) después del movimiento normal
                if (nuevaPosicionPc === 100) {
                    // Oculta el botón de lanzar dado y muestra un mensaje de derrota
                    btnLanzarDado.style.display = 'none';
                    alert('¡Has perdido!');

                    // Actualiza estadísticas y contadores según la modalidad del juego
                    if (modo === 'facil') {
                        LoseOnEasy++;
                        CompletedGames = CompletedGames + LoseOnEasy;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasPerdidasFacil", LoseOnEasy);
                    } else if (modo === 'dificil') {
                        LoseOnDificult++;
                        CompletedGames = CompletedGames + LoseOnDificult;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasPerdidasDificil", LoseOnDificult);

                        contadorPerdidasFacil++;
                    } else if (modo === 'dificil') {
                        contadorPedridasDif++;
                    }
                }
            }
        }
    }


    /**
 * Mueve la ficha del jugador a la casilla especificada en el tablero.
 *
 * @param {number} fila - Índice de fila de la casilla en el tablero.
 * @param {number} columna - Índice de columna de la casilla en el tablero.
 */
    function moverFichaACasilla(fila, columna) {
        // Verifica que exista la fila y la columna en el tablero
        if (casillas[fila] && casillas[fila][columna]) {
            // Obtiene la casilla actual en la que se moverá la ficha del jugador
            const casillaActual = casillas[fila][columna];

            // Obtiene las dimensiones y posición CSS de la casilla actual y el tablero
            const posicionCSS = casillaActual.getBoundingClientRect();
            const limiteTop = tablero.getBoundingClientRect().top;
            const limiteLeft = tablero.getBoundingClientRect().left;
            const limiteBottom = tablero.getBoundingClientRect().bottom - jugadorFicha.clientHeight;
            const limiteRight = tablero.getBoundingClientRect().right - jugadorFicha.clientWidth;

            // Calcula la nueva posición de la ficha del jugador asegurándose de que no se salga del tablero
            const topFicha = Math.max(limiteTop, Math.min(limiteBottom, posicionCSS.top + window.scrollY + casillaActual.clientHeight / 2 - jugadorFicha.clientHeight / 2));
            const leftFicha = Math.max(limiteLeft, Math.min(limiteRight, posicionCSS.left + casillaActual.clientWidth / 2 - jugadorFicha.clientWidth / 2));

            // Actualiza la posición CSS de la ficha del jugador
            jugadorFicha.style.top = topFicha + 'px';
            jugadorFicha.style.left = leftFicha + 'px';
        }
    }


    /**
 * Mueve la ficha de la computadora a la casilla especificada en el tablero.
 *
 * @param {number} fila2 - Índice de fila de la casilla en el tablero.
 * @param {number} columna2 - Índice de columna de la casilla en el tablero.
 */
    function moverFichaACasilla2(fila2, columna2) {
        // Verifica que exista la fila y la columna en el tablero
        if (casillas[fila2] && casillas[fila2][columna2]) {
            // Obtiene la casilla actual en la que se moverá la ficha de la computadora
            let casillaActual = casillas[fila2][columna2];

            // Obtiene las dimensiones y posición CSS de la casilla actual y el tablero
            let posicionCSS = casillaActual.getBoundingClientRect();
            let limiteTop = tablero.getBoundingClientRect().top;
            let limiteLeft = tablero.getBoundingClientRect().left;
            let limiteBottomPc = tablero.getBoundingClientRect().bottom - pcFicha.clientHeight;
            let limiteRightPc = tablero.getBoundingClientRect().right - pcFicha.clientWidth;

            // Calcula la nueva posición de la ficha de la computadora asegurándose de que no se salga del tablero
            let topFichaPc = Math.max(limiteTop, Math.min(limiteBottomPc, posicionCSS.top + window.scrollY + casillaActual.clientHeight / 2 - pcFicha.clientHeight / 2));
            let leftFichaPc = Math.max(limiteLeft, Math.min(limiteRightPc, posicionCSS.left + casillaActual.clientWidth / 2 - pcFicha.clientWidth / 2));

            // Actualiza la posición CSS de la ficha de la computadora
            pcFicha.style.top = topFichaPc + 'px';
            pcFicha.style.left = leftFichaPc + 'px';
        }
    }



    /**
 * Obtiene el valor de un parámetro específico de la URL.
 *
 * @param {string} parametro - El nombre del parámetro que se desea obtener.
 * @returns {string|null} - El valor del parámetro si existe, o null si no se encuentra.
 */
    function obtenerParametroDeURL(parametro) {
        // Crea una nueva instancia de URL utilizando la URL actual del navegador
        const url = new URL(window.location.href);

        // Utiliza el objeto URL para obtener el valor del parámetro especificado
        // Devuelve el valor del parámetro o null si el parámetro no está presente en la URL
        return url.searchParams.get(parametro);
    }

});



/**
 * Genera un gráfico de pastel que representa las partidas ganadas y perdidas en el modo difícil.
 * Utiliza la API de Google Charts para visualizar los datos.
 */
function generarGraficoModoDificilGanadasPerdidas() {
    // Obtiene la cantidad de partidas ganadas y perdidas en modo difícil desde el almacenamiento local
    var partGDificil = parseInt(localStorage.getItem("partidasGanadasDificil")) || 0;
    var partPDificil = parseInt(localStorage.getItem("partidasPerdidasDificil")) || 0;

    // Carga la librería de Google Charts y ejecuta la función drawChart una vez cargada
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    /**
     * Dibuja el gráfico de pastel con los datos proporcionados.
     */
    function drawChart() {
        // Convierte los datos a un formato compatible con Google Charts
        var data = google.visualization.arrayToDataTable([
            ['Partidas Modo Dificil', 'Partidas ganadas vs partidas perdidas'],
            ['Partidas Ganadas', partGDificil],
            ['Partidas Perdidas', partPDificil]
        ]);

        // Configuración de opciones para el gráfico de pastel
        var options = {
            title: 'Partidas Ganadas vs Perdidas en Modo Dificil',
            pieHole: 0.4,
            backgroundColor: {
                fill: 'none'
            },
            width: 500,   // Ancho del gráfico
            height: 400   // Altura del gráfico
        };

        // Crea una instancia de Google PieChart y lo dibuja en el elemento con el ID 'pieChart4'
        var chart = new google.visualization.PieChart(document.getElementById('pieChart4'));
        chart.draw(data, options);
    }
}

// Llamar a la función para generar el gráfico al cargar la página
generarGraficoModoDificilGanadasPerdidas();

// **Grafico** Partidas modo facil vs partidas modo dificil

// Función para generar un gráfico con datos del Local Storage
function generarGraficoPartidasFacilesvsDificiles() {
    // Obtener datos del Local Storage

    var totalEasy = parseInt(localStorage.getItem("partidasFacil")) || 0;
    var totalDif = parseInt(localStorage.getItem("partidasDificil")) || 0;

    // Cargar la biblioteca Google Charts
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    // Función para dibujar el gráfico
    function drawChart() {
        // Crear un array con los datos
        var data = google.visualization.arrayToDataTable([
            ['Partidas Totales', 'Partidas Jugadas en Modo Facil  vs Partidas Jugadas en Modo Dificil'],
            ['Partidas Modo Facil', totalEasy],
            ['Partidas Modo Dificil', totalDif]
        ]);

        // Opciones del gráfico
        var options = {
            title: 'Partidas Jugadas en Modo Facil  vs Partidas Jugadas en Modo Dificil',
            pieHole: 0.4,
            backgroundColor: {
                fill: 'none'
            },
            width: 500,  // Ajusta el ancho del gráfico
            height: 400  // Ajusta la altura del gráfico
        };

        // Crear el gráfico y colocarlo en un contenedor HTML con el id 'chart_div'
        var chart = new google.visualization.PieChart(document.getElementById('pieChart'));
        chart.draw(data, options);
    }
}
// Llamar a la función para generar el gráfico al cargar la página
generarGraficoPartidasFacilesvsDificiles();

// **Grafico** Total de partidas completadas vs total de partidas no completadas

// Función para generar un gráfico con datos del Local Storage
function generarGraficoPartidasCompletadasNoComple() {
    // Obtener datos del Local Storage

    var partAbandonada = parseInt(localStorage.getItem("partidasAbandonadas")) || 0;
    var totalEasy = parseInt(localStorage.getItem("partidasFacil")) || 0;
    var totalDif = parseInt(localStorage.getItem("partidasDificil")) || 0;

    // Cargar la biblioteca Google Charts
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    // Función para dibujar el gráfico
    function drawChart() {
        // Crear un array con los datos
        var data = google.visualization.arrayToDataTable([
            ['Partidas Totales', 'Total de partidas completadas vs total de partidas no completadas'],
            ['Partidas Completadas', totalEasy + totalDif],
            ['Partidas No Completadas', partAbandonada]
        ]);

        // Opciones del gráfico
        var options = {
            title: 'Total de partidas completadas vs total de partidas no completadas',
            pieHole: 0.4,
            backgroundColor: {
                fill: 'none'
            },
            width: 500,  // Ajusta el ancho del gráfico
            height: 400  // Ajusta la altura del gráfico
        };

        // Crear el gráfico y colocarlo en un contenedor HTML con el id 'chart_div'
        var chart = new google.visualization.PieChart(document.getElementById('pieChart2'));
        chart.draw(data, options);
    }
}
// Llamar a la función para generar el gráfico al cargar la página
generarGraficoPartidasCompletadasNoComple();

// **Grafico** Partidas ganadas en modo facil vs Partidas ganadas en modo dificil

// Función para generar un gráfico con datos del Local Storage
function generarGraficoPartidasGanadasModofacilvsdif() {
    // Obtener datos del Local Storage
    var partGFacil = parseInt(localStorage.getItem("partidasGanadasFacil")) || 0;
    var partGDificil = parseInt(localStorage.getItem("partidasGanadasDificil")) || 0;


    // Cargar la biblioteca Google Charts
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    // Función para dibujar el gráfico
    function drawChart() {
        // Crear un array con los datos
        var data = google.visualization.arrayToDataTable([
            ['Partidas Totales', 'Partidas ganadas en modo facil vs Partidas ganadas en modo dificil'],
            ['Partidas Ganadas Facil', partGFacil],
            ['Partidas Ganadas Dificil', partGDificil]
        ]);

        // Opciones del gráfico
        var options = {
            title: 'Partidas ganadas en modo facil vs Partidas ganadas en modo dificil',
            pieHole: 0.4,
            backgroundColor: {
                fill: 'none'
            },
            width: 500,  // Ajusta el ancho del gráfico
            height: 400  // Ajusta la altura del gráfico
        };

        // Crear el gráfico y colocarlo en un contenedor HTML con el id 'chart_div'
        var chart = new google.visualization.PieChart(document.getElementById('pieChart3'));
        chart.draw(data, options);
    }
}
// Llamar a la función para generar el gráfico al cargar la página
generarGraficoPartidasGanadasModofacilvsdif();
