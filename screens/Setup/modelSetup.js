import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableHighlight, TouchableNativeFeedback, Dimensions, Modal, Button } from 'react-native';
import { Formik } from 'formik';
import { Input, Label, Form, Item, Spinner } from 'native-base';
import ModelTable from './modelTable';
import { addModel, getModel, deleteModel } from '../../components/services/addModelService';

class ModelSetup extends Component {
	state = {
		data: {
			id: '',
			model: '',
			inr: '',
		},
		ModelData: [],
		errors: {},
		modalVisible: false,
		loading: true,
		isEdit: false,
		dataResponse: false,
	};

	async componentDidMount() {
		try {
			const { data: ModelData } = await getModel();
			this.setState(prevState => ({ ModelData: ModelData.data, loading: !prevState.loading }));
		} catch (err) {
			this.setState({ errors: err });
		}
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.dataResponse !== prevState.dataResponse) {
			const { data: ModelData } = await getModel();
			this.setState({ ModelData: ModelData.data, loading: false });
		}
	}

	onModalClick = () => {
		this.setState(prevState => ({
			modalVisible: !prevState.modalVisible,
			data: {
				id: '',
				model: '',
				inr: '',
			},
			isEdit: false,
			dataResponse: !prevState.dataResponse,
		}));
	};

	handleEdit = object => {
		this.setState(prevState => ({
			data: this.mapToViewModal(object),
			modalVisible: !prevState.modalVisible,
			isEdit: true,
		}));
	};

	mapToViewModal(adv) {
		return {
			id: adv.id,
			model: adv.model,
			inr: adv.inr,
		};
	}

	handleDelete = async model => {
		const originalModelData = this.state.ModelData;
		const ModelData = originalModelData.filter(m => m.model !== model.model);
		this.setState({ ModelData });

		try {
			await deleteModel(model.model);
			this.setState(prevState => ({ modalVisible: false, dataResponse: !prevState.dataResponse, loading: !prevState.loading }));
			alert('This Model deleted successfully.');
		} catch (ex) {
			if (ex.response && ex.response.status === 404) alert('This Model has already been deleted.');
			this.setState({ ModelData: originalModelData });
		}
	};

	render() {
		const { loading, ModelData, isEdit } = this.state;
		return (
			<View style={styles.screen}>
				{loading ? (
					<View style={styles.mainscreen}>
						<ActivityIndicator size={40} color={'#0c4ca3'} />
					</View>
				) : (
					<ScrollView>
						<TouchableHighlight
							style={styles.th1}
							onPress={() => {
								this.onModalClick();
							}}
						>
							<Text style={styles.modalButton}>Add Model</Text>
						</TouchableHighlight>
						<Modal
							animationType="slide"
							transparent={false}
							visible={this.state.modalVisible}
							onRequestClose={() => {
								this.onModalClick();
							}}
						>
							<View style={styles.modalWrapper}>
								<View style={styles.modalContainer}>
									<TouchableNativeFeedback
										onPress={() => {
											this.onModalClick();
										}}
									>
										<Text
											style={{
												...styles.modalButton,
												backgroundColor: 'red',
												width: '20%',
												marginBottom: 10,
											}}
										>
											Close
										</Text>
									</TouchableNativeFeedback>
									{isEdit && (
										<TouchableNativeFeedback
											onPress={() => {
												this.handleDelete(this.state.data);
											}}
										>
											<Text
												style={{
													...styles.modalButton,
													backgroundColor: 'red',
													width: '20%',
													marginBottom: 10,
												}}
											>
												Delete
											</Text>
										</TouchableNativeFeedback>
									)}
								</View>
								<Formik
									initialValues={this.state.data}
									enableReinitialize={true}
									onSubmit={async (values, actions) => {
										actions.setSubmitting(true);
										try {
											const response = await addModel(values, isEdit);
											if (response.data.error) throw new Error(response.data.error);
											else {
												if (isEdit) {
													alert('Edited successfully!');
												} else {
													alert('Added successfully!');
												}
												this.onModalClick();
											}
											actions.resetForm();
											actions.setSubmitting(false);
										} catch (ex) {
											if (ex.response && ex.response.status === 404) {
												alert('Something went wrong.');
											} else {
												this.setState({
													AddUserErrors: ex,
												});
											}
											actions.setSubmitting(false);
										}
									}}
								>
									{({ isSubmitting, handleBlur, setFieldValue, values, errors, touched, handleSubmit, handleChange, handleReset }) => (
										<View style={styles.modalDetail}>
											<Form>
												<Item
													floatingLabel
													style={{
														paddingVertical: 5,
													}}
												>
													<Label>{'Name'}</Label>
													<Input
														name={'model'}
														value={values.model}
														style={styles.input}
														onChangeText={text => {
															setFieldValue('model', text);
														}}
													/>
												</Item>
												<Item
													floatingLabel
													style={{
														paddingVertical: 5,
													}}
												>
													<Label>{'Price'}</Label>
													<Input
														name={'inr'}
														value={values.inr}
														onChangeText={text => {
															setFieldValue('inr', text);
														}}
													/>
												</Item>
												<View
													style={{
														marginTop: 20,
													}}
												>
													{isSubmitting && <Spinner color="green" />}
													<Button
														disabled={isSubmitting}
														type="submit"
														title="Submit"
														onPress={handleSubmit}
														color={'#0c4ca3'}
														style={{
															fontWeight: 'bold',
															marginTop: 20,
														}}
													/>
												</View>
											</Form>
										</View>
									)}
								</Formik>
							</View>
						</Modal>
						<ModelTable data={ModelData} clicked={row => this.handleEdit(row)} />
					</ScrollView>
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
	},
	screen: {
		flex: 1,
		margin: 10,
		padding: 10,
		backgroundColor: '#fff',
	},
	errors: {
		textAlign: 'left',
		backgroundColor: '#ff0000e6',
		padding: 15,
		borderRadius: 5,
		fontWeight: 'bold',
		color: '#fff',
	},
	button: {
		width: Dimensions.get('window').width - 20,
		margin: 10,
	},
	modalWrapper: {
		paddingHorizontal: 20,
		marginTop: 20,
		backgroundColor: '#fff',
	},
	detailmodalWrapper: {
		marginTop: 20,
	},
	modalContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#d2d0d0',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	modalDetail: {
		paddingVertical: 5,
	},
	modalButton: {
		backgroundColor: '#0c4ca3',
		color: '#fff',
		textAlign: 'center',
		borderRadius: 5,
		padding: 11,
		justifyContent: 'center',
		alignItems: 'center',
		letterSpacing: 1,
		fontWeight: 'bold',
	},
});

export default ModelSetup;
