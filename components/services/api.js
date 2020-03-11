import axios from 'axios';
import { AsyncStorage } from 'react-native';
const qs = require('qs');

import { Toast } from 'native-base';

export const get = async url => {
	try {
		let response = await axios.get(url);
		return response.data;
	} catch (err) {}
};

export const post = async (url, body, Furl = null, history = null, successLogin = null, reload = null, navigation = null, actions = null, onSuccess = null, onError = null) => {
	try {
		let received = await axios.post(url, body);

		if (!received.data.error) {
			Toast.show({
				text: 'Success',
				buttonText: 'Okay',
				position: 'bottom',
				duration: 3000,
				type: 'success',
			});
			actions && actions.setSubmitting(false);
			navigation && navigation.navigate('ViewScreen');
			successLogin && (await successLogin(received.data.data));
			onSuccess && onSuccess(received.data.data);

			history && Furl && history.push(Furl);
			reload && reload();
		} else {
			Toast.show({
				text: 'Error',
				buttonText: 'Okay',
				position: 'bottom',
				duration: 3000,
				type: 'danger',
			});
			actions && actions.setSubmitting(false);
			onError(true);
		}
	} catch (err) {
		Toast.show({
			text: 'Error',
			buttonText: 'Okay',
			position: 'bottom',
			duration: 3000,
			type: 'danger',
		});
		onError(true);
	}
};

export const put = async (url, body, Furl = null, history = null, reload = null) => {
	try {
		let received = await axios.put(url, body);
		if (!received.data.error) {
			history && Furl && history.push(Furl);
			reload && reload();
		} else {
			Toast.show({
				text: 'Error',
				buttonText: 'Okay',
				position: 'bottom',
				duration: 3000,
				type: 'danger',
			});
		}
	} catch (err) {
		Toast.show({
			text: 'Error while submitting',
			buttonText: 'Okay',
			position: 'bottom',
			duration: 3000,
			type: 'danger',
		});
	}
};

export const deletee = async (url, showConfirm = true) => {
	if (!showConfirm) {
		await axios.delete(url);
	} else {
		let response = window.confirm('Are you sure you want to delete?');
		if (response) {
			try {
				let received = await axios.delete(url);
				if (!received.data.error) {
					Toast.show({
						text: 'Success',
						buttonText: 'Okay',
						position: 'bottom',
						duration: 3000,
						type: 'success',
					});
				} else {
					Toast.show({
						text: 'Error while submitting',
						buttonText: 'Okay',
						position: 'bottom',
						duration: 3000,
						type: 'danger',
					});
				}
			} catch (err) {
				Toast.show({
					text: 'Error while submitting',
					buttonText: 'Okay',
					position: 'bottom',
					duration: 3000,
					type: 'danger',
				});
			}
		}
	}
};

export const getCurrentUser = async navigation => {
	const value = await AsyncStorage.getItem('user');
	if (value != null) {
		navigation.navigate('Home');
	} else {
		navigation.navigate('Login');
	}
};

export const logout = async navigation => {
	await AsyncStorage.removeItem('user');
	navigation.navigate('Login');
};
