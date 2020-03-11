import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableHighlight, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Input, Spinner, Icon, Toast, Label } from 'native-base';
import { Platform, AsyncStorage } from 'react-native';
import { parameter, modelCollection, tablePatameter, parameterDetail } from '../components/utils/config';
import { get } from '../components/services/api';
import { CleaveCurrency, NepaliCurrency } from '../components/utils/NepaliCurrency';
import { bURL } from '../components/app-config';
import { getModel } from '../components/services/addModelService';
import MyModel from '../components/utils/MyModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';

class General extends Component {
	static navigationOptions = () => ({
		headerTitle: 'Search',
	});
	state = {
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
		generalData: null,
		loading: true,
		role: '',
		selectedVal: '',
		Burl: `${bURL}api/vehiclemodel`,
	};

	async componentDidMount() {
		try {
			const { data: modelData } = await getModel();
			const value = await AsyncStorage.getItem('user');
			if (value != null) {
				this.setState({ role: JSON.parse(value).role, modelData: modelData.data, loading: false });
			}
		} catch (err) {
			this.setState({ errors: err });
			Toast.show({
				text: 'Error',
				buttonText: 'Okay',
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

	onSelected = async val => {
		const { Burl } = this.state;
		let Url = `${Burl}/${val}`;
		this.setState({ loading: true });
		this.setState({ modalVisible: false });
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
			Impact: Impact.toFixed(2),
			tier1val: tier1.toFixed(2),
			tier2val: tier2.toFixed(2),
		});
	};

	render() {
		const { generalData, discussedMRP, discount, Impact, tier1val, tier2val, role, modelData, loading } = this.state;

		return (
			<View style={{ flex: 1 }}>
				{loading ? (
					<View style={styles.mainscreen}>
						<ActivityIndicator size={40} color={'#0c4ca3'} />
					</View>
				) : (
					<>
						{generalData ? (
							<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={170}>
								<ScrollView>
									<View style={{ flex: 1, paddingTop: 5 }}>
										<Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#1D4CBC', fontSize: 16, paddingVertical: 20 }}>{this.state.busName || 'Model Name'}</Text>
										<View style={styles.table}>
											<View style={styles.thead}>
												<View style={styles.tr}>
													<Text style={styles.th}>Details</Text>
													<Text style={styles.th}>Amount</Text>
												</View>
											</View>
											{role === 'admin' ? (
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
																textAlign: 'right',
															}}
														>
															Discussed MRP :
														</Text>
														<View
															style={{
																...styles.td,
																paddingBottom: 0,
																borderBottomWidth: 2,
																borderBottomColor: '#000',
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
																textAlign: 'right',
															}}
														>
															Discount :
														</Text>
														<View
															style={{
																...styles.td,
																paddingBottom: 0,
																paddingTop: 4,
																borderBottomWidth: 2,
																borderBottomColor: '#000',
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
									</View>
								</ScrollView>
								{role === 'admin' && (
									<View style={{ backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -20, left: 10, height: 70, width: 70, borderRadius: 70 }}>
										{/* <Icon type="Octicons" onPress={this.onDetailModal} name="file-code" style={{ color: 'white' }} /> */}
										<MaterialCommunityIcons name="file-document-box-multiple" color="white" onPress={this.onDetailModal} size={35} />
									</View>
								)}
							</KeyboardAvoidingView>
						) : (
							<View style={styles.NoDataStyle}>
								<Icon style={{ fontSize: 100 }} name="gauge-empty" type="MaterialCommunityIcons" />
								<Text style={styles.not_available_text}>Data Not Available! Please Select Another Model</Text>
							</View>
						)}

						{/* <View style={styles.container}> */}

						<View style={styles.modelSelect}>
							<TouchableOpacity onPress={this.onModalClick}>
								<Text style={styles.modalButton}>Select Model</Text>
							</TouchableOpacity>
							<MyModel onSelected={this.onSelected} modelData={modelData && this.state.modelData} modalVisible={this.state.modalVisible} onModelClick={this.onModalClick} />
						</View>

						{role === 'admin' && (
							<Modal
								animationType="slide"
								transparent={false}
								visible={this.state.detailModal}
								onRequestClose={() => {
									this.onDetailModal();
								}}
							>
								<View style={styles.detailmodalWrapper}>
									<ScrollView>
										<TouchableHighlight
											onPress={() => {
												this.onDetailModal();
											}}
										>
											<Text
												style={{
													...styles.modalButton,
													backgroundColor: 'red',
													width: '25%',
													marginBottom: 10,
													marginLeft: 10,
												}}
											>
												Close
											</Text>
										</TouchableHighlight>
										{generalData && (
											<View style={styles.table}>
												<View style={styles.thead}>
													<View style={styles.tr}>
														<Text
															style={{
																...styles.th,
																width: '33.33%',
																color: '#fff',
																backgroundColor: '#ffc000',
															}}
														>
															Details
														</Text>
														<Text
															style={{
																...styles.th,
																width: '33.33%',
																color: '#fff',
																backgroundColor: '#ffc000',
															}}
														>
															CUR / %
														</Text>
														<Text
															style={{
																...styles.th,
																width: '33.33%',
																color: '#fff',
																backgroundColor: '#00b0f0',
															}}
														>
															{this.state.busName || 'Model Name'}
														</Text>
													</View>
												</View>
												<View style={styles.tbody}>
													{parameterDetail.map(m => (
														<View style={styles.tr} key={m.id}>
															<Text
																style={{
																	...styles.td,
																	width: '33.33%',
																	backgroundColor:
																		m.id == 'service'
																			? '#ffff00'
																			: m.id == 'exRate'
																			? '#f2f2f2'
																			: m.id == 'boarderInPrice'
																			? '#f2f2f2'
																			: m.id == 'warrenty'
																			? '#ffff00'
																			: m.id == 'IndcustomC'
																			? '#ffff00'
																			: m.id == 'stockYard'
																			? '#ffff00'
																			: m.id == 'stockTrans'
																			? '#ffff00'
																			: m.id == 'interestInvestV'
																			? '#f7caac'
																			: m.id == 'priceBeforeVat'
																			? '#ffff00'
																			: m.id == 'suitableMRP'
																			? '#c5e0b3'
																			: m.id == 'overhead'
																			? '#ffc000'
																			: m.id == 'withoutOverhead'
																			? '#ffc000'
																			: m.id == 'credit'
																			? '#ffc000'
																			: m.id == 'costTillDealer'
																			? '#f2f2f2'
																			: m.id == 'totalLandingCost'
																			? '#f2f2f2'
																			: '',
																	fontWeight:
																		m.id == 'inr'
																			? '700'
																			: m.id == 'exRate'
																			? '700'
																			: m.id == 'boarderInPrice'
																			? '700'
																			: m.id == 'costTillDealer'
																			? '700'
																			: m.id == 'totalLandingCost'
																			? '700'
																			: m.id == 'priceBeforeVat'
																			? '700'
																			: m.id == 'overhead'
																			? '700'
																			: m.id == 'withoutOverhead'
																			? '700'
																			: m.id == 'credit'
																			? '700'
																			: '400',
																}}
															>
																{m.name}
															</Text>
															<Text
																style={{
																	...styles.td,
																	width: '33.33%',
																	backgroundColor:
																		m.id == 'service'
																			? '#ffff00'
																			: m.id == 'exRate'
																			? '#f2f2f2'
																			: m.id == 'boarderInPrice'
																			? '#f2f2f2'
																			: m.id == 'warrenty'
																			? '#ffff00'
																			: m.id == 'IndcustomC'
																			? '#ffff00'
																			: m.id == 'stockYard'
																			? '#ffff00'
																			: m.id == 'stockTrans'
																			? '#ffff00'
																			: m.id == 'interestInvestV'
																			? '#00b0f0'
																			: m.id == 'priceBeforeVat'
																			? '#ffff00'
																			: m.id == 'suitableMRP'
																			? '#c5e0b3'
																			: m.id == 'overhead'
																			? '#ffc000'
																			: m.id == 'withoutOverhead'
																			? '#ffc000'
																			: m.id == 'credit'
																			? '#ffc000'
																			: m.id == 'costTillDealer'
																			? '#f2f2f2'
																			: m.id == 'totalLandingCost'
																			? '#f2f2f2'
																			: '',
																	fontWeight:
																		m.id == 'inr'
																			? '700'
																			: m.id == 'exRate'
																			? '700'
																			: m.id == 'boarderInPrice'
																			? '700'
																			: m.id == 'costTillDealer'
																			? '700'
																			: m.id == 'totalLandingCost'
																			? '700'
																			: m.id == 'priceBeforeVat'
																			? '700'
																			: m.id == 'suitableMRP'
																			? '700'
																			: m.id == 'overhead'
																			? '700'
																			: m.id == 'withoutOverhead'
																			? '700'
																			: m.id == 'credit'
																			? '700'
																			: '400',
																}}
															>
																{generalData[`${m.id}V`] ? generalData[m.id] : m.id == 'exRate' ? generalData['exRate'] : ' '}
															</Text>
															<Text
																style={{
																	...styles.td,
																	width: '33.33%',
																	backgroundColor:
																		m.id == 'inr'
																			? '#00b0f0'
																			: m.id == 'exRate'
																			? '#f2f2f2'
																			: m.id == 'boarderInPrice'
																			? '#f2f2f2'
																			: m.id == 'service'
																			? '#ffff00'
																			: m.id == 'warrenty'
																			? '#ffff00'
																			: m.id == 'IndcustomC'
																			? '#ffff00'
																			: m.id == 'stockYard'
																			? '#ffff00'
																			: m.id == 'stockTrans'
																			? '#ffff00'
																			: m.id == 'interestInvestV'
																			? '#f7caac'
																			: m.id == 'priceBeforeVat'
																			? '#ffff00'
																			: m.id == 'suitableMRP'
																			? '#00b0f0'
																			: m.id == 'overhead'
																			? '#ffc000'
																			: m.id == 'withoutOverhead'
																			? '#ffc000'
																			: m.id == 'credit'
																			? '#ffc000'
																			: m.id == 'costTillDealer'
																			? '#f2f2f2'
																			: m.id == 'totalLandingCost'
																			? '#f2f2f2'
																			: '',
																	fontWeight:
																		m.id == 'inr'
																			? '700'
																			: m.id == 'exRate'
																			? '700'
																			: m.id == 'boarderInPrice'
																			? '700'
																			: m.id == 'costTillDealer'
																			? '700'
																			: m.id == 'totalLandingCost'
																			? '700'
																			: m.id == 'priceBeforeVat'
																			? '700'
																			: m.id == 'suitableMRP'
																			? '700'
																			: m.id == 'overhead'
																			? '700'
																			: m.id == 'withoutOverhead'
																			? '700'
																			: m.id == 'credit'
																			? '700'
																			: '400',
																	color: m.id == 'totalLandingCost' ? 'red' : m.id == 'priceBeforeVat' ? 'red' : '#000',
																}}
															>
																{generalData[`${m.id}V`] ? NepaliCurrency(generalData[`${m.id}V`]) : m.id == 'exRate' ? NepaliCurrency(generalData['npr']) : NepaliCurrency(generalData[m.id])}
															</Text>
														</View>
													))}
												</View>
											</View>
										)}
									</ScrollView>
								</View>
							</Modal>
						)}
						{/* </View> */}
					</>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mainscreen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5,
	},

	table: {
		marginHorizontal: 10,
		marginBottom: 10,
		borderLeftWidth: 0.5,
		borderLeftColor: '#666',
		borderTopWidth: 0.5,
		borderTopColor: '#666',
		borderRadius: 2,
	},
	thead: {
		textAlign: 'left',
	},
	tr: {
		flexDirection: 'row',
	},
	th: {
		fontWeight: 'bold',
		width: '50%',
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: '#666',
		borderRightWidth: 0.5,
		borderRightColor: '#666',
	},
	th1: {
		width: Dimensions.get('window').width - 20,
		margin: 10,
	},
	td: {
		textAlign: 'left',
		width: '50%',
		padding: 10,
		fontSize: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: '#666',
		borderRightWidth: 0.5,
		borderRightColor: '#666',
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
	modalWrapper: {
		paddingHorizontal: 20,
		marginTop: 20,
	},
	detailmodalWrapper: {
		marginTop: 20,
	},
	modalContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#000',
	},
	modalDetail: {
		paddingTop: 10,
		paddingBottom: 70,
	},
	modalDetailWrap: {
		paddingVertical: 25,
		paddingHorizontal: 2,
		borderBottomWidth: 0.5,
		borderBottomColor: '#666',
	},
	input: {
		margin: 0,
	},
	notAvailableText: {
		paddingVertical: 40,
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 15,
	},
	container: {
		// flex: 1,
		backgroundColor: '#fff',
	},

	modelSelect: {
		position: 'absolute',
		bottom: 10,
		left: '10%',
		width: '80%',
	},
	NoDataStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	not_available_text: {
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		margin: 20,
		fontSize: 16,
		fontWeight: '700',
	},
});

export default General;
