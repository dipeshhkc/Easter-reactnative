import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableHighlight, TouchableOpacity, Dimensions, Modal, Button } from 'react-native';
import { Formik } from 'formik';
import { Input, Label, Form, Item, Spinner, Toast } from 'native-base';
import ModelTable from './modelTable';
import { addModel, deleteModel, getModelPaginate } from '../../components/services/addModelService';

class ModelSetup extends Component {
	state = {
		data: {
			id: '',
			model: '',
			inr: '',
		},
		ModelData: [],
		errors: {},
		currentPage: 1,
		PaginateLoading: false,
		modalVisible: false,
		loading: true,
		isEdit: false,
		dataResponse: false,
	};

	async componentDidMount() {
		try {
			const { data: ModelData } = await getModelPaginate(this.state.currentPage);
			this.setState(prevState => ({ ModelData: ModelData.data.data, loading: !prevState.loading }));
		} catch (err) {
			this.setState({ errors: err });
		}
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.dataResponse !== prevState.dataResponse) {
			const { data: ModelData } = await getModelPaginate(this.state.currentPage);
			this.setState({ ModelData: ModelData.data.data, loading: false });
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

	onDataLoad = async () => {
		this.setState({ PaginateLoading: true });
		let { currentPage } = this.state;
		currentPage = currentPage + 1;
		const { data: ModelData } = await getModelPaginate(currentPage);
		let newdatas = ModelData.data.data;
		let newData = [...this.state.ModelData, ...newdatas];
		this.setState({ currentPage, ModelData: newData, PaginateLoading: false });
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
			Toast.show({
				text: 'This Model deleted successfully.',
				position: 'bottom',
				duration: 3000,
				type: 'success',
			});
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				Toast.show({
					text: 'This Model has already been deleted..',
					position: 'bottom',
					duration: 3000,
					type: 'danger',
				});
			this.setState({ ModelData: originalModelData });
		}
	};

	render() {
		const { loading, ModelData, isEdit, PaginateLoading } = this.state;
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
									<TouchableOpacity
										onPress={() => {
											this.onModalClick();
										}}
									>
										<Text
											style={{
												...styles.modalButton,
												backgroundColor: 'red',
												width: '100%',
												marginBottom: 10,
											}}
										>
											Close
										</Text>
									</TouchableOpacity>
									{isEdit && (
										<TouchableOpacity
											onPress={() => {
												this.handleDelete(this.state.data);
											}}
										>
											<Text
												style={{
													...styles.modalButton,
													backgroundColor: 'red',
													width: '100%',
													marginBottom: 10,
												}}
											>
												Delete
											</Text>
										</TouchableOpacity>
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
													Toast.show({
														text: 'Edited successfully!',
														position: 'bottom',
														duration: 3000,
														type: 'success',
													});
												} else {
													Toast.show({
														text: 'Added successfully!',
														position: 'bottom',
														duration: 3000,
														type: 'success',
													});
												}
												this.onModalClick();
											}
											actions.resetForm();
											actions.setSubmitting(false);
										} catch (ex) {
											if (ex.response && ex.response.status === 404) {
												Toast.show({
													text: 'Something went wrong.',
													position: 'bottom',
													duration: 3000,
													type: 'danger',
												});
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
						<TouchableHighlight
							onPress={() => {
								this.onDataLoad();
							}}
						>
							<View style={styles.modalButton1}>
								{PaginateLoading && <Spinner color="#fff" size="small" />}
								<Text style={{ fontWeight: 'bold', color: '#fff', paddingLeft: 20 }}>Load More</Text>
							</View>
						</TouchableHighlight>
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
	modalButton1: {
		backgroundColor: '#0c4ca3',
		flexDirection: 'row',
		borderRadius: 5,
		padding: 0,
		justifyContent: 'center',
		alignItems: 'center',
		letterSpacing: 1,
		height: 50,
	},
});

export default ModelSetup;
