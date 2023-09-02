let state = 0;
let screen = document.getElementById("screen");
let calc_body = document.getElementById("calc_body");
let cursor = document.getElementById("cursor");
let id = null;

window.addEventListener('load', () => {
    
    fillScreen();
    fillBody();
    blinkCursor();

    var buttons2 = document.querySelectorAll('.display');
    buttons2.forEach((button) => { button.addEventListener('click', updateDisplay); })
    var enter1 = document.getElementById("enter");
    enter1.addEventListener('click', showResult);
    var clearButton = document.getElementById("clear");
    clearButton.addEventListener('click', clearDisplay);
    var leftarrow = document.getElementByClassName("leftarrow");
    var rightarrow = document.getElementByClassName("rightarrow");
});

fillScreen = () => {
    let screen = document.getElementById("screen");
    let context = screen.getContext("2d");
    context.fillStyle = "white";
    context.lineWidth = 10;
    context.fillRect(10, 10, 280, 100);
}

fillBody = () => {
    let body = document.getElementById("calc_body");
    let context = body.getContext("2d");
    context.fillStyle = "black";
    context.lineWidth = 10;
    context.moveTo(0, 0);
    context.bezierCurveTo(0, 100, 0, 150, 50, body.height);
    context.lineTo(body.width - 50, body.height);
    context.bezierCurveTo(body.width, 150, body.width, 100, body.width, 0);
    context.lineTo(0, 0);
    context.stroke();
    context.fill();
}

function blinkCursor() {
    var elem = document.getElementById("cursor");
    clearInterval(id);
    id = setInterval(hide, 1000);
    function hide() {
        elem.hidden = !elem.hidden;
    }
}


function updateDisplay(event) {
    let txt = event.currentTarget.innerText;
    if (state == 1) {
        clearDisplay(event);
        state = 0;
    }
    document.getElementById('result').textContent += txt;
}

function showLeftParentheses() {
    if (state == 1) {
        clearDisplay();
        state = 0;
    }
    document.getElementById('result').textContent += "(";
}

function showRightParentheses() {
    if (state == 1) {
        clearDisplay();
        state = 0;
    }
    document.getElementById('result').textContent += ")";
}

function clearDisplay(event) {
    document.getElementById('result').textContent = "";
}

prefixToPostfix = () => {
    let exp = document.getElementById('result').textContent;
    exp = exp.split("x").join("*");
    const operators = /[()+-/*]/
    const nums = /[0-9.]/
    const precedence = {
        "+": 25,
        "-": 25,
        "*": 50,
        "/": 50,
        "(": 0
    };
    let q = [];
    let s = [];
    exp = exp.split("");
    while (exp.length != 0) {
        const token = exp.shift();
        if (nums.test(token) == true) {
            let totalNum = token;
            while (nums.test(exp[0])) {
                totalNum += exp.shift();
            }
            q.push(parseFloat(totalNum));
        }
        else if (operators.test(token)) {
            if (token == "(") {
                s.push(token);
            }
            else if (token == ")") {
                while (s[s.length - 1] != "(") {
                    q.push(s.pop());
                }
                s.pop();
            }
            else {
                let temp = String(s[s.length - 1]);
                while (s.length != 0 && precedence.token < precedence.temp)
                    q.push(s.pop());
                s.push(token);
            }
        }
    }
    while (s.length != 0) {
        q.push(s.pop());
    }
    return q;
}

function showResult(event) {
    let tokens = prefixToPostfix();
    let s = []
    const operators = /[()+-/*]/
    const nums = /[0-9.]/
    while (tokens.length != 0) {
        if (nums.test(tokens[0])) {
            s.push(tokens.shift());
        }
        else {
            const op2 = s.pop();
            const op1 = s.pop();
            const operator = tokens.shift();
            if (operator == "+") {
                s.push(op1 + op2);
            }
            else if (operator == "-") {
                s.push(op1 - op2);
            }
            else if (operator == "*") {
                s.push(op1 * op2);
            }
            else {
                s.push(op1 / op2);
            }
        }
    }
    const result = s.pop();
    document.getElementById('result').textContent = '';
    document.getElementById('result').textContent = result;
    state = 1;
}
