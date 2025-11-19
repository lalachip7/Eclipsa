const  GAME_CONTAINER = document.getElementById("game-container");  // Obtiene el contenedor principal
                                                                    // del juego desde el DOM
let currentSccene = null;  // Variable para rastrear la escena actual del juego

// Función para cambiar la escena del juego
function changeScene(newScene) {
    GAME_CONTAINER.innerHTML = "";  // Limpia el contenedor del juego

    // Lógica para cargar la nueva escena
    switch (newScene) {
        case "menu":
            loadMenuScene();
            break;  
        case "level1":
            loadLevel1Scene();
            break;
        case "credits":
            loadCreditsScene();
            break;
        case "gameover":
            loadGameOverScene();
            break;
        case "options":
            loadOptionsScene();
            break;
        case "pause":
            loadPauseScene();
            break; 
        case "tutorial":
            loadTutorialScene();
            break;  
        case "levels":
            loadLevelsScene();
            break;
        default:
            console.error("Escena desconocida: " + newScene);
    }

    // Iniciar el juego cargando el menú principal
    document.addEventListener('DOMContentLoaded', () => {
        changeScene('menu');    
    });

    function loadMenuScene() {
        console.log("Cargando escena del menú principal...");
        // Aquí iría la lógica para cargar la escena del menú principal
    }

    function loadLevel1Scene() {
        console.log("Cargando escena del nivel 1...");
        // Aquí iría la lógica para cargar la escena del nivel 1
    }   

    function loadCreditsScene() {
        console.log("Cargando escena de créditos...");
        // Aquí iría la lógica para cargar la escena de créditos
    }

    function loadGameOverScene() {
        console.log("Cargando escena de fin del juego...");
        // Aquí iría la lógica para cargar la escena de fin del juego
    }

    function loadOptionsScene() {
        console.log("Cargando escena de opciones...");
        // Aquí iría la lógica para cargar la escena de opciones
    }

    function loadPauseScene() {
        console.log("Cargando escena de pausa...");
        // Aquí iría la lógica para cargar la escena de pausa
    }   

    function loadTutorialScene() {
        console.log("Cargando escena de tutorial...");
        // Aquí iría la lógica para cargar la escena de tutorial
    }

    function loadLevelsScene() {
        console.log("Cargando escena de selección de niveles...");
        // Aquí iría la lógica para cargar la escena de selección de niveles
    }

}