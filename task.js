 document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            const inputs = document.getElementById('inputs');
            const inputElements = [document.getElementById('input1'), document.getElementById('input2'), document.getElementById('input3'), document.getElementById('input4')];
            const submitButton = document.getElementById('submit');

            const width = canvas.width;
            const height = canvas.height;
            const BUTTON_COLOR = 'rgb(70, 130, 180)';
            const HOVER_COLOR = 'rgb(100, 149, 237)';
            const WHITE = '#FFFFFF';
            const buttonWidth = 150;
            const buttonHeight = 50;
            const buttons = [];
            const images = [];
            const quadrants = [false, false, false, false];
            let resetButton = null;

            let labels = [];

            function loadImage(src) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
            }

            async function loadImages() {
                const sources = ['src/images/1.jpg', 'src/images/2.jpg', 'src/images/3.jpg', 'src/images/4.jpg'];
                for (let src of sources) {
                    const img = await loadImage(src);
                    images.push(img);
                }
            }

            async function initializeGame() {
                await loadImages();
                inputs.style.display = 'block';
            }

            function drawButton(button, label, color) {
                ctx.fillStyle = color;
                ctx.fillRect(button.x, button.y, button.width, button.height);
                ctx.fillStyle = WHITE;
                ctx.font = '36px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, button.x + button.width / 2, button.y + button.height / 2);
            }

            function drawButtons() {
                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i]) {
                        const color = ctx.isPointInPath(buttons[i].path, mouseX, mouseY) ? HOVER_COLOR : BUTTON_COLOR;
                        drawButton(buttons[i], labels[i], color);
                    }
                }
            }

            function drawResetButton() {
                if (resetButton) {
                    const color = ctx.isPointInPath(resetButton.path, mouseX, mouseY) ? HOVER_COLOR : BUTTON_COLOR;
                    drawButton(resetButton, 'Reset', color);
                }
            }

            function drawImages() {
                if (quadrants[0]) ctx.drawImage(images[0], 0, 0, width / 2, height / 2);
                if (quadrants[1]) ctx.drawImage(images[1], width / 2, 0, width / 2, height / 2);
                if (quadrants[2]) ctx.drawImage(images[2], 0, height / 2, width / 2, height / 2);
                if (quadrants[3]) ctx.drawImage(images[3], width / 2, height / 2, width / 2, height / 2);
            }

            function resetGame() {
                labels = [];
                for (let input of inputElements) input.value = '';
                buttons.length = 0;
                quadrants.fill(false);
                resetButton = null;
                inputs.style.display = 'block';
            }

            submitButton.addEventListener('click', async () => {
                labels = inputElements.map(input => input.value);
                inputs.style.display = 'none';
                buttons.push(
                    { x: 50, y: height - buttonHeight - 50, width: buttonWidth, height: buttonHeight, path: new Path2D() },
                    { x: 250, y: height - buttonHeight - 50, width: buttonWidth, height: buttonHeight, path: new Path2D() },
                    { x: 450, y: height - buttonHeight - 50, width: buttonWidth, height: buttonHeight, path: new Path2D() },
                    { x: 650, y: height - buttonHeight - 50, width: buttonWidth, height: buttonHeight, path: new Path2D() }
                );
                console.log('test if button clicked')
                drawImages(); // Draw images after button click
            });

            canvas.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                if (resetButton && ctx.isPointInPath(resetButton.path, mouseX, mouseY)) {
                    resetGame();
                } else {
                    for (let i = 0; i < buttons.length; i++) {
                        if (buttons[i] && ctx.isPointInPath(buttons[i].path, mouseX, mouseY)) {
                            quadrants[i] = true;
                            buttons[i] = null;
                            break;
                        }
                        console.log('test if button clicked')
                    }
                }

                if (quadrants.every(Boolean) && !resetButton) {
                    resetButton = { x: (width - buttonWidth) / 2, y: (height - buttonHeight) / 2, width: buttonWidth, height: buttonHeight, path: new Path2D() };
                }
            });

            let mouseX = 0;
            let mouseY = 0;

            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;
            });

            function gameLoop() {
                ctx.clearRect(0, 0, width, height);
                drawImages();
                drawButtons();
                drawResetButton();
                requestAnimationFrame(gameLoop);
            }

            initializeGame();
            gameLoop();
        });