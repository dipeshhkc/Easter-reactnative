import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, AsyncStorage, ScrollView } from 'react-native';
import { Form, Item, Button, Icon, Input, Spinner, Toast } from 'native-base';
import { Formik } from 'formik';
import Logo from '../../assets/logo1.png';
import { AddLogin } from '../../components/services/loginService';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				email: '',
				password: '',
			},
			showToast: false,
			LoginErrors: {},
		};
	}

	successLogin = async user => {
		if (user) {
			await AsyncStorage.setItem('user', JSON.stringify(user));
		}
	};

	render() {
		return (
			<KeyboardAvoidingView behavior={'padding'} style={styles.screen}>
				<ScrollView>
					<View>
						{this.state.LoginErrors && this.state.LoginErrors.message && (
							<View>
								<Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{this.state.LoginErrors.message}</Text>
							</View>
						)}
						<View>
							<View style={styles.imageWrap}>
								<Text style={{ ...styles.textMain, paddingTop: 15, fontSize: 25, letterSpacing: 2, textTransform: 'uppercase' }}>Batas InterPrises</Text>
							</View>
							<View style={styles.imageWrap}>
								<Text style={{ ...styles.textMain, paddingTop: 15, fontSize: 25, letterSpacing: 2 }}>Welcome</Text>
							</View>
						</View>
						<View style={styles.formWrap}>
							<Formik
								initialValues={this.state.data}
								enableReinitialize={true}
								onSubmit={async (values, actions) => {
									actions.setSubmitting(true);

									try {
										const response = await AddLogin(values);
										if (response.data.error) throw new Error(response.data.error);
										else {
											Toast.show({
												text: 'Login successfully!',
												position: 'bottom',
												duration: 3000,
												type: 'success',
											});
											this.successLogin(response.data.data);
											this.setState({ LoginErrors: {} });
										}
										actions.resetForm();
										actions.setSubmitting(false);
										this.props.navigation.navigate('Home');
									} catch (ex) {
										if (ex.response && ex.response.status === 404) {
											Toast.show({
												text: 'Something went wrong.',
												position: 'bottom',
												duration: 3000,
												type: 'danger',
											});
										} else {
											Toast.show({
												text: `${ex.response.data.error}`,
												position: 'bottom',
												duration: 3000,
												type: 'danger',
											});
										}
										actions.setSubmitting(false);
									}
								}}
							>
								{({ isSubmitting, handleSubmit, setFieldValue }) => (
									<Form>
										<View style={styles.LoginWrapper}>
											<View style={styles.IconCircle}>
												<View style={styles.Circle}>
													<AntDesign name="user" size={25} color={'#fff'} />
												</View>
											</View>
											<View style={styles.LoginWrapperMain}>
												<Item style={{ backgroundColor: '#fff', paddingHorizontal: 20, marginBottom: 10, borderRadius: 50 }}>
													<FontAwesome name="user" size={25} style={styles.Icons} />
													<Input
														name="email"
														placeholder="Email Address"
														onChangeText={text => {
															setFieldValue('email', text);
														}}
														keyboardType="email-address"
														placeholderTextColor={'#000'}
														style={styles.Input}
													/>
												</Item>
												<Item style={{ backgroundColor: '#fff', paddingHorizontal: 20, borderRadius: 50 }}>
													<FontAwesome name="lock" size={25} style={styles.Icons} />
													<Input
														name="password"
														placeholder="Password"
														onChangeText={text => {
															setFieldValue('password', text);
														}}
														secureTextEntry={true}
														placeholderTextColor={'#000'}
														style={styles.Input}
													/>
												</Item>
											</View>
										</View>
										<View
											style={{
												paddingTop: 30,
											}}
										>
											<Button disabled={isSubmitting} type="submit" onPress={handleSubmit} style={{ justifyContent: 'center', borderRadius: 100, marginHorizontal: 20, backgroundColor: '#09164a' }}>
												{isSubmitting && <Spinner color="white" size="small" />}
												<Text style={{ textAlign: 'center', paddingLeft: 10, color: '#fff', fontWeight: 'bold' }}>Login</Text>
											</Button>
										</View>
									</Form>
								)}
							</Formik>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		paddingTop: 30,
		// paddingHorizontal: 10,
		backgroundColor: '#fff',
	},
	titlewrap: {
		flexDirection: 'row',
	},
	text: {
		color: '#000',
		fontSize: 11,
		fontWeight: '400',
	},
	textMain: {
		paddingRight: 5,
		fontWeight: '700',
		color: '#000',
		fontSize: 12,
		textTransform: 'uppercase',
	},
	imageWrap: {
		alignItems: 'center',
		paddingTop: 80,
	},
	image: {
		height: 100,
		width: 105,
		backgroundColor: '#fff',
	},
	formWrap: {
		paddingVertical: 50,
		paddingHorizontal: 10,
	},
	textVersion: {
		paddingTop: 40,
		alignItems: 'center',
		textAlign: 'center',
		color: '#000',
	},
	Icons: {
		color: '#921415',
		paddingRight: 10,
	},
	Input: {
		color: '#000',
		fontSize: 13,
		width: '50%',
		backgroundColor: '#fff',
	},
	LoginWrapper: {
		paddingHorizontal: 5,
		flexDirection: 'row',
		width: '30%',
	},
	IconCircle: {
		height: 130,
		width: 130,
		transform: [{ translateX: -30 }],
		backgroundColor: '#fff',
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1,
	},
	Circle: {
		height: 70,
		width: 70,
		backgroundColor: '#070c2a',
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	LoginWrapperMain: {
		width: Dimensions.get('window').width - 35,
		position: 'absolute',
		left: 15,
		height: 130,
		borderRadius: 100,
		backgroundColor: '#a61615',
		paddingLeft: 80,
		paddingRight: 30,
		justifyContent: 'center',
	},
});

export default LoginScreen;
