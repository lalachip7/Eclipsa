// src/client/scenes/AuthScene.js
import Phaser from "phaser";

export class AuthScene extends Phaser.Scene {
    constructor() {
        super('AuthScene');
    }

    init(data) {
        // Destino después del login exitoso (por defecto LobbyScene)
        this.destination = data.destination || 'LobbyScene';
    }

    preload() {
        // Caja de fondo
        this.load.image('tutorialBox', 'assets/caja.png');
        // Texto Iniciar Sesion
        this.load.image('LogInText', 'assets/textp_iniciarSesion.png');

        // Botón de salir (x)
        this.load.image('ExitButton', 'assets/cancelar.png');
        this.load.image('ExitButtonHover', 'assets/cancelarHover.png');

        // Botón de login
        this.load.image('LoginButton', 'assets/entrar.png');
        this.load.image('LoginButtonHover', 'assets/entrarHover.png');

        // Botón de register
        this.load.image('RegisterButton', 'assets/registro.png');
        this.load.image('RegisterButtonHover', 'assets/registroHover.png');
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        // Fondo oscuro
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja central
        this.add.image(700, 400, 'tutorialBox')
            .setOrigin(0.5)
            .setScale(1);

        // Imagen de LogIn
        this.add.image(700, 180, 'LogInText')
            .setOrigin(0.5)
            .setScale(1);

        // Label Username
        this.add.text(400, 290, 'Usuario:', {
            fontSize: '22px',
            color: '#ffffff',
            fontFamily: 'Caudex'
        });

        // Input Username (HTML)
        this.usernameInput = this.createHTMLInput(550, 280, 300, 'text');

        // Label Password
        this.add.text(400, 355, 'Contraseña:', {
            fontSize: '22px',
            color: '#ffffff',
            fontFamily: 'Caudex'
        });

        // Input Password (HTML)
        this.passwordInput = this.createHTMLInput(550, 345, 300, 'password');

        // Mensaje de error/éxito
        this.messageText = this.add.text(700, 420, '', {
            fontSize: '18px',
            color: '#ff0000',
            fontFamily: 'Caudex',
            align: 'center',
            wordWrap: { width: 400 }
        }).setOrigin(0.5);

        let hoverImg = null;

        // Botón LOGIN
        const loginBtn = this.add.image(550, 480, 'LoginButton')
            .setOrigin(0.5)
            .setScale(0.6)
            .setInteractive({ useHandCursor: true });

        loginBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(550, 480, 'LoginButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.6)
                    .setDepth(loginBtn.depth + 1);
            }
        });

        loginBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        loginBtn.on('pointerdown', () => {
            this.handleLogin();
        });

        // Botón REGISTER
        const registerBtn = this.add.image(850, 480, 'RegisterButton')
            .setOrigin(0.5)
            .setScale(0.6)
            .setInteractive({ useHandCursor: true });

        registerBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(850, 480, 'RegisterButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.6)
                    .setDepth(registerBtn.depth + 1);
            }
        });

        registerBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        registerBtn.on('pointerdown', () => {
            this.handleRegister();
        });

        // Botón VOLVER
        const backBtn = this.add.image(700, 570, 'ExitButton')
            .setOrigin(0.5)
            .setScale(0.6)
            .setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(700, 570, 'ExitButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.6)
                    .setDepth(backBtn.depth + 1);
            }
        });

        backBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        backBtn.on('pointerdown', () => {
            this.cleanupInputs();
            this.scene.start('MenuScene');
        });

        // Permitir Enter para login
        this.input.keyboard.on('keydown-ENTER', () => {
            this.handleLogin();
        });
    }

    /**
     * Crear input HTML (Phaser DOM Element)
     */
    createHTMLInput(x, y, width, type = 'text') {
        const input = document.createElement('input');
        input.type = type;
        input.style.position = 'absolute';
        input.style.width = `${width}px`;
        input.style.height = '35px';
        input.style.fontSize = '18px';
        input.style.fontFamily = 'Caudex';
        input.style.padding = '5px 10px';
        input.style.border = '2px solid #ffffff';
        input.style.borderRadius = '5px';
        input.style.backgroundColor = '#1a1a2e';
        input.style.color = '#ffffff';
        input.style.outline = 'none';
        input.style.zIndex = '1000'; 

        // Posicionar en el canvas
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        input.style.left = `${rect.left + x}px`;
        input.style.top = `${rect.top + y}px`;

        document.body.appendChild(input);

        return input;
    }

    /**
     * Manejar Login
     */
    async handleLogin() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        // Validación
        if (!username || !password) {
            this.showMessage('Por favor completa todos los campos', 'error');
            return;
        }

        this.showMessage('Iniciando sesión...', 'info');

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso
                console.log('Login exitoso:', data);

                // Guardar datos del usuario en localStorage
                if (data.id) {
                    localStorage.setItem('userId', data.id); 
                    localStorage.setItem('username', data.username);

                    this.showMessage('¡Bienvenido ' + data.username + '!', 'success');

                    // Ir al destino después de 1 segundo
                    this.time.delayedCall(1000, () => {
                        this.cleanupInputs();
                        this.scene.start(this.destination);
                    });
                }
            } else {
                // Error de login
                this.showMessage(data.error || 'Usuario o contraseña incorrectos', 'error');
            }

        } catch (error) {
            console.error('Error en login:', error);
            this.showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
        }
    }

    /**
     * Manejar Registro
     */
    async handleRegister() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        // Validación
        if (!username || !password) {
            this.showMessage('Por favor completa todos los campos', 'error');
            return;
        }

        if (username.length < 3) {
            this.showMessage('El usuario debe tener al menos 3 caracteres', 'error');
            return;
        }

        if (password.length < 4) {
            this.showMessage('La contraseña debe tener al menos 4 caracteres', 'error');
            return;
        }

        this.showMessage('Creando cuenta...', 'info');

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Registro exitoso
                console.log('Registro exitoso:', data);

                // Guardar datos del usuario
                localStorage.setItem('userId', data.id);
                localStorage.setItem('username', data.username);

                this.showMessage('¡Cuenta creada! Bienvenido ' + data.username, 'success');

                // Ir al destino después de 1.5 segundos
                this.time.delayedCall(1500, () => {
                    this.cleanupInputs();
                    this.scene.start(this.destination);
                });

            } else {
                // Error de registro
                this.showMessage(data.error || 'No se pudo crear la cuenta', 'error');
            }

        } catch (error) {
            console.error('Error en registro:', error);
            this.showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
        }
    }

    /**
     * Mostrar mensaje al usuario
     */
    showMessage(text, type = 'info') {
        const colors = {
            error: '#ff4444',
            success: '#44ff44',
            info: '#ffff44'
        };

        this.messageText.setText(text);
        this.messageText.setColor(colors[type] || colors.info);
    }

    /**
     * Limpiar inputs HTML cuando se sale de la escena
     */
    cleanupInputs() {
        if (this.usernameInput && this.usernameInput.parentNode) {
            this.usernameInput.parentNode.removeChild(this.usernameInput);
        }
        if (this.passwordInput && this.passwordInput.parentNode) {
            this.passwordInput.parentNode.removeChild(this.passwordInput);
        }
    }

    shutdown() {
        this.cleanupInputs();
        this.input.keyboard.off('keydown-ENTER');
    }
}