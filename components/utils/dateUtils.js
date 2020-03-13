import { translateDate } from './langUtils';
import { Months } from './Options';

var nepali = require('nepali-calendar-js');

export const getCurrentDate = (setLang = false) => {
	const today = new Date();
	const dd = today.getDate();
	const mm = today.getMonth() + 1; //January is 0!
	const yyyy = today.getFullYear();

	const nepaliDate = nepali.toNepali(parseInt(yyyy), parseInt(mm), parseInt(dd));

	if (setLang) {
		return translateDate(`${String(Months(nepaliDate.nm)).padStart(2, '0')} ${String(nepaliDate.nd).padStart(2, '0')},${nepaliDate.ny}`);
	} else {
		return `${String(Months(nepaliDate.nm)).padStart(2, '0')} ${String(nepaliDate.nd).padStart(2, '0')}, ${nepaliDate.ny}`;
	}
};
