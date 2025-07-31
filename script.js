document.addEventListener('DOMContentLoaded', () => {
    const resultEl = document.getElementById('result');
    const lengthEl = document.getElementById('length');
    const uppercaseEl = document.getElementById('uppercase');
    const lowercaseEl = document.getElementById('lowercase');
    const numbersEl = document.getElementById('numbers');
    const symbolsEl = document.getElementById('symbols');
    const generateEl = document.getElementById('generate');
    const copyEl = document.getElementById('copy');
    const strengthBar = document.getElementById('strength-bar');

    const randomFunc = {
        lower: getRandomLower,
        upper: getRandomUpper,
        number: getRandomNumber,
        symbol: getRandomSymbol
    };

    copyEl.addEventListener('click', () => {
        const textarea = document.createElement('textarea');
        const password = resultEl.value;

        if (!password) return;

        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();

        // Show copied feedback
        const originalText = copyEl.textContent;
        copyEl.textContent = 'Copied!';
        setTimeout(() => {
            copyEl.textContent = originalText;
        }, 2000);
    });

    generateEl.addEventListener('click', () => {
        const length = +lengthEl.value;
        const hasLower = lowercaseEl.checked;
        const hasUpper = uppercaseEl.checked;
        const hasNumber = numbersEl.checked;
        const hasSymbol = symbolsEl.checked;

        resultEl.value = generatePassword(
            hasLower,
            hasUpper,
            hasNumber,
            hasSymbol,
            length
        );

        updateStrengthBar(resultEl.value);
    });

    function generatePassword(lower, upper, number, symbol, length) {
        let generatedPassword = '';
        const typesCount = lower + upper + number + symbol;
        const typesArr = [{ lower }, { upper }, { number }, { symbol }]
            .filter(item => Object.values(item)[0]);

        if (typesCount === 0) {
            return '';
        }

        for (let i = 0; i < typesArr.length; i++) {
            const funcName = Object.keys(typesArr[i])[0];
            generatedPassword += randomFunc[funcName]();
        }

        for (let i = 0; i < length - typesArr.length; i++) {
            const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
            const funcName = Object.keys(randomType)[0];
            generatedPassword += randomFunc[funcName]();
        }

        return shuffleString(generatedPassword);
    }

    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    function getRandomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }

    function getRandomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    function getRandomNumber() {
        return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    }

    function getRandomSymbol() {
        const symbols = '!@#$%^&*(){}[]=<>/,.';
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function updateStrengthBar(password) {
        if (!password) {
            strengthBar.style.width = '0%';
            strengthBar.style.backgroundColor = '#e0e0e0';
            return;
        }

        let strength = 0;
        const length = password.length;

        strength += Math.min(length / 50 * 50, 50);

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        const varietyCount = hasLower + hasUpper + hasNumber + hasSymbol;
        strength += (varietyCount / 4) * 50;

        strength = Math.min(strength, 100);
        strengthBar.style.width = strength + '%';

        if (strength < 40) {
            strengthBar.style.backgroundColor = '#ff5252'; // Weak (red)
        } else if (strength < 70) {
            strengthBar.style.backgroundColor = '#ffb142'; // Medium (orange)
        } else {
            strengthBar.style.backgroundColor = '#4CAF50'; // Strong (green)
        }
    }

    generateEl.click();
});