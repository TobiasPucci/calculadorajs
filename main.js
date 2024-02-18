const label = document.getElementById("label");

function delChar(){
    label.textContent = label.textContent.slice(0,label.textContent.length-1);
}

function resetLabel(){
    label.textContent = "";
}

function addChar(character){
    label.textContent += character;
}

function parseEquation(){
    if (isEquationValid()){    
        let result = label.textContent.replace(',','.').split(/(\([^\(\)]*\))/g).map(calculateThird);
        while (result.length>1){
            let newEquation = `${result.map((element) => `${element}`).join('')}`
            result = newEquation.split(/(\([^\(\)]*\))/g).map(calculateThird);
        }
        result = calculateSecond(result[0])
        console.log("Inicio:", label.textContent.replace(',','.').split(/(\([^\(\)]*\))/g),"Final:", result);
        label.textContent = result.toString().replace('.',',')
    }
    else{
        label.textContent = "Invalid Syntax";
    }
}

function calculateThird(equation){
    if (equation.startsWith("(") && equation.endsWith(")")){
        return calculateSecond(equation.slice(1,equation.length-1))
    }else{
        return equation
    }
}

function calculateSecond(equation){
    let result = equation.split((/((?<![/*])-|\+)/)).map(calculateFirst)
    while (result.length>1){
        result[0] === '' ? result[0] = 0 : result;
        result[2] === '' ? result[2] = 0 : result;
        result[1] === "+" ? result[2] = parseFloat(result[0])+parseFloat(result[2]) : result[2] = parseFloat(result[0])-parseFloat(result[2])
        result = result.slice(2,result.length)
    }
    return result[0]
}

function calculateFirst(equation){
    let result = equation.split(/([*/]|\*-|\/-)/)
    while (result.length>1){
        result[0] === '' ? result[0] = 1 : result;
        result[2] === '' ? result[2] = 1 : result;
        result[1] === "*" ? result[2] = parseFloat(result[0])*parseFloat(result[2]) : result[2] = parseFloat(result[0])/parseFloat(result[2])
        result = result.slice(2,result.length)
    }
    return result[0]
}

function isEquationValid(){
    let openParenthesis = label.textContent.match(/\(/g)
    let closeParenthesis = label.textContent.match(/\)/g)
    openParenthesis === null ? openParenthesis = 0 : openParenthesis = openParenthesis.length
    closeParenthesis === null ? closeParenthesis = 0 : closeParenthesis = closeParenthesis.length
    if (openParenthesis !== closeParenthesis)
        return false
    if (label.textContent.match(/(?<=[-/*+(])\*|(?<=[-+])-|(?<=[-/*+(])\/|(?<=[-/*+(])\+|(?<=\d)\(|(?<=[-/*+(])\)/g)){
        return false;
    }
    return true;
}

onkeydown = (event) => {
    switch (event.key.toLowerCase()) {
        case ",":
        case ".":
            addChar(",");
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
        case "+":
        case "-":
        case "*":
        case "/":
        case "(":
        case ")":
            addChar(event.key);
            break;
        case "c":
            resetLabel();
            break;
        case "backspace":
            delChar();
            break;
        case "enter":
            parseEquation();
            break;
    }
}