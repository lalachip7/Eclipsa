import Phaser from "phaser";

export class AuthScene extends Phaser.Scene {
    constructor() {
        super('AuthScene');
    }

    // 1. Recibimos el destino cuando llamamos a esta escena
    // Si venimos de "Jugar Online", data.destination será 'LobbyScene'
    init(data) {
        this.destination = data.destination || 'MenuScene';
    }

    preload() {
        // Cargar el HTML del formulario (asegúrate de que el archivo existe en public/assets/html/)
        this.load.html('form', 'assets/html/loginform.html');
        
        // Usamos una imagen de fondo (puedes reutilizar la del menú si quieres)
        this.load.image('background_auth', 'assets/fondo_pantalla_inicio.png'); 
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // --- FONDO ---
        // Asegúrate de que la imagen 'background_auth' coincida con lo que cargaste en preload
        this.add.image(width / 2, height / 2, 'background_auth')
            .setDisplaySize(width, height);

        // --- FORMULARIO HTML ---
        // Esto crea el formulario encima del juego
        const element = this.add.dom(width / 2, height / 2).createFromCache('form');

        // --- TEXTO DE FEEDBACK ---
        // Para mostrar mensajes como "Contraseña incorrecta" o "Conectando..."
        this.feedbackText = this.add.text(width / 2, height / 2 + 220, '', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // --- BOTÓN VOLVER ---
        // Por si el jugador quiere cancelar y volver al selector de modo
        const backBtn = this.add.text(width / 2, height - 100, 'Volver / Cancelar', {
            fontSize: '28px',
            color: '#ff6666',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setStyle({ color: '#ff0000' }));
        backBtn.on('pointerout', () => backBtn.setStyle({ color: '#ff6666' }));
        
        backBtn.on('pointerdown', () => {
            // Volvemos a la selección de modo (GameModeScene)
            this.scene.start('GameModeScene');
        });

        // --- LÓGICA DEL FORMULARIO ---
        element.addListener('click');

        element.on('click', (event) => {
            // Botón ENTRAR del HTML
            if (event.target.name === 'loginButton') {
                const usernameInput = element.getChildByName('username');
                const passwordInput = element.getChildByName('password');

                if (usernameInput.value && passwordInput.value) {
                    this.doLogin(usernameInput.value, passwordInput.value);
                } else {
                    this.showMessage('Por favor, introduce usuario y contraseña', 'red');
                }
            }

            // Botón REGISTRO del HTML
            if (event.target.name === 'registerButton') {
                const usernameInput = element.getChildByName('username');
                const passwordInput = element.getChildByName('password');

                if (usernameInput.value && passwordInput.value) {
                    this.doRegister(usernameInput.value, passwordInput.value);
                } else {
                    this.showMessage('Por favor, introduce usuario y contraseña', 'red');
                }
            }
        });
    }

    // --- CONEXIÓN CON EL BACKEND ---

    async doLogin(username, password) {
        this.showMessage('Conectando...', 'yellow');

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // ÉXITO
                this.showMessage(`¡Bienvenido, ${data.username}!`, 'green');

                // Guardar usuario en el registro global de Phaser
                this.registry.set('user', data);

                // Redirigir al destino (LobbyScene) tras 1 segundo
                this.time.delayedCall(1000, () => {
                    this.scene.start(this.destination);
                });
            } else {
                // ERROR DE CREDENCIALES
                this.showMessage(data.error || 'Usuario o contraseña incorrectos', 'red');
            }
        } catch (error) {
            console.error(error);
            this.showMessage('Error de conexión con el servidor', 'red');
        }
    }

    async doRegister(username, password) {
        this.showMessage('Registrando...', 'yellow');

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('¡Cuenta creada! Ahora pulsa ENTRAR.', 'green');
            } else {
                this.showMessage(data.error || 'Error al registrar usuario', 'red');
            }
        } catch (error) {
            console.error(error);
            this.showMessage('Error de conexión', 'red');
        }
    }

    // Helper para cambiar el texto de feedback
    showMessage(text, colorName) {
        const colors = { 
            red: '#ff4444', 
            green: '#44ff44', 
            yellow: '#ffff44',
            white: '#ffffff'
        };
        this.feedbackText.setText(text);
        this.feedbackText.setColor(colors[colorName] || colors.white);
    }
}