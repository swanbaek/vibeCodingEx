class AppleGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game settings
        this.cols = 8;
        this.rows = 10;
        this.gameTime = 30;
        this.timeLeft = this.gameTime;
        this.score = 0;
        this.gameOver = false;
        this.timerInterval = null;
        
        // Grid and cells
        this.grid = [];
        this.cellWidth = 0;
        this.cellHeight = 0;
        this.padding = 10;
        this.selectedApples = [];
        
        // Dragging
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.dragEnd = { x: 0, y: 0 };
        
        this.setupCanvas();
        this.initializeGame();
        this.setupEventListeners();
        this.startTimer();
        this.draw();
    }
    
    setupCanvas() {
        // 반응형 캔버스 크기 설정
        const containerWidth = this.canvas.parentElement.clientWidth - 40;
        const maxWidth = 900;
        const width = Math.min(containerWidth, maxWidth);
        const height = (width / this.cols) * this.rows;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.cellWidth = width / this.cols;
        this.cellHeight = height / this.rows;
    }
    
    initializeGame() {
        this.grid = [];
        this.score = 0;
        this.timeLeft = this.gameTime;
        this.gameOver = false;
        this.selectedApples = [];
        this.updateUI();
        
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = this.getRandomApple();
            }
        }
    }
    
    getRandomApple() {
        return Math.floor(Math.random() * 9) + 1; // 1-9
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
        
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('restartBtn').addEventListener('click', () => this.reset());
    }
    
    onMouseDown(e) {
        if (this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.dragStart = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        this.isDragging = true;
        this.selectedApples = [];
    }
    
    onMouseMove(e) {
        if (!this.isDragging || this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.dragEnd = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        this.updateSelectedApples();
    }
    
    onMouseUp(e) {
        if (!this.isDragging || this.gameOver) return;
        
        this.isDragging = false;
        this.handleSelection();
    }
    
    onMouseLeave(e) {
        this.isDragging = false;
    }
    
    updateSelectedApples() {
        this.selectedApples = [];
        
        const minX = Math.min(this.dragStart.x, this.dragEnd.x);
        const maxX = Math.max(this.dragStart.x, this.dragEnd.x);
        const minY = Math.min(this.dragStart.y, this.dragEnd.y);
        const maxY = Math.max(this.dragStart.y, this.dragEnd.y);
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cellX = col * this.cellWidth;
                const cellY = row * this.cellHeight;
                const cellEndX = cellX + this.cellWidth;
                const cellEndY = cellY + this.cellHeight;
                
                // Check if cell overlaps with drag rectangle
                if (!(cellEndX < minX || cellX > maxX || cellEndY < minY || cellY > maxY)) {
                    this.selectedApples.push({ row, col });
                }
            }
        }
    }
    
    handleSelection() {
        if (this.selectedApples.length === 0) return;
        
        // Calculate sum of selected apples
        const sum = this.selectedApples.reduce((acc, apple) => {
            return acc + this.grid[apple.row][apple.col];
        }, 0);
        
        if (sum === 10) {
            // Remove selected apples
            this.selectedApples.forEach(apple => {
                this.grid[apple.row][apple.col] = null;
            });
            
            // Update score (2 points per apple removed)
            this.score += this.selectedApples.length * 2;
            
            // Drop apples and fill grid
            this.dropAndFillApples();
        }
        
        // Always deselect after checking
        this.selectedApples = [];
        this.updateUI();
    }
    
    dropAndFillApples() {
        // Drop apples down to fill empty spaces
        for (let col = 0; col < this.cols; col++) {
            let writePos = this.rows - 1;
            
            // Move all non-null apples down
            for (let row = this.rows - 1; row >= 0; row--) {
                if (this.grid[row][col] !== null) {
                    this.grid[writePos][col] = this.grid[row][col];
                    if (writePos !== row) {
                        this.grid[row][col] = null;
                    }
                    writePos--;
                }
            }
            
            // Fill empty spaces at top with new apples
            for (let row = 0; row <= writePos; row++) {
                this.grid[row][col] = this.getRandomApple();
            }
        }
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    endGame() {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        this.showGameOverScreen();
    }
    
    showGameOverScreen() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    reset() {
        clearInterval(this.timerInterval);
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.initializeGame();
        this.startTimer();
        this.draw();
    }
    
    updateUI() {
        document.getElementById('timer').textContent = Math.max(0, this.timeLeft);
        document.getElementById('score').textContent = this.score;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#e5e5e7';
        this.ctx.lineWidth = 1;
        
        for (let row = 0; row <= this.rows; row++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, row * this.cellHeight);
            this.ctx.lineTo(this.canvas.width, row * this.cellHeight);
            this.ctx.stroke();
        }
        
        for (let col = 0; col <= this.cols; col++) {
            this.ctx.beginPath();
            this.ctx.moveTo(col * this.cellWidth, 0);
            this.ctx.lineTo(col * this.cellWidth, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw apples
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col] !== null) {
                    this.drawApple(col, row);
                }
            }
        }
        
        // Draw selection highlight
        if (this.isDragging) {
            this.drawDragRectangle();
            this.drawSelectedApples();
        }
        
        requestAnimationFrame(() => this.draw());
    }
    
    drawApple(col, row) {
        const x = col * this.cellWidth + this.cellWidth / 2;
        const y = row * this.cellHeight + this.cellHeight / 2;
        const radius = Math.min(this.cellWidth, this.cellHeight) / 2 - 8;
        
        // Draw apple circle
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw apple outline
        this.ctx.strokeStyle = '#ee5a52';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw stem
        this.ctx.strokeStyle = '#2d5016';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - radius);
        this.ctx.lineTo(x, y - radius - 8);
        this.ctx.stroke();
        
        // Draw number
        const number = this.grid[row][col];
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `bold ${Math.min(this.cellWidth, this.cellHeight) * 0.4}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number, x, y);
    }
    
    drawDragRectangle() {
        const minX = Math.min(this.dragStart.x, this.dragEnd.x);
        const maxX = Math.max(this.dragStart.x, this.dragEnd.x);
        const minY = Math.min(this.dragStart.y, this.dragEnd.y);
        const maxY = Math.max(this.dragStart.y, this.dragEnd.y);
        
        const width = maxX - minX;
        const height = maxY - minY;
        
        // Draw semi-transparent rectangle
        this.ctx.fillStyle = 'rgba(102, 126, 234, 0.15)';
        this.ctx.fillRect(minX, minY, width, height);
        
        // Draw outline
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(minX, minY, width, height);
    }
    
    drawSelectedApples() {
        this.selectedApples.forEach(apple => {
            const col = apple.col;
            const row = apple.row;
            const x = col * this.cellWidth + this.cellWidth / 2;
            const y = row * this.cellHeight + this.cellHeight / 2;
            const radius = Math.min(this.cellWidth, this.cellHeight) / 2 - 8;
            
            // Draw darker apple background
            this.ctx.fillStyle = '#cc5555';
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw darker outline
            this.ctx.strokeStyle = '#bb4444';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw stem
            this.ctx.strokeStyle = '#2d5016';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - radius);
            this.ctx.lineTo(x, y - radius - 8);
            this.ctx.stroke();
            
            // Draw number
            const number = this.grid[row][col];
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `bold ${Math.min(this.cellWidth, this.cellHeight) * 0.4}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(number, x, y);
            
            // Draw highlight outline
            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
            this.ctx.stroke();
        });
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AppleGame();
});
