const buttons = document.querySelectorAll(".mybuttons")
const display = document.getElementById("display")
const hide = ['=', '←', 'xy', "AC"]
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "00"]
const operands = ["+", "-", "*", "/", "sin", "cos", "tan", "xy", "√"]

var terms = []
var whatToDo = []
let solved = 0
let operand = false
let isFinished = false
let memory = 0
var text = ""

function eventclick(event) {
    if (numbers.includes(text)) {
        if (isFinished) {
            terms = []
            isFinished = false
        }
        if (terms.length === 0 || operand === true) {
            let val = (text === ".") ? "0." : text;
            terms.push(val)
            operand = false
        } else {
            if (text === "." && terms[terms.length - 1].includes(".")) return;
            terms[terms.length - 1] = terms[terms.length - 1] + text
        }
        display.value = terms[terms.length - 1]
    }
    if (operands.includes(text)) {
        if (isFinished) {
            terms = [solved]
            isFinished = false
        }

        if (['sin', 'cos', 'tan', "√"].includes(text)) {
            whatToDo.push(text)
            operand = true
            display.value = text
        } else if (terms.length > 0) {
            if (operand === true) {
                whatToDo[whatToDo.length - 1] = text
            } else {
                whatToDo.push(text)
                operand = true
            }
        }
    }
    if (text === '←') {
        if (isFinished) { display.value = ""; terms = []; isFinished = false; return; }
        if (operand === true) {
            whatToDo.pop()
            operand = false
        } else if (terms.length > 0) {
            let lastTerm = terms[terms.length - 1].toString()
            if (lastTerm.length > 1 && lastTerm !== Math.PI.toString() && lastTerm !== Math.E.toString()) {
                terms[terms.length - 1] = lastTerm.slice(0, -1)
            } else {
                terms.pop()
                if (whatToDo.length > 0) operand = true
            }
        }
        display.value = terms.length > 0 ? terms[terms.length - 1] : ""
    }
    if (text === '=') {
        if (whatToDo.length === 0 && terms.length <= 1) {
        display.value = "0";
        solved = 0;
        return;
        }
        for (let i = 0; i < whatToDo.length; i++) {
            let currentOp = whatToDo[i]
            if (['sin', 'cos', 'tan', "√"].includes(currentOp)) {
                let val = Number(terms.shift())
                if (currentOp === '√') {
                    solved = Math.sqrt(val)
                } else {
                    let rad = val * (Math.PI / 180)
                    if (currentOp === 'sin') solved = Math.sin(rad)
                    if (currentOp === 'cos') solved = Math.cos(rad)
                    if (currentOp === 'tan') solved = Math.tan(rad)
                }
                terms.unshift(solved)
            } else {
                let n1 = Number(terms.shift())
                let n2 = Number(terms.shift())
                if (currentOp === '+') solved = n1 + n2
                if (currentOp === '-') solved = n1 - n2
                if (currentOp === '*') solved = n1 * n2
                if (currentOp === '/') solved = n1 / n2
                if (currentOp === 'xy') solved = Math.pow(n1, n2)
                terms.unshift(solved)
            }
        }
        display.value = Number(parseFloat(solved).toFixed(8))
        whatToDo = []
        operand = false
        isFinished = true
    }
    if (text === 'AC') {
        terms = [];
        whatToDo = [];
        operand = false;
        isFinished = false;
        display.value = ""
        solved = 0
    }
    if (text === 'Ans' || text === 'π' || text === 'e') {
        if (isFinished) { terms = []; isFinished = false; }

        if (text === 'Ans') { display.value = solved; terms.push(solved); }
        if (text === 'π') { display.value = "π"; terms.push(Math.PI); }
        if (text === 'e') { display.value = "e"; terms.push(Math.E); }
        operand = true
    }
    if (text === 'M+') {
        memory += Number(display.value) || 0;
        console.log("Memory Stored:", memory);
        isFinished = true;
    }
    if (text === 'MR') {
        if (isFinished) { terms = []; isFinished = false; }
        terms.push(memory);
        display.value = memory;
        operand = false;
    }
    if (text === 'MC') {
        memory = 0
        display.value = null
    }

}

buttons.forEach(button => button.addEventListener('mousedown', e => {
    text = e.target.textContent
    eventclick()
}));
buttons.forEach(button => button.addEventListener('keypress', (e) => {
    if (numbers.includes(e.key)) {
        text = e.key
    } else if (e.key === 'Enter') {
        text = "="
    } else if (e.key === 'Backspace') {
        text = "←"
    } else if (operands.includes(e.key)) {
        text = e.key
    } else if (e.key === 'e') {
        text = e.key
    }
    eventclick()
}));
