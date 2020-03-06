import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, KeyboardAvoidingView, ActivityIndicator } from 'react-native';

import { Form, Spinner } from 'native-base';
import { generateJSX } from '../components/utils/Views';
import { dropdownFormat } from '../components/utils/generals';
import { modelCollection, parameter } from '../components/utils/config';
import MyFormik from '../components/myFormik';
import ModelDropdown from './Setup/modelDropdown';
import { getModel } from '../components/services/addModelService';

class ModalSetup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			optionVal: '10.90 L 3X2 SCL BUS',
			ModelData: null,
			errors: {},
			loading: false,
		};
	}

	setStateFromOtherFile = (option, value) => {
		this.setState({ [option]: value });
	};

	componentDidMount = () => {
		dropdownFormat(modelCollection, 'modelOption', this.setStateFromOtherFile);
	};

	Burl = 'http://batas.simriksacos.com.np/public/api/vehiclemodel';
	default = {};

	generateForm = (values, handleChange, setFieldValue) => {
		let FormGroup = [];
		return parameter.map(each => {
			if (each.default != '') {
				this.default[each.id] = each.default;
			}

			return generateJSX(each.type, each.name, each.name, each.id, values, handleChange, each.icon, each.iconType, setFieldValue, each.id);
		});
	};

	valueSelected = async val => {
		try {
			this.setState(prevState => ({ optionVal: val, loading: !prevState.loading }));
			const { data: ModelData } = await getModel(val);
			this.setState(prevState => ({ ModelData: ModelData.data, loading: !prevState.loading }));
		} catch (err) {
			this.setState({ errors: err });
		}
	};

	render() {
		const { modelOption, optionVal, ModelData, loading } = this.state;
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
			<KeyboardAvoidingView behavior="padding">
				<ScrollView>
					<View style={styles.screen}>
						<ModelDropdown options={modelOption} default={optionVal} handleChange={val => this.valueSelected(val)} />
						<Text>{'\n'}</Text>
						{loading ? (
							<View style={styles.mainscreen}>
								<ActivityIndicator size={40} color={'#0c4ca3'} />
							</View>
						) : (
							ModelData && (
								<MyFormik history={this.props.history} navigation={this.props.navigation} Furl={this.Furl} Burl={this.Burl} process={true} initial={ModelData}>
									{props => <ModelSetupFormComponent props={props} />}
								</MyFormik>
							)
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	screen: {
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
});

export default ModalSetup;
