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
        
        // Botón de salir (x)
        this.load.image('ExitButton', 'assets/salir.png');
        this.load.image('ExitButtonHover', 'assets/salirHover.png');

        // Botón de login
        this.load.image('LoginButton', 'assets/jugar.png'); // Reutilizamos
        this.load.image('LoginButtonHover', 'assets/jugarHover.png');

        // Botón de register
        this.load.image('RegisterButton', 'assets/jugarLocal.png'); // Reutilizamos
        this.load.image('RegisterButtonHover', 'assets/jugarLocalHover.png');
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

        // Título
        this.add.text(700, 180, 'INICIAR SESIÓN', {
            fontSize: '42px',
            color: '#ffffff',
            fontFamily: 'Caudex',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // === CAMPOS DE TEXTO ===

        // Label Username
        this.add.text(450, 260, 'Usuario:', {
            fontSize: '22px',
            color: '#ffffff',
            fontFamily: 'Caudex'
        });

        // Input Username (HTML)
        this.usernameInput = this.createHTMLInput(550, 250, 300, 'username');

        // Label Password
        this.add.text(450, 330, 'Contraseña:', {
            fontSize: '22px',
            color: '#ffffff',
            fontFamily: 'Caudex'
        });

        // Input Password (HTML)
        this.passwordInput = this.createHTMLInput(550, 320, 300, 'password');

        // === MENSAJE DE ERROR/ÉXITO ===
        this.messageText = this.add.text(700, 400, '', {
            fontSize: '18px',
            color: '#ff0000',
            fontFamily: 'Caudex',
            align: 'center',
            wordWrap: { width: 400 }
        }).setOrigin(0.5);

        // === BOTONES ===

        let hoverImg = null;

        // Botón LOGIN
        const loginBtn = this.add.image(550, 480, 'LoginButton')
            .setOrigin(0.5)
            .setScale(0.6)
            .setInteractive({ useHandCursor: true });

        this.add.text(550, 480, 'ENTRAR', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Caudex',
            fontStyle: 'bold'
        }).setOrigin(0.5);

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

        this.add.text(850, 480, 'REGISTRARSE', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Caudex',
            fontStyle: 'bold'
        }).setOrigin(0.5);

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
                console.log('✅ Login exitoso:', data);

                // Guardar datos del usuario en localStorage
                localStorage.setItem('userId', data.id);
                localStorage.setItem('username', data.username);

                this.showMessage('¡Bienvenido ' + data.username + '!', 'success');

                // Ir al destino después de 1 segundo
                this.time.delayedCall(1000, () => {
                    this.cleanupInputs();
                    this.scene.start(this.destination);
                });

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
                console.log('✅ Registro exitoso:', data);

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