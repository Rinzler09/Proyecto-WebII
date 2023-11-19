document.addEventListener('DOMContentLoaded', function () {
    const tablero = document.getElementById('tablero');
    const btnLanzarDado = document.getElementById('lanzarDado');
    const resultadoDadoDiv = document.getElementById('resultadoDado');
    const btnIniciarPartida = document.getElementById('iniciarPartida');
    const btnAbandonarPartida = document.getElementById('abandonarPartida');
    // const btnVolverAJugar = document.getElementById('volverAJugar');
    const modo = obtenerParametroDeURL('modo') || 'facil';
    var contadorGanadasFacil = 0, contadorPerdidasFacil = 0, contadorGanadasDif = 0, contadorPedridasDif = 0, contadorAbandonadas = 0;

    let juegoIniciado = false;

    btnIniciarPartida.addEventListener('click', function () {
        btnIniciarPartida.style.display = 'none'; // Oculta el botón "Iniciar"
        btnLanzarDado.removeAttribute('disabled'); // Habilita el botón "Lanzar Dado"
        btnAbandonarPartida.removeAttribute('disabled'); // Habilita el botón "Abandonar"
        juegoIniciado = true;

        // ... Lógica para iniciar la partida ...
    });

    function resetearPosicionJugador() {
        if (jugadorFicha) {
            jugadorPos = 0;
            moverFichaACasilla(9, 0);
        }
    }

    function resetearPosicionComputadora() {
        if (pcFicha) {
            pcPos = 0;
            moverFichaACasilla2(9, 0);
        }
    }



    btnAbandonarPartida.addEventListener('click', function () {
        btnIniciarPartida.style.display = 'block';
        btnLanzarDado.setAttribute('disabled', 'disabled');
        btnAbandonarPartida.setAttribute('disabled', 'disabled');

        juegoIniciado = false;

        let salir = confirm("¿Está seguro de que desea abandonar la partida?");

        if (salir === true) {
            incrementarContadorAbandonadas(); // Llama a la función para incrementar el contador
            resetearPosicionJugador(); // Resetear posición del jugador
            resetearPosicionComputadora(); // Resetear posición de la computadora
            window.location.href = 'index.html';
        }
    });

    function incrementarContadorAbandonadas() {
        contadorAbandonadas = parseInt(localStorage.getItem("partidasAbandonadas")) || 0;
        contadorAbandonadas++;
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

    let escalerasYSerpientes;
    var totalCounter = localStorage.getItem("partidasTotales") || 0;
    var EasyCounter = localStorage.getItem("partidasFacil") || 0;
    var DifCounter = localStorage.getItem("partidasDificil") || 0;
    var CompletedGames = parseInt(localStorage.getItem("partidasCompletadas")) || 0;
    var counterAbandono = parseInt(localStorage.getItem("partidasAbandonadas")) || 0;


    if (modo === 'facil') {
        escalerasYSerpientes = escalerasYSerpientesFacil;
        totalCounter++;
        EasyCounter++;
        localStorage.setItem("partidasTotales", totalCounter);
        localStorage.setItem("partidasFacil", EasyCounter);
        var WinOnEasy = localStorage.getItem("partidasGanadasFacil") || 0;
        var LoseOnEasy = localStorage.getItem("partidasPerdidasFacil") || 0;
        var Abandono = localStorage.getItem("partidasAbandonadas") || 0;
    } else if (modo === 'dificil') {
        totalCounter++;
        DifCounter++;
        escalerasYSerpientes = escalerasYSerpientesDificil;
        localStorage.setItem("partidasTotales", totalCounter);
        localStorage.setItem("partidasDificil", DifCounter);
        var WinOnDificult = localStorage.getItem("partidasGanadasDificil") || 0;
        var LoseOnDificult = localStorage.getItem("partidasPerdidasDificil") || 0;
        var Abandono = localStorage.getItem("partidaAbandonada") || 0;
    } else {
        totalCounter++;
        escalerasYSerpientes = escalerasYSerpientesFacil;
        localStorage.setItem("partidasTotales", totalCounter);
    }

    const colores = ["color-1", "color-2", "color-3", "color-4", "color-5"];
    const casillas = generarTablero();

    //Ayuda a colocar la imagen del tablero de acuerdo a la modalidad del juego
    const imagen = document.createElement('img');
    let imagenModo;

    if (modo === 'facil') {
        imagenModo = 'images/modoFacil.png';
    } else if (modo === 'dificil') {
        imagenModo = 'images/modoDificil.png';
    } else {
        imagenModo = 'images/modoFacil.png';
    }

    imagen.src = imagenModo;
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
    let pcPos = 0;
    let pcFicha = document.createElement('div');
    pcFicha.className = 'pc';
    casillas[9][0].appendChild(pcFicha);
    casillas[9][0].appendChild(jugadorFicha);

    btnLanzarDado.addEventListener('click', function () {
        const dado = Math.floor(Math.random() * 6) + 1;
        const dadoPc = Math.floor(Math.random() * 6) + 1;
        resultadoDadoDiv.textContent = 'Dado de ' + localStorage.getItem("jugador") + ': ' + dado + '    ||    Dado del PC: ' + dadoPc;

        moverJugador(dado);
        moverComputadora(dadoPc);
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
                }, i * 1);
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
                    }, (i + nuevaPosicion) * 10);
                }

                if (nuevaPosicion === 100) {
                    btnLanzarDado.style.display = 'none';
                    alert('¡Has ganado!');
                    if (modo === 'facil') {

                        WinOnEasy++;
                        CompletedGames = CompletedGames + WinOnEasy;
                        localStorage.setItem("partidasGanadasFacil", WinOnEasy);
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                    }
                    if (modo === 'dificil') {
                        WinOnDificult++;
                        CompletedGames = CompletedGames + WinOnDificult;
                        localStorage.setItem("partidasGanadasDificil", WinOnDificult);
                        localStorage.setItem("partidasCompletadas", CompletedGames);

                        contadorGanadasFacil++;
                        //couterWinEasy.push(0);
                        localStorage.setItem("contadorGanadasFacil", contadorGanadasFacil);

                    }
                    else if (modo === 'dificil') {
                        contadorGanadasDif++;
                        CompletedGames = CompletedGames + WinOnDificult;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        //couterWinHard.push(0);
                        localStorage.setItem("contadorGanadasDificil", contadorGanadasDif);
                        //btnLanzarDado.setAttribute('disabled');

                    }
                }
            } else {
                if (nuevaPosicion === 100) {
                    btnLanzarDado.style.display = 'none';
                    alert('¡Has ganado!');

                    if (modo === 'facil') {
                        WinOnEasy++;
                        CompletedGames = CompletedGames + WinOnEasy;
                        localStorage.setItem("partidasGanadasFacil", WinOnEasy);
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                    }
                    if (modo === 'dificil') {
                        WinOnDificult++;
                        CompletedGames = CompletedGames + WinOnDificult;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasGanadasDificil", WinOnDificult);
                    }

                    contadorGanadasFacil++;
                }
                else if (modo === 'dificil') {
                    contadorGanadasDif++;

                }
            }
        }
    }

    function moverComputadora(pasos) {
        const nuevaPosicionPc = pcPos + pasos;

        if (nuevaPosicionPc >= 1 && nuevaPosicionPc <= 100) {
            // Movimiento normal
            for (let i = pcPos + 1; i <= nuevaPosicionPc; i++) {
                let numero;
                if (Math.floor((i - 1) / 10) % 2 === 0) {
                    numero = (i - 1) % 10 + 1 + (10 * Math.floor((i - 1) / 10));
                } else {
                    numero = 10 * Math.floor((i - 1) / 10) + 1 + (9 - (i - 1) % 10);
                }

                const fila2 = 9 - Math.floor((numero - 1) / 10);
                const columna2 = (numero - 1) % 10;

                setTimeout(function () {
                    setTimeout(() => {
                        moverFichaACasilla2(fila2, columna2);
                    }, i * 1);
                }, 2000);//La funcion se ejecuta 2 segundos despues para que la fichaPC vaya despues
            }

            pcPos = nuevaPosicionPc;

            // Validación de serpiente o escalera después del movimiento normal
            if (escalerasYSerpientes[nuevaPosicionPc]) {
                let diferencia = escalerasYSerpientes[nuevaPosicionPc] - nuevaPosicionPc;
                let mensaje = diferencia > 0
                    ? '¡La PC subido por una escalera!'
                    : '¡La PC bajado por una serpiente!';

                alert(mensaje);

                pcPos = escalerasYSerpientes[nuevaPosicionPc];

                let pasos = Math.abs(diferencia); // Tomamos el valor absoluto de la diferencia

                // Movemos la ficha retrocediendo o avanzando según la diferencia
                for (let i = 1; i <= pasos; i++) {
                    let paso = diferencia > 0 ? i : -i; // Avanzar o retroceder
                    let nuevaCasilla = nuevaPosicionPc + paso;

                    let numero;
                    if (Math.floor((nuevaCasilla - 1) / 10) % 2 === 0) {
                        numero = (nuevaCasilla - 1) % 10 + 1 + (10 * Math.floor((nuevaCasilla - 1) / 10));
                    } else {
                        numero = 10 * Math.floor((nuevaCasilla - 1) / 10) + 1 + (9 - (nuevaCasilla - 1) % 10);
                    }

                    let fila = 9 - Math.floor((numero - 1) / 10);
                    let columna = (numero - 1) % 10;

                    setTimeout(() => {
                        moverFichaACasilla2(fila, columna);
                    }, (i + nuevaPosicionPc) * 10);
                }

                if (nuevaPosicionPc === 100) {
                    btnLanzarDado.style.display = 'none';
                    alert('¡Has Perdido!');
                    if (modo === 'facil') {

                        LoseOnEasy++;
                        CompletedGames = CompletedGames + LoseOnEasy;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasPerdidasFacil", LoseOnEasy);
                    }
                    if (modo === 'dificil') {
                        LoseOnDificult++;
                        CompletedGames = CompletedGames + LoseOnDificult;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasPerdidasDificil", LoseOnDificult);

                        contadorPerdidasFacil++;
                        localStorage.setItem("contadorPerdidasFacil", contadorPerdidasFacil);
                        btnLanzarDado.setAttribute('disabled');
                    }
                    else if (modo === 'dificil') {
                        contadorPedridasDif++;
                        localStorage.setItem("contadorPerdidasFacil", contadorPedridasDif);
                        btnLanzarDado.setAttribute('disabled');

                    }
                }
            } else {
                if (nuevaPosicionPc === 100) {
                    btnLanzarDado.style.display = 'none';
                    alert('¡Has Perdido!');
                    if (modo === 'facil') {

                        LoseOnEasy++;
                        CompletedGames = CompletedGames + LoseOnEasy;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasPerdidasFacil", LoseOnEasy);
                    }
                    if (modo === 'dificil') {
                        LoseOnDificult++;
                        CompletedGames = CompletedGames + LoseOnDificult;
                        localStorage.setItem("partidasCompletadas", CompletedGames);
                        localStorage.setItem("partidasPerdidasDificil", LoseOnDificult);

                        contadorPerdidasFacil++;
                    }
                    else if (modo === 'dificil') {
                        contadorPedridasDif++;

                    }
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

    function moverFichaACasilla2(fila2, columna2) {
        if (casillas[fila2] && casillas[fila2][columna2]) {
            let casillaActual = casillas[fila2][columna2];
            let posicionCSS = casillaActual.getBoundingClientRect();

            let limiteTop = tablero.getBoundingClientRect().top;
            let limiteLeft = tablero.getBoundingClientRect().left;
            let limiteBottomPc = tablero.getBoundingClientRect().bottom - pcFicha.clientHeight;
            let limiteRightPc = tablero.getBoundingClientRect().right - pcFicha.clientWidth;

            let topFichaPc = Math.max(limiteTop, Math.min(limiteBottomPc, posicionCSS.top + window.scrollY + casillaActual.clientHeight / 2 - pcFicha.clientHeight / 2));
            let leftFichaPc = Math.max(limiteLeft, Math.min(limiteRightPc, posicionCSS.left + casillaActual.clientWidth / 2 - pcFicha.clientWidth / 2));

            pcFicha.style.top = topFichaPc + 'px';
            pcFicha.style.left = leftFichaPc + 'px';
        }
    }


    function obtenerParametroDeURL(parametro) {
        const url = new URL(window.location.href);
        return url.searchParams.get(parametro);
    }



});



/*
function Tablaestadisticas() {

    var name = localStorage.getItem("jugador", name);
    var totalGames = parseInt(localStorage.getItem("partidasTotales", totalGames));
    var totalEasy = parseInt(localStorage.getItem("partidasFacil", totalEasy));
    var totalDif = parseInt(localStorage.getItem("partidasDificil", totalDif));
    //concatenar toda la informacion obtenida como un registro creando boton ver, para ver estadisticas     
    var registro = "<tr><td>" + name + "</td><td>" + totalGames + "</td><td>" + totalEasy + "</td><td>" + totalDif;
    var fila = document.createElement("tr"); //objeto fila, con toda la informacion de la variable registro
    fila.innerHTML = registro; // tranferir la informacion de registro a la fila

    //diciendole que esa fila con la informacion obtenida, pertenece a la tabla grilla
    document.getElementById("grilla").appendChild(fila);
}

*/

// function Tablaestadisticas() {
//     var name = localStorage.getItem("jugador");
//     var totalGames = parseInt(localStorage.getItem("partidasTotales")) || 0;
//     var totalEasy = parseInt(localStorage.getItem("partidasFacil")) || 0;
//     var totalDif = parseInt(localStorage.getItem("partidasDificil")) || 0;

//     // Crear la fila con los datos
//     var registro = "<tr><td>" + name + "</td><td>" + totalGames + "</td><td>" + totalEasy + "</td><td>" + totalDif + "</td><td><button onclick='verEstadisticas(\"" + name + "\");'>Ver</button></td></tr>";
//     var fila = document.createElement("tr");
//     fila.innerHTML = registro;

//     // Añadir la fila a la tabla con el id 'grilla'
//     document.getElementById("grilla").appendChild(fila);
// }

// Función para ver estadísticas individuales de un jugador
// function verEstadisticas(nombre) {
//     // Aquí puedes implementar la lógica para mostrar las estadísticas individuales de un jugador
//     alert("Ver estadísticas de " + nombre);
// }
// Tablaestadisticas();


// **Grafico** Partidas ganadas en modo dificil vs partidas perdidas en modo dificil

// Función para generar un gráfico con datos del Local Storage
function generarGraficoModoDificilGanadasPerdidas() {
    // Obtener datos del Local Storage

    var partGDificil = parseInt(localStorage.getItem("partidasGanadasDificil")) || 0;
    var partPDificil = parseInt(localStorage.getItem("partidasPerdidasDificil")) || 0;

    // Cargar la biblioteca Google Charts
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    // Función para dibujar el gráfico
    function drawChart() {
        // Crear un array con los datos
        var data = google.visualization.arrayToDataTable([
            ['Partidas Modo Dificil', 'Partidas ganadas  vs partidas perdidas'],
            ['Partidas Ganadas', partGDificil],
            ['Partidas Perdidas', partPDificil]
        ]);

        // Opciones del gráfico
        var options = {
            title: 'Partidas Ganadas vs Perdidas en Modo Dificil',
            pieHole: 0.4,
            backgroundColor: {
                fill: 'none'
            },
            width: 500,  // Ajusta el ancho del gráfico
            height: 400  // Ajusta la altura del gráfico
        };

        // Crear el gráfico y colocarlo en un contenedor HTML con el id 'chart_div'
        var chart = new google.visualization.PieChart(document.getElementById('pieChart4'));
        chart.draw(data, options);
    }
}

google.charts.load('current', { 'packages': ['table'] });
google.charts.setOnLoadCallback(drawTable);

function drawTable() {
    var nombreJugador = localStorage.getItem('jugador');
    var partidasTot = parseInt(localStorage.getItem('partidasTotales'));
    var partidasEasyMode = parseInt(localStorage.getItem('partidasFacil'));
    var partidasDifficultMode = parseInt(localStorage.getItem('partidasDificil'));
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Nombre');
    data.addColumn('number', 'Partidas jugadas Total');
    data.addColumn('number', 'Partidas jugadas en modo facil');
    data.addColumn('number', 'Partidas jugadas en modo dificil');



    data.addRows([
        [nombreJugador, partidasTot, partidasEasyMode, partidasDifficultMode],
        // Add more rows as needed
    ]);

    var options = {
        cssClassNames: {
            headerRow: 'header-row',
            tableRow: 'table-row',
            oddTableRow: 'odd-table-row',
            selectedTableRow: 'selected-table-row',
            hoverTableRow: 'hover-table-row',
            headerCell: 'header-cell',
            tableCell: 'table-cell'
        }
    }


    var table = new google.visualization.Table(document.getElementById('grilla'));
    table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
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

