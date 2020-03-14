const per = value => {
	return value / 100;
};

export const calcMain = (process1, name, val) => {
	let inr, discountcredit;
	inr = name === 'discountcredit' ? process1.inr : Number(val);
	discountcredit = name === 'discountcredit' ? Number(val) : process1.discountcredit;
	//required for next calculation
	process1.discountcredit = name === 'discountcredit' ? Number(val) : process1.discountcredit;
	
	let process = Object.keys(process1).map(each => ({ [each]: Number(process1[each]) }));

	process1 = {};
	process.forEach(each => {
		Object.assign(process1, each);
	});

	process1.npr = inr * process1.exRate;
	process1.boarder = process1.npr;
	process1.customDutyV = process1.boarder * per(process1.customDuty);
	process1.exciseDutyV = (process1.boarder + process1.customDutyV + process1.customCFC) * per(process1.exciseDuty);
	process1.vatV = (process1.boarder + process1.customDutyV + process1.customCFC + process1.exciseDutyV) * per(process1.vat);
	process1.boarderInPrice = process1.boarder + process1.customDutyV + process1.customCFC + process1.exciseDutyV + process1.vatV;
	process1.roadTaxV = process1.boarderInPrice * per(process1.roadTax);
	process1.insuranceV = (process1.boarderInPrice + process1.roadTaxV) * per(process1.insurance);
	let cal =
		process1.boarderInPrice +
		process1.roadTaxV +
		process1.insuranceV +
		process1.register +
		process1.pdi +
		process1.transit +
		process1.lc +
		process1.service +
		process1.warrenty +
		process1.IndcustomC +
		process1.stockTrans +
		process1.stockYard +
		process1.financeCom;
	process1.interestInvestV = ((cal * per(process1.interestInvest)) / 12) * process1.credit;
	//calculating discount interest
	process1.discountinterest= ((cal * per(process1.interestInvest)) / 12) * discountcredit;
	process1.costTillDealer = cal + process1.interestInvestV;
	process1.adminSalesV = process1.costTillDealer * per(process1.adminSales);
	process1.advPromV = process1.costTillDealer * per(process1.advProm);
	process1.totalLandingCost = process1.costTillDealer + process1.adminSalesV + process1.advPromV + process1.staff;
	process1.distributorV = process1.totalLandingCost * per(process1.distributor);
	process1.dealerV = process1.totalLandingCost * per(process1.dealer);
	process1.priceBeforeVat = process1.totalLandingCost + process1.distributorV + process1.dealerV - process1.vatV;
	process1.vat2V = process1.priceBeforeVat * per(process1.vat2);
	process1.suitableMRP = process1.vat2V + process1.priceBeforeVat;
	process1.overhead = process1.adminSalesV + process1.advPromV + process1.distributorV + process1.dealerV;
	process1.withoutOverhead = process1.distributorV + process1.dealerV;
	process1.discussedMRP = process1.suitableMRP;
	process1.tier1 = process1.overhead;
	process1.tier2 = process1.withoutOverhead;
	return process1;
};
