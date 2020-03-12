import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity } from 'react-native';

import { Toast, Icon } from 'native-base';
import { generateJSX } from '../components/utils/Views';
import { dropdownFormat } from '../components/utils/generals';
import { modelCollection, parameter } from '../components/utils/config';
import MyFormik from '../components/myFormik';
import ModelDropdown from './Setup/modelDropdown';
import { getModel } from '../components/services/addModelService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { bURL } from '../components/app-config';
import MyModel from '../components/utils/MyModel';
import { get } from '../components/services/api';

class ViewScreen extends Component {
	static navigationOptions = () => ({
		headerShown: false,
	});
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			detailModal: false,
			busName: '',
			modelData: null,
			errors: {},
			discussedMRP: 0,
			suitableMRP: 0,
			Impact: 0,
			discount: 0,
			tier1val: 0,
			tier2val: 0,
			originalValues: {},
			GeneralData: null,
			loading: true,
			role: '',
			Burl: `${bURL}api/vehiclemodel`,
		};
	}

	setStateFromOtherFile = (option, value) => {
		this.setState({ [option]: value });
	};

	async componentDidMount() {
		try {
			const { data: modelData } = await getModel();
			const value = await AsyncStorage.getItem('user');
			if (value != null) {
				this.setState({ Role: JSON.parse(value).role, modelData: modelData.data, loading: false });
			}
		} catch (err) {
			this.setState({ errors: err });
			Toast.show({
				text: 'Error',
				position: 'bottom',
				duration: 3000,
				type: 'danger',
			});
		}
	}

	onModalClick = () => {
		this.setState(prevState => ({ modalVisible: !prevState.modalVisible }));
	};

	onDetailModal = () => {
		this.setState(prevState => ({ detailModal: !prevState.detailModal }));
	};

	handleDiscount = val => {
		const { suitableMRP, discussedMRP, tier1val, tier2val } = this.state.originalValues;

		let newFinal;
		let Impact;
		let tier1;
		let tier2;

		if (val) {
			newFinal = Number(suitableMRP) - Number(val);
			Impact = Number(newFinal) - Number(suitableMRP);
			tier1 = Number(tier1val) + Number(Impact);
			tier2 = Number(tier2val) + Number(Impact);
		} else {
			newFinal = Number(discussedMRP);
			Impact = 0;
			tier1 = Number(tier1val);
			tier2 = Number(tier2val);
		}
		this.setState({
			discussedMRP: newFinal.toFixed(2).toString(),
			discount: val.toString(),
			Impact: Impact.toFixed(2),
			tier1val: tier1.toFixed(2),
			tier2val: tier2.toFixed(2),
		});
	};

	handleDiscussed = val => {
		const { suitableMRP, discussedMRP, tier1val, tier2val } = this.state.originalValues;

		let newFinal;
		let Impact;
		let tier1;
		let tier2;
		let discussed;

		if (val) {
			newFinal = Number(suitableMRP) - val;
			Impact = Number(val) - Number(suitableMRP);
			tier1 = Number(tier1val) + Number(Impact);
			tier2 = Number(tier2val) + Number(Impact);
			discussed = val;
		} else {
			newFinal = 0;
			Impact = 0;
			tier1 = Number(tier1val);
			tier2 = Number(tier2val);
			discussed = Number(discussedMRP);
		}
		this.setState({
			discussedMRP: val.toString(),
			discount: newFinal.toFixed(2).toString(),
			Impact: ImpacttoFixed(2),
			tier1val: tier1toFixed(2),
			tier2val: tier2toFixed(2),
		});
	};

	valueSelected = async val => {
		const { Burl } = this.state;
		let Url = `${Burl}/${val}`;
		// this.setState({ loading: true });
		// this.setState({ modalVisible: false });
		this.setState({ optionVal: val, mainloading: true, modalVisible: false });

		const { data: generalData } = await get(Url);

		let tier1val = generalData && generalData['overhead'];
		let tier2val = generalData && generalData['withoutOverhead'];
		let suitableMRP = generalData && generalData['suitableMRP'];
		let discussedMRP = generalData && generalData['suitableMRP'];

		this.setState({
			generalData,
			busName: val,
			modalVisible: false,
			loading: false,
			suitableMRP,
			discussedMRP,
			tier1val,
			tier2val,
			originalValues: {
				tier1val,
				tier2val,
				suitableMRP,
				discussedMRP,
			},
		});
	};

	onModalClick = () => {
		this.setState(prevState => ({ modalVisible: !prevState.modalVisible }));
	};

	render() {
		const { discussedMRP, discount, Impact, tier1val, tier2val, role, modelData, loading, mainloading } = this.state;

		return (
			<View style={styles.screen}>
				{loading ? (
					<View style={styles.mainscreen}>
						<ActivityIndicator size={40} color={'#0c4ca3'} />
					</View>
				) : (
					<>
						{mainloading ? (
							<View style={styles.mainscreen}>
								<ActivityIndicator size={40} color={'#0c4ca3'} />
							</View>
						) : generalData ? (
							<View>
								<View style={styles.table}>
									<View style={styles.thead}>
										<View style={styles.tr}>
											<Text style={styles.th}>Details</Text>
											<Text style={styles.th}>{this.state.busName || 'Model Name'}</Text>
										</View>
									</View>
									{r === 'admin' ? (
										<View style={styles.tbody}>
											{tablePatameter.map(m => (
												<View style={styles.tr} key={m.id}>
													<Text style={styles.td}>{m.name}</Text>
													<Text style={styles.td}>
														{m.id == 'tier1'
															? // NepaliCurrency(
															  //   tier1val
															  Math.sign(tier1val) == 1
																? tier1val
																: `(${Math.abs(tier1val)})`
															: // )
															m.id == 'tier2'
															? // NepaliCurrency(
															  //   tier2val
															  Math.sign(tier2val) == 1
																? tier2val
																: `(${Math.abs(tier2val)})`
															: // )
															  NepaliCurrency(generalData[m.id])}
													</Text>
												</View>
											))}

											<View style={styles.tr}>
												<Text style={styles.td}>IMPACT (Positive/Negative)</Text>
												<Text style={styles.td}>{Math.sign(Impact) == 1 ? Impact : `(${Math.abs(Impact)})` || Impact}</Text>
											</View>
											<View style={styles.tr}>
												<Text
													style={{
														...styles.td,
														fontWeight: 'bold',
													}}
												>
													Discussed MRP
												</Text>

												<View
													style={{
														...styles.td,
														paddingBottom: 0,
														paddingTop: 4,
													}}
												>
													<TextInput
														name={'final'}
														style={styles.input}
														value={discussedMRP || ''}
														keyboardType="numeric"
														onChangeText={text => {
															this.handleDiscussed(text);
														}}
													/>
												</View>
											</View>
											<View style={styles.tr}>
												<Text
													style={{
														...styles.td,
														fontWeight: 'bold',
													}}
												>
													Discount
												</Text>
												<View
													style={{
														...styles.td,
														paddingBottom: 0,
														paddingTop: 4,
													}}
												>
													<TextInput
														name={'discount'}
														style={styles.input}
														// value={NepaliCurrency(discount) || 0}
														value={discount || ''}
														keyboardType="numeric"
														onChangeText={text => {
															this.handleDiscount(text);
														}}
													/>
												</View>
											</View>
										</View>
									) : (
										<View style={styles.tbody}>
											<View style={styles.tr}>
												<Text style={styles.td}>Invoice value in INR</Text>
												<Text style={styles.td}>{generalData['inr']}</Text>
											</View>
											<View style={styles.tr}>
												<Text style={styles.td}>Value in NPR</Text>
												<Text style={styles.td}>{generalData['exRate']}</Text>
											</View>
											<View style={styles.tr}>
												<Text style={styles.td}>TIER 2 (NP)</Text>
												<Text style={styles.td}>{generalData['tier2']}</Text>
											</View>
										</View>
									)}
								</View>
								{role === 'admin' && (
									<TouchableHighlight
										style={styles.th1}
										onPress={() => {
											this.onDetailModal();
										}}
									>
										<Text style={styles.modalButton}>More Details</Text>
									</TouchableHighlight>
								)}
							</View>
						) : (
							<View style={styles.NoDataStyle}>
								<Icon style={{ fontSize: 100 }} name="gauge-empty" type="MaterialCommunityIcons" />
								<Text style={styles.not_available_text}>Data Not Available! Please Select Another Model</Text>
							</View>
						)}

						{modelData && (
							<View style={styles.modelSelect}>
								<TouchableOpacity onPress={this.onModalClick}>
									<Text style={styles.modalButton}>Select Model</Text>
								</TouchableOpacity>
								<MyModel onSelected={this.valueSelected} modelData={modelData} modalVisible={this.state.modalVisible} onModelClick={this.onModalClick} />
							</View>
						)}
					</>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		margin: 10,
		padding: 5,
	},
	mainscreen: {
		flex: 1,
		paddingBottom: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},

	title: {
		fontSize: 18,
		paddingBottom: 5,
		fontWeight: '700',
		letterSpacing: 0.5,
		color: '#0c4ca3',
	},

	not_available_text: {
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		margin: 20,
		fontSize: 16,
		fontWeight: '700',
	},
	modalButton: {
		backgroundColor: '#1D4CBC',
		color: '#fff',
		textAlign: 'center',
		padding: 16,
		justifyContent: 'center',
		alignItems: 'center',
		letterSpacing: 1,
		fontWeight: 'bold',
		borderRadius: 30,
		fontFamily: 'NotoSerif',
	},
	NoDataStyle: {
		flex: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modelSelect: {
		position: 'absolute',
		bottom: 10,
		left: '10%',
		width: '80%',
	},

	formikStyle: {
		flex: 4,
		marginBottom: 60,
	},
});

export default ViewScreen;
