let state = 0;
let screen = document.getElementById("screen");
let calc_body = document.getElementById("calc_body");
let cursor = document.getElementById("cursor");
let id = null;
let positionBuffer = []
let positionBufferIdx = 0

window.addEventListener('load', () => {
    screen.style.position = 'absolute';
    calc_body.style.position = 'absolute';
    cursor.style.position = 'absolute';
    screen.style.top = 6;
    screen.style.left = 600;
    calc_body.style.top = 150;
    calc_body.style.left = 600;
    cursor.style.top = 90;
    cursor.style.left = 615;

    blinkCursor();
    fillScreen();
    fillBody();

    var buttons2 = document.querySelectorAll('.display');
    buttons2.forEach((button) => { button.addEventListener('click', updateDisplay); })
    var enter1 = document.querySelectorAll('.enter');
    enter1.forEach((button) => { button.addEventListener('click', showResult) })
    var clearButton = document.querySelectorAll('.clear');
    clearButton.forEach((button) => { button.addEventListener('click', clearDisplay) });
    var leftarrow = document.querySelectorAll('.leftarrow');
    leftarrow.forEach((button) => { button.addEventListener('click', updateBuffer) });
    var rightarrow = document.querySelectorAll('.rightarrow');
    rightarrow.forEach((button) => { button.addEventListener('click', updateBuffer) });
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

function updateBuffer(event) {
    if ($(event.target).hasClass("display") || $(event.target).hasClass("enter")) {
        const newPosition = document.getElementById("result").offsetWidth + 620 + 'px';
        cursor.style.left = newPosition;
        positionBuffer.push(newPosition);
        positionBufferIdx++;
    }
    else if ($(event.target).hasClass("clear")) {
        cursor.style.left = 620 + 'px';
        positionBuffer = [620];
        positionBufferIdx = 0;
    }
    else if ($(event.target).hasClass("leftarrow")) {
        if (positionBufferIdx >= 0) {
            cursor.style.left = positionBuffer[positionBufferIdx--];
        }
    }
    else if ($(event.target).hasClass("rightarrow")) {
        if (positionBufferIdx < positionBuffer.length - 1) {
            cursor.style.left = positionBuffer[++positionBufferIdx]
        }
    }
}

function updateDisplay(event) {
    let txt = event.currentTarget.innerText;
    if (state == 1) {
        clearDisplay(event);
        state = 0;
    }
    document.getElementById('result').textContent += txt;
    updateBuffer(event);
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
    updateBuffer(event);
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
            q.push(parseInt(totalNum));
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
    updateBuffer(event);
    state = 1;
}
