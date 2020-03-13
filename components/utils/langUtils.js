// Number unicode keycode
let engToNep = {
	0: '\u0966', // 0 -> ०
	1: '\u0967', // 1 -> १
	2: '\u0968', // 2 -> २
	3: '\u0969', // 3 -> ३
	4: '\u096A', // 4 -> ४
	5: '\u096B', // 5 -> ५
	6: '\u096C', // 6 -> ६
	7: '\u096D', // 7 -> ७
	8: '\u096E', // 8 -> ८
	9: '\u096F', // 9 -> ९
};

export const translateDate = value => {
	const funcname = getInputType();

	if (funcname === 'en') {
		return value;
	}

	let retValue = '';
	if (value) {
		if (/[0-9]/.test(value)) {
			for (let c of value) {
				let conv_char = engToNep[c];
				retValue += conv_char || c;
			}
		}
	}
	return retValue;
};
