function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
	let left = 0, right = 0;
	[...expr].forEach(el => el === '(' ? left++ : el === ')' ? right++ : '');
	if (left != right || !!~expr.indexOf('}') || !!~expr.indexOf('{')) throw new Error('ExpressionError: Brackets must be paired');
	if (!!~expr.indexOf('/ 0')) throw new TypeError('TypeError: Division by zero.');

  const calculator = expr => {

    const priority = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2
    };
  
    const math = {
      '/': (x, y) => x / y,
      '*': (x, y) => x * y,
      '-': (x, y) => x - y,
      '+': (x, y) => +x + +y
    };
  
    const splitExpr = expr.trim().split(/\s+/);
    const values = [];
    const operators = [];
    const isNumber = d => !isNaN(d);
    const getOperator = (shift = 0) => {
      const len = operators.length - 1;
      return operators[len - shift];
    }
    const calculate = () => {
      const x = values.pop();
      const y = values.pop();
      const op = operators.pop();
      values.push(math[op](y, x));
    };
    const restCalc = () => {
      if (priority[getOperator()] > priority[getOperator(1)]) {
        calculate();
      }

      while (operators.length) {
        const x = values.shift();
        const y = values.shift();
        const op = operators.shift();
        values.unshift(math[op](x, y));
      }
    };
  
    const getValue = (nums, ops) => {
      const exp = [];
      nums.map((el, i) => ops[i] ? exp.push(...[el, ops[i]]) : exp.push(el));
      return calculator(exp.join(' '));
    };
  
    let lengthExpr = splitExpr.length;
    
    splitExpr.map(el => {
      
      lengthExpr--;

      if (el === ")") {
        if (priority[getOperator()] > priority[getOperator(1)]) {
          calculate();
        }
        const shiftArr = operators.join('').replace(/\((?=\()/g, '');
        const idx = shiftArr.length - shiftArr.lastIndexOf('(');
        const idxOp = operators.lastIndexOf('(');
        const ex = values.splice(-idx);
        const ops = operators.splice(idxOp + 1);
        operators.pop();
        const value = getValue(ex, ops);
        values.push(value);
        return;
      }
      
      if (isNumber(el)) {
        values.push(el);
      } else {
        if (priority[el] && getOperator(1) === '-' && priority[el] === priority[getOperator()] && el !== '*' && el !== '/') {
          const x = values.splice(-2, 1);
          const y = values.splice(-2, 1);
          const op = operators.splice(-2, 1);
          const val = math[op](y, x);
          values.splice(-1, 0, val);
        }
        if (priority[el] <= priority[getOperator()]) {
          calculate();
        }
        operators.push(el);
      }
  
      if (lengthExpr === 0) restCalc();
    });
  
    return values.length === 1 ? values[0] : [values, operators];
  }
  const string =  expr.length === 3 ? expr.split('').join(' ') : expr;
  let result = calculator(string);
  
  if (Array.isArray(result)) {
    const exp = [];
    const nums = result[0];
    const ops = result[1];

    nums.map((el, i) => ops[i] ? exp.push(...[el, ops[i]]) : exp.push(el));
    result = calculator(exp.join(' '));
  }

  return result;
}

module.exports = {
    expressionCalculator
}
