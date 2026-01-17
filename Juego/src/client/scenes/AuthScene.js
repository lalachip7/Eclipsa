import Phaser from "phaser";

export class AuthScene extends Phaser.Scene {
    constructor() {
        super('AuthScene');
    }

    init(data) {
        // Destination scene after successful login
        this.destination = data?.destination || 'MenuScene';
    }

    preload() {
        // ✅ CORREGIDO: Usamos tu nombre de archivo 'logininform.html'
        this.load.html('form', 'assets/html/logininform.html');
        this.load.image('background_auth', 'assets/fondo_pantalla_inicio.png');
    }

    create() {
        const { width, height } = this.scale;

    // 1. Fondo del MUNDO (El bosque, pantalla completa)
        this.add.image(width / 2, height / 2, 'background_auth').setDisplaySize(width, height); 
        // ESTÁ BIEN estirar este fondo porque es el paisaje, no la piedra UI.

    // 2. Formulario HTML (Que contiene la piedra "caja.png" y los botones)
        this.formElement = this.add.dom(width / 2, height / 2).createFromCache('form');

        // --- FEEDBACK TEXT ---
        this.feedbackText = this.add.text(
            width / 2,
            height / 2 + 260,
            '',
            {
                fontSize: '22px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                fontFamily: 'Cadex, Arial, sans-serif'
            }
        ).setOrigin(0.5);

        // --- FORM LOGIC ---
        this.formElement.addListener('click');

        this.formElement.on('click', (event) => {
            const targetName = event.target.name;
            if (!targetName) return;

            // 1. Lógica del botón VOLVER (HTML)
            if (targetName === 'backButton') {
                this.scene.start('GameModeScene');
                return;
            }

            // Para Login y Registro necesitamos los inputs
            const username = this.formElement.getChildByName('username')?.value;
            const password = this.formElement.getChildByName('password')?.value;

            // 2. Lógica de LOGIN
            if (targetName === 'loginButton') {
                if (!username || !password) {
                    this.showMessage('Introduce usuario y contraseña', 'red');
                } else {
                    this.doLogin(username, password);
                }
            }

            // 3. Lógica de REGISTRO
            if (targetName === 'registerButton') {
                if (!username || !password) {
                    this.showMessage('Introduce usuario y contraseña', 'red');
                } else {
                    this.doRegister(username, password);
                }
            }
        });
    }

    // --- BACKEND CONNECTION ---

    async doLogin(username, password) {
        this.showMessage('Conectando...', 'yellow');

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Credenciales incorrectas');
            }

            // Save logged user globally
            this.registry.set('user', data);

            this.showMessage(`¡Bienvenido, ${data.username}!`, 'green');

            this.time.delayedCall(800, () => {
                this.scene.start(this.destination);
            });

        } catch (err) {
            console.error(err);
            this.showMessage(err.message, 'red');
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

            if (!response.ok) {
                throw new Error(data.error || 'Error al registrar');
            }

            this.showMessage('Cuenta creada. Iniciando sesión...', 'green');
            
            // ✅ AUTO-LOGIN después del registro
            this.time.delayedCall(500, () => {
                this.doLogin(username, password);
            });

        } catch (err) {
            console.error(err);
            this.showMessage(err.message, 'red');
        }
    }

    showMessage(text, color) {
        const colors = {
            red: '#ff4444',
            green: '#44ff44',
            yellow: '#ffff44',
            white: '#ffffff'
        };

        this.feedbackText.setText(text);
        this.feedbackText.setColor(colors[color] || colors.white);
    }

    shutdown() {
        if (this.formElement) {
            this.formElement.removeListener('click');
            this.formElement.destroy();
        }
    }
}