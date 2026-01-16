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
        this.load.html('form', 'assets/html/logininform.html');
        this.load.image('background_auth', 'assets/fondo_pantalla_inicio.png');
    }

    create() {
        const { width, height } = this.scale;

        // --- BACKGROUND ---
        this.add.image(width / 2, height / 2, 'background_auth')
            .setDisplaySize(width, height);

        // --- HTML FORM (DOM ELEMENT) ---
        this.formElement = this.add.dom(width / 2, height / 2)
            .createFromCache('form');

        // --- FEEDBACK TEXT ---
        this.feedbackText = this.add.text(
            width / 2,
            height / 2 + 220,
            '',
            {
                fontSize: '22px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        // --- BACK BUTTON ---
        const backBtn = this.add.text(
            width / 2,
            height - 90,
            'Volver / Cancelar',
            {
                fontSize: '26px',
                color: '#ff6666',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            this.scene.start('GameModeScene');
        });

        // --- FORM LOGIC ---
        this.formElement.addListener('click');

        this.formElement.on('click', (event) => {
            if (!event.target.name) return;

            const username = this.formElement.getChildByName('username')?.value;
            const password = this.formElement.getChildByName('password')?.value;

            if (!username || !password) {
                this.showMessage('Introduce usuario y contraseña', 'red');
                return;
            }

            if (event.target.name === 'loginButton') {
                this.doLogin(username, password);
            }

            if (event.target.name === 'registerButton') {
                this.doRegister(username, password);
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

            this.showMessage('Cuenta creada. Pulsa ENTRAR.', 'green');

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
        // Clean DOM when leaving scene (important)
        if (this.formElement) {
            this.formElement.removeListener('click');
            this.formElement.destroy();
        }
    }
}
