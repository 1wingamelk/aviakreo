document.addEventListener('DOMContentLoaded', () => {
    const editableValue = document.getElementById('editableValue');
    const playButton = document.getElementById('playButton');
    const cooldownTimer = document.getElementById('cooldownTimer');

    const COOLDOWN_SECONDS = 15;
    let isCooldown = false;
    let countdownInterval = null;
    let clickCount = 0;

    function generateRandomValue() {
        clickCount++;

        if (clickCount % 5 === 0) {
            const randomNum = Math.random() * (500 - 120) + 120;
            return (randomNum / 10).toFixed(1);
        } else {
            const randomNum = Math.random() * (40 - 10) + 10;
            return (randomNum / 10).toFixed(1);
        }
    }

    function startCooldown() {
        isCooldown = true;
        playButton.disabled = true;
        let remainingTime = COOLDOWN_SECONDS;
        cooldownTimer.textContent = `Перезарядка: ${remainingTime}с`;

        countdownInterval = setInterval(() => {
            remainingTime--;
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                cooldownTimer.textContent = '';
                playButton.disabled = false;
                isCooldown = false;
            } else {
                cooldownTimer.textContent = `Перезарядка: ${remainingTime}с`;
            }
        }, 1000);
    }

    editableValue.addEventListener('click', () => {
        if (!editableValue.hasAttribute('contenteditable')) {
            editableValue.setAttribute('contenteditable', 'true');
            editableValue.focus();
            const range = document.createRange();
            range.selectNodeContents(editableValue);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });

    editableValue.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            editableValue.blur();
        }
    });

    editableValue.addEventListener('blur', () => {
        editableValue.removeAttribute('contenteditable');
        const selection = window.getSelection();
        selection.removeAllRanges();

        let currentValue = editableValue.textContent.trim();
        if (currentValue.endsWith('X')) {
            currentValue = currentValue.slice(0, -1);
        }

        let numValue = parseFloat(currentValue);

        if (isNaN(numValue) || currentValue === '') {
            editableValue.textContent = '???';
        } else {
            editableValue.textContent = `${numValue.toFixed(1)}X`;
        }
    });

    playButton.addEventListener('click', () => {
        if (isCooldown) {
            return;
        }

        editableValue.innerHTML = '<span class="loading-dots"><span class="loading-dot">.</span><span class="loading-dot">.</span><span class="loading-dot">.</span></span>';

        setTimeout(() => {
            const newValue = generateRandomValue();
            editableValue.textContent = `${newValue}X`;
            startCooldown();
        }, 1500);
    });
});