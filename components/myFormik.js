import React, { Component } from 'react';
import { Formik } from 'formik';
import { post, put, get } from './services/api';
import { View, AsyncStorage } from 'react-native';

const axios = require('axios');

export class MyFormik extends Component {
	successLogin = async user => {
		if (user) {
			await AsyncStorage.setItem('user', JSON.stringify(user));
		}
	};

	per = value => {
		return value / 100;
	};
	render() {
		let initial = {};
		return (
			<Formik
				initialValues={{...this.props.initial,...initial}}
				enableReinitialize={true}
				validationSchema={this.props.validation}
				onSubmit={(values, actions) => {
					
					console.log('called')
					

					if (this.props.process) {
						//level1
						console.log('eta', this.props.model, values);
						let process1 = { model: this.props.model };
						values = Object.keys(values)
							.filter(each => each != 'model')
							.map(each => ({ [each]: Number(values[each]) }));
						values.forEach(each => {
							Object.assign(process1, each);
						});

						//level2

						let {
							exRate,
							customDuty,
							exciseDuty,
							vat,
							roadTax,
							insurance,
							credit,
							interestInvest,
							adminSales,
							advProm,
							dealer,
							distributor,
							vat2,
							inr,
							customCFC,
							register,
							pdi,
							transit,
							service,
							lc,
							warrenty,
							IndcustomC,
							stockTrans,
							stockYard,
							financeCom,
							staff,
						} = process1;

						process1.npr = inr * exRate;
						process1.boarder = process1.npr;
						process1.customDutyV = process1.boarder * this.per(customDuty);
						process1.exciseDutyV = (process1.boarder + process1.customDutyV + customCFC) * this.per(exciseDuty);
						process1.vatV = (process1.boarder + process1.customDutyV + customCFC + process1.exciseDutyV) * this.per(vat);
						process1.boarderInPrice = process1.boarder + process1.customDutyV + customCFC + process1.exciseDutyV + process1.vatV;
						process1.roadTaxV = process1.boarderInPrice * this.per(roadTax);
						process1.insuranceV = (process1.boarderInPrice + process1.roadTaxV) * this.per(insurance);
						let cal = process1.boarderInPrice + process1.roadTaxV + process1.insuranceV + register + pdi + transit + lc + service + warrenty + IndcustomC + stockTrans + stockYard + financeCom;
						process1.interestInvestV = ((cal * this.per(credit)) / 12) * interestInvest;
						process1.costTillDealer = cal + process1.interestInvestV;
						process1.adminSalesV = process1.costTillDealer * this.per(adminSales);
						process1.advPromV = process1.costTillDealer * this.per(advProm);
						process1.totalLandingCost = process1.costTillDealer + process1.adminSalesV + process1.advPromV + staff;
						process1.distributorV = process1.totalLandingCost * this.per(distributor);
						process1.dealerV = process1.totalLandingCost * this.per(dealer);
						process1.priceBeforeVat = process1.totalLandingCost + process1.distributorV + process1.dealerV - process1.vatV;
						process1.vat2V = process1.priceBeforeVat * this.per(vat2);
						process1.suitableMRP = process1.vat2V + process1.priceBeforeVat;
						process1.overhead = process1.adminSalesV + process1.advPromV + process1.distributorV + process1.dealerV;
						process1.withoutOverhead = process1.distributorV + process1.dealerV;
						process1.interestMonth = process1.interestInvest;
						process1.discussedMRP = process1.suitableMRP;
						process1.tier1 = process1.overhead;
						process1.tier2 = process1.withoutOverhead;
						process1.final = process1.tier2 * 53;

						let process2 = { model: process1.model };
						values = Object.keys(process1)
							.filter(each => each != 'model')
							.map(each => ({ [each]: process1[each].toFixed(2) }));
						values.forEach(each => {
							Object.assign(process2, each);
						});

						values = { ...process2 };
					}
					

					post(this.props.Burl, values, this.props.Furl, this.props.history, this.successLogin, this.props.reload, this.props.navigation, actions, this.props.onSuccess, this.props.onError);
				}}
			>
				{props => <View onSubmit={props.handleSubmit}>{this.props.children({ ...props, ...this.state })}</View>}
			</Formik>
		);
	}
}

export default MyFormik;
