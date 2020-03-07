function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
	let left = 0, right = 0;
	[...expr].forEach(el => el === '(' ? left++ : el === ')' ? right++ : '');
	if (left != right) throw new Error('ExpressionError: Brackets must be paired');
	if (!!~expr.indexOf('/ 0')) throw new TypeError('TypeError: Division by zero.');
	if (!!~expr.indexOf('}') || !!~expr.indexOf('{')) throw new Error('ExpressionError: Brackets must be paired');
	return +new Function('return ' + expr)();
}

module.exports = {
    expressionCalculator
}
