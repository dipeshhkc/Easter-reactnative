import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, KeyboardAvoidingView, ActivityIndicator } from 'react-native';

import { Form, Spinner } from 'native-base';
import { generateJSX } from '../components/utils/Views';
import { dropdownFormat } from '../components/utils/generals';
import { modelCollection, parameter } from '../components/utils/config';
import MyFormik from '../components/myFormik';
import ModelDropdown from './Setup/modelDropdown';
import { getModel } from '../components/services/addModelService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { bURL } from '../components/app-config';

class ModalSetup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			optionVal: '',
			ModelData: null,
			MainData: null,
			errors: {},
			Mainloading: false,
			loading: true,
		};
	}

	setStateFromOtherFile = (option, value) => {
		this.setState({ [option]: value });
	};

	componentDidMount = async () => {
		try {
			const { data: ModelData } = await getModel();
			this.setState({ ModelData: ModelData.data, loading: false });
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
			this.setState({ optionVal: val, Mainloading: true });
			const { data: MainData } = await getModel(val);
			this.setState({ MainData: MainData.data, Mainloading: false });
		} catch (err) {
			this.setState({ errors: err });
		}
	};

	render() {
		const { MainData, optionVal, ModelData, loading, Mainloading } = this.state;
		console.log(MainData);
		let ModelSetupFormComponent = props => {
			const { handleChange, values, errors, touched, handleSubmit, setFieldValue, isSubmitting } = props.props;
			return (
				<View style={styles.screen}>
					<Form>
						<Text style={styles.title}>MRP Parameters :</Text>
						<View>{this.generateForm(values, handleChange, setFieldValue)}</View>
						<Text>{'\n'}</Text>
						{isSubmitting && <Spinner color="green" />}
						<Button disabled={isSubmitting} type="submit" title="Submit" onPress={handleSubmit} color={'#0c4ca3'} style={{ fontWeight: 'bold' }} />
					</Form>
				</View>
			);
		};
		return (
			<KeyboardAvoidingView behavior="position">
			{/* <KeyboardAwareScrollView> */}
				<ScrollView>
					<View style={styles.screen}>
						{loading ? (
							<View style={styles.mainscreen}>
								<ActivityIndicator size={40} color={'#0c4ca3'} />
							</View>
						) : (
							<>
								{ModelData && (
									<>
										<ModelDropdown options={ModelData} default={optionVal} handleChange={val => this.valueSelected(val)} />
										<Text>{'\n'}</Text>
									</>
								)}
								{Mainloading ? (
									<View style={styles.mainscreen}>
										<ActivityIndicator size={40} color={'#0c4ca3'} />
									</View>
								) : MainData ? (
									<MyFormik history={this.props.history} model={optionVal} navigation={this.props.navigation} Furl={this.Furl} Burl={this.Burl} process={true} initial={MainData}>
										{props => <ModelSetupFormComponent props={props} />}
									</MyFormik>
								) : (
									<Text style={styles.not_available_text}>Data Not Available! Please Select Another Model</Text>
								)}
							</>
						)}
					</View>
				</ScrollView>
			{/* </KeyboardAwareScrollView> */}
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		margin: 10,
		padding: 5,
		backgroundColor: '#fff',
	},
	mainscreen: {
		paddingBottom: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	screen2: {
		marginVertical: 10,
		paddingVertical: 5,
	},
	title: {
		fontSize: 16,
		paddingBottom: 5,
		fontWeight: '700',
		letterSpacing: 0.5,
		color: '#0c4ca3',
	},
	not_available_text: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 20,
		fontSize: 16,
		fontWeight: '700',
	},
});

export default ModalSetup;
