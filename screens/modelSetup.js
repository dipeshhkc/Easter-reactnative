import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity } from 'react-native';

import { Form, Spinner, Icon } from 'native-base';
import { generateJSX } from '../components/utils/Views';
import { dropdownFormat } from '../components/utils/generals';
import { modelCollection, parameter } from '../components/utils/config';
import MyFormik from '../components/myFormik';
import ModelDropdown from './Setup/modelDropdown';
import { getModel } from '../components/services/addModelService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { bURL } from '../components/app-config';
import MyModel from '../components/utils/MyModel';

class ModalSetup extends Component {
	static navigationOptions = () => ({
		headerShown: false,
	});
	constructor(props) {
		super(props);
		this.state = {
			optionVal: '',
			modelData: null,
			mainData: null,
			errors: {},
			mainloading: false,
			loading: true,
			modalVisible: false,
		};
	}

	setStateFromOtherFile = (option, value) => {
		this.setState({ [option]: value });
	};

	componentDidMount = async () => {
		try {
			const { data: modelData } = await getModel();
			this.setState({ modelData: modelData.data, loading: false });
		} catch (err) {
			this.setState({ errors: err });
		}
	};

	Burl = `${bURL}api/vehiclemodel`;

	default = {};

	generateForm = (values, handleChange, setFieldValue) => {
		let FormGroup = [];
		return parameter.map((each, ind) => {
			if (each.default != '') {
				this.default[each.id] = each.default;
			}

			return generateJSX(each.type, each.name, each.name, each.id, values, handleChange, each.icon, each.iconType, setFieldValue, each.id, ind);
		});
	};

	valueSelected = async val => {
		try {
			this.setState({ optionVal: val, mainloading: true, modalVisible: false });
			
			const { data: mainData } = await getModel(val);
			this.setState({ mainData: mainData.data, mainloading: false });
		} catch (err) {
			this.setState({ errors: err });
		}
	};

	onModalClick = () => {
		this.setState(prevState => ({ modalVisible: !prevState.modalVisible }));
	};

	render() {
		const { mainData, optionVal, modelData, loading, mainloading } = this.state;

		let ModelSetupFormComponent = props => {
			const { handleChange, values, handleSubmit, setFieldValue, isSubmitting } = props.props;
			return (
				 <View style={{ flex:1 }}>
					
					 	<Text style={{...styles.title,marginTop:30}}>{`${this.state.optionVal} Parameter`} :</Text>
				{/* click gareko input box and keyboard ko distance */}
						 <KeyboardAvoidingView  behavior="padding"  keyboardVerticalOffset={80} >
						 <ScrollView>
						 	<Form>
						 		<View style={{ flex: 1 }}>{this.generateForm(values, handleChange, setFieldValue)}</View>
						 		{isSubmitting && <Spinner color="green" />} 
						 	</Form>
						 </ScrollView>
							 </KeyboardAvoidingView>
				
				{/* shadow, touchable opacity */}
						<View style={{ backgroundColor: "green", justifyContent: "center", alignItems: "center", position: "absolute", bottom: 20, right: 10, height: 70, width: 70, borderRadius: 70 }}>
							<Icon  onPress={handleSubmit} type="AntDesign" name="save" style={{ color: "white" }}/>
							{/* <Button disabled={isSubmitting} type="submit" title="Submit" onPress={handleSubmit} style={{ fontWeight: 'bold' }} /> */}
						</View>

				 </View>
			);
		};

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
							) : mainData ? (
								<View style={styles.formikStyle}>
							
									<MyFormik history={this.props.history} model={optionVal} navigation={this.props.navigation} Furl={this.Furl} Burl={this.Burl} process={true} initial={mainData}>
										{props => <ModelSetupFormComponent props={props} />}
									</MyFormik>
								 
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
		fontFamily: 'NotoSerif'
		
	},
	NoDataStyle: {
		flex: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modelSelect: {
		position: 'absolute',
		bottom: 10,
		left:'10%',
		width:'80%'
	},

	formikStyle: {
		flex: 4,
		marginBottom:60

	},
});

export default ModalSetup;
