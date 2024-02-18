const label = document.getElementById("label");

/**
* Removes the last character from the label.
*/
function delChar(){
    label.textContent = label.textContent.slice(0,label.textContent.length-1);
}

/**
 * Clears all values from the label.
 */
function resetLabel(){ 
    label.textContent = "";
}

/**
 * Adds a character to the label at the end. 
 * @param {string} character A string to add to the label.
 */
function addChar(character){
    label.textContent += character;
}

/**
 * Splits up the string of the label into different subequations based on the position of the parenthesis and updates it with the result if possible or with a message displaying wether the syntax was invalid.
 */
function parseEquation(){
    if (isEquationValid()){    
        let result = label.textContent.replaceAll(',','.').split(/(\([^\(\)]*\))/g).map(calculateThird);
        while (result.length>1){
            let newEquation = `${result.map((element) => `${element}`).join('')}`
            result = newEquation.split(/(\([^\(\)]*\))/g).map(calculateThird);
        }
        result = calculateSecond(result[0])
        label.textContent = result.toString().replaceAll('.',',')
    }
    else{
        label.textContent = "Invalid Syntax";
    }
}

/**
 * Removes the parenthesis from the equation and calculate its value if it starts and ends with parentheses. Otherwise returns the equations as is.
 * @param {*} equation an equation to solve.
 * @returns the result of the equation or the equation if it did not start and end with parentheses.
 */
function calculateThird(equation){
    if (equation.startsWith("(") && equation.endsWith(")")){
        return calculateSecond(equation.slice(1,equation.length-1))
    }else{
        return equation
    }
}

/**
 * Splits the equation into an array, using the minus and plus sign to split it. If the minus is preceded by a multiplication or division sign, it is ignored. Afterwards, it solves the addition and subtraction of the equation and returns the result.
 * @param {*} equation an equation to solve.
 * @returns the result of the equation or the same string received if it is not an addition or subtraction.
 */
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

/**
 * Splits the equation into an array using the multiplication and division sign to split it and returns the result of the mentioned opperations. It also includes the minus sign if it is preceded by either of the signs mentioned before.
 * @param {*} equation an equation to solve.
 * @returns the result of the equation or the same string received if it is not a multiplication or division.
 */
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

/**
 * Reads the display tag and returns true or false if the number of open/close parentheses match and if it does not include any combinations of symbols that this calculator can not interpret correctly.
 * @returns true if the equation can be calculated, false if the syntax can not be interpreted.
 */
function isEquationValid(){
    let openParenthesis = label.textContent.match(/\(/g)
    let closeParenthesis = label.textContent.match(/\)/g)
    openParenthesis === null ? openParenthesis = 0 : openParenthesis = openParenthesis.length
    closeParenthesis === null ? closeParenthesis = 0 : closeParenthesis = closeParenthesis.length
    if (openParenthesis !== closeParenthesis)
        return false
    if (label.textContent.match(/(?<=[-/*+(])\*|(?<=[-+])-|(?<=[-/*+(])\/|(?<=[-/*+(])\+|(?<=\d)\(|(?<=[-/*+(])\)|,,|,\d,/g)){
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