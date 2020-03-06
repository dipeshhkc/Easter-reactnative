// import { toast } from 'react-toastify';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
// const axios = require('axios');
const qs = require('qs');

export const get = async (url, paramName, paramvValue) => {
	try {
		// let response = await axios.get(url, {
		//     params: {
		//         [paramName]: paramvValue,
		//     },
		//     paramsSerializer: function(params) {
		//         return qs.stringify(params, { arrayFormat: 'repeat' });
		//     },
		// });
		let response = await axios.get(url);
		return response.data;
	} catch (err) {}
};

export const post = async (url, body, Furl = null, history = null, successLogin = null, reload = null, navigation = null, actions = null, onSuccess = null) => {
	try {
		console.log('bxody', url, body);
		let received = await axios.post(url, body);

		if (!received.data.error) {
			alert('Successfull');
			actions && actions.setSubmitting(false);
			navigation && navigation.navigate('ViewScreen');
			successLogin && (await successLogin(received.data.data));
			onSuccess && onSuccess(received.data.data);
			// toast.success(received.data.message, {
			//     position: toast.POSITION.TOP_RIGHT,
			// });
			history && Furl && history.push(Furl);
			reload && reload();
		} else {
			// toast.error(received.data.error.message || received.data.error, {
			//     position: toast.POSITION.TOP_RIGHT,
			// });
			alert('Error');
			// navigation&&navigation.navigate('ViewScreen')
			actions && actions.setSubmitting(false);
		}
	} catch (err) {
		alert('Error');

		// toast.error('Error while submitting', {
		//     position: toast.POSITION.TOP_RIGHT,
		// });
		console.log(err);
	}
};

export const put = async (url, body, Furl = null, history = null, reload = null) => {
	try {
		let received = await axios.put(url, body);
		if (!received.data.error) {
			// toast.success(received.data.message, {
			//     position: toast.POSITION.TOP_RIGHT,
			// });
			console.log('toast', received.data.message);

			history && Furl && history.push(Furl);
			reload && reload();
		} else {
			// toast.error(received.data.error.message, {
			//     position: toast.POSITION.TOP_RIGHT,
			// });
			console.log('toast error', received.data.error.message);
		}
	} catch (err) {
		// toast.error('Error while updating', {
		//     position: toast.POSITION.TOP_RIGHT,
		// });
		console.log('Error while submitting');
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
					// toast.success(received.data.message, {
					//     position: toast.POSITION.TOP_RIGHT,
					// });
					console.log('success', received.data.message);
				} else {
					// toast.error(received.data.error.message, {
					//     position: toast.POSITION.TOP_RIGHT,
					// });
					console.log('toast error', received.data.error.message);
				}
			} catch (err) {
				// toast.error('Error while deleting', {
				//     position: toast.POSITION.TOP_RIGHT,
				// });
				console.log('Error while submitting');
			}
		}
	}
};

export const getCurrentUser = async navigation => {
	const value = await AsyncStorage.getItem('user');
	console.log('aao', JSON.parse(value));
	if (value != null) {
		// return JSON.parse(value).role;
		navigation.navigate('Home');
	} else {
		// return null;
	}
};

export const logout = async navigation => {
	await AsyncStorage.removeItem('user');
	navigation.navigate('Login');
};
