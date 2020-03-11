import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, AsyncStorage, ScrollView } from 'react-native';
import { Form, Item, Button, Icon, Input, Spinner, Toast } from 'native-base';
import { Formik } from 'formik';
import Logo from '../../assets/logo1.png';
import { AddLogin } from '../../components/services/loginService';

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
							<View style={styles.titlewrap}>
								<Text style={styles.textMain}>Eastern</Text>
								<Text style={styles.text}>Motors</Text>
							</View>
							<Text style={styles.text}>Enterpise of BATAS</Text>
							<View style={styles.imageWrap}>
								<Image source={Logo} resizeMode={'center'} style={styles.image} />
								<Text style={{ ...styles.textMain, paddingTop: 15, fontSize: 18 }}>Eastern Motors</Text>
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
												buttonText: 'Okay',
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
												buttonText: 'Okay',
												position: 'bottom',
												duration: 3000,
												type: 'danger',
											});
										} else {
											this.setState({
												LoginErrors: ex,
											});
										}
										actions.setSubmitting(false);
									}
								}}
							>
								{({ isSubmitting, handleSubmit, setFieldValue }) => (
									<Form>
										<Item>
											<Icon active name="mail" style={styles.Icons} />
											<Input
												name="email"
												placeholder="Email Address"
												onChangeText={text => {
													setFieldValue('email', text);
												}}
												keyboardType="email-address"
												placeholderTextColor={'#fff'}
												style={styles.Input}
											/>
										</Item>
										<Item>
											<Icon active name="key" style={styles.Icons} />
											<Input
												name="password"
												placeholder="Password"
												onChangeText={text => {
													setFieldValue('password', text);
												}}
												secureTextEntry={true}
												placeholderTextColor={'#fff'}
												style={styles.Input}
											/>
										</Item>
										<View
											style={{
												paddingTop: 30,
											}}
										>
											<Button disabled={isSubmitting} type="submit" onPress={handleSubmit} style={{ justifyContent: 'center', backgroundColor: '#4cb849' }}>
												{isSubmitting && <Spinner color="white" size="small" />}
												<Text style={{ textAlign: 'center', paddingLeft: 10, color: '#fff', fontWeight: 'bold' }}>Login</Text>
											</Button>
										</View>
									</Form>
								)}
							</Formik>
						</View>
						<View>
							<Text style={styles.textVersion}>Version 1.0</Text>
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
		paddingTop: 40,
		paddingHorizontal: 10,
		backgroundColor: '#0d50ab',
	},
	titlewrap: {
		flexDirection: 'row',
	},
	text: {
		color: '#fff',
		fontSize: 11,
		fontWeight: '400',
	},
	textMain: {
		paddingRight: 5,
		fontWeight: '700',
		color: '#fff',
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
		color: '#fff',
	},
	Icons: {
		color: '#fff',
	},
	Input: {
		color: '#fff',
		fontSize: 13,
	},
});

export default LoginScreen;
