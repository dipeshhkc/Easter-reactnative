import React, { Component } from 'react';

import { Text, Button, Form, View, Spinner } from 'native-base';
import { StyleSheet, KeyboardAvoidingView, Image, Platform, AsyncStorage } from 'react-native';
import MyFormik from '../../components/myFormik';
import { inputView } from '../../components/utils/ViewConfig';
import { getCurrentUser } from '../../components/services/api';
const logo = require('../../assets/easter.png');

class LoginScreen extends Component {
	static navigationOptions = () => ({
		header: null,
	});

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			notlogged: true,
		};
	}

	handleClick = () => {
		this.setState({ loading: true });
	};

	// whhen success
	success = () => {
		this.setState({ loading: false });
		this.props.navigation.navigate('Home');
	};
	Burl = 'http://batas.simriksacos.com.np/public/api/login';

	render() {
		return (
			<KeyboardAvoidingView behavior={'padding'} style={styles.container}>
				<MyFormik onSuccess={this.success} Burl={this.Burl}>
					{props => (
						<Form>
							<View style={{ alignItems: 'center', padding: 20 }}>
								<Image source={logo} resizeMode={'contain'} />
							</View>

							<Text style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold', fontFamily: 'NotoSerif', textDecorationLine: 'underline', marginBottom: 100 }}> Eastern Motor</Text>

							<Text style={styles.app_header}>LOGIN</Text>
							{inputView([
								{
									name: 'email',
									title: 'Email',
									props,
									keyboardType: 'email-address',
								},
								{
									name: 'password',
									title: 'Password',
									props,
									secureTextEntry: true,
								},
							])}
							<View>
								<Button
									onPress={() => {
										this.handleClick();
										props.handleSubmit();
									}}
									primary
									iconLeft
									style={{ paddingLeft: 10, marginTop: 20, justifyContent: 'center' }}
									disabled={this.state.loading}
								>
									{this.state.loading && <Spinner color="white" size="small" />}
									<Text style={{ textAlign: 'center' }}>Login</Text>
								</Button>
							</View>
						</Form>
					)}
				</MyFormik>
			</KeyboardAvoidingView>
		);
	}
}

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'white',
	},
	loginbtn: {
		marginTop: 20,
	},
	app_header: {
		textAlign: 'center',
		fontSize: 25,
		marginTop: 20,
	},
});
