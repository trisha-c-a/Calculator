let currentInput = "";
let firstOperand = null;
let currentOperator = null;
let resultDisplay = null;

let mentalMathMode = false;
const allButtons = []; // Global list of calculator buttons
let mentalMathBtn = null; // Global toggle button
let countdownInterval = null; // Track the countdown timer

function addition(a,b){
    return a + b;
}

function subtraction(a,b){
    return a - b;
}

function multiplication(a,b){
    return a*b;
}

function division(a,b){
    if (b==0){
        return "DIVISION BY 0!";
    }
    return Math.round((a/b)*10000)/10000;
}

function operate(a,b,operation){
    if (operation=="+"){
        return addition(a,b);
    }
    else if (operation=="-"){
        return subtraction(a,b);
    }
    else if (operation=="*"){
        return multiplication(a,b);
    }
    else{
        return division(a,b);
    }
}

function createButtons(parent, values) {
    for (let i = 0; i < values.length; i++) {
        const button = document.createElement("button");
        button.innerText = values[i];
        button.addEventListener("click", () => handleButtonClick(values[i]));
        parent.appendChild(button);
        allButtons.push(button);
    }
}

function setButtonsEnabled(enabled) {
    allButtons.forEach(btn => {
        btn.disabled = !enabled;
    });

    if (mentalMathBtn) {
        mentalMathBtn.disabled = false;
    }
}


function handleButtonClick(value) {
    if (!isNaN(value)) {
        currentInput += value;
        resultDisplay.innerText = currentInput;
    } else if (value === "AC") {
        currentInput = "";
        firstOperand = null;
        currentOperator = null;
        resultDisplay.innerText = "0";

    } else if (value === "=") {
        if (firstOperand !== null && currentOperator !== null && currentInput !== "") {
            const secondOperand = parseFloat(currentInput);
            let result = operate(firstOperand, secondOperand, currentOperator);

            if (mentalMathMode) {
                let countdown = 5;
                resultDisplay.innerText = `Think... ${countdown}`;
                setButtonsEnabled(false);

                countdownInterval = setInterval(() => {
                    countdown--;
                    if (countdown > 0) {
                        resultDisplay.innerText = `Think... ${countdown}`;
                    } else {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        resultDisplay.innerText = result;
                        setButtonsEnabled(true);
                    }
                }, 1000);
        }
        else {
                resultDisplay.innerText = result;
                countdownInterval = null;
            }

            currentInput = "";
            firstOperand = result;
            currentOperator = null;
        }
    } else {
        if (firstOperand !== null && currentOperator !== null && currentInput !== "") {
            const secondOperand = parseFloat(currentInput);
            const result = operate(firstOperand, secondOperand, currentOperator);
            resultDisplay.innerText = result;

            firstOperand = result;
            currentOperator = value;
            currentInput = "";
        } else if (currentInput !== "") {
            firstOperand = parseFloat(currentInput);
            currentOperator = value;
            currentInput = "";
        } else if (firstOperand !== null) {
            currentOperator = value;
        }
    }
}

function createCalculator(){
    const calculator = document.querySelector(".calculator");

    mentalMathBtn = document.createElement("button");
    mentalMathBtn.innerText = "Mental Math Activate";
    mentalMathBtn.className = "toggle";
    
    mentalMathBtn.addEventListener("click", () => {
        mentalMathMode = !mentalMathMode;
        mentalMathBtn.innerText = mentalMathMode ? "Mental Math Deactivate" : "Mental Math Activate";

        if (!mentalMathMode && countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;

            resultDisplay.innerText = "Canceled";
            setButtonsEnabled(true);
    }
});

    calculator.appendChild(mentalMathBtn);

    resultDisplay = document.createElement("div");
    resultDisplay.className = "result";
    resultDisplay.innerText = "0";
    calculator.appendChild(resultDisplay);

    const buttons = [
        "7", "8", "9", "/",
        "4", "5", "6", "*",
        "1", "2", "3", "-",
        "0", "AC", "=", "+"
    ];

    createButtons(calculator, buttons);
}

createCalculator();