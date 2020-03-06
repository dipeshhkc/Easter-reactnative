import axios from 'axios';
import { bURL } from '../app-config';

const apiEndpoint = `${bURL}api/vehiclemodel`;

export function addModel(value, isEdit) {
	console.log('values');
	if (isEdit) {
		return axios.put(`${apiEndpoint}/${val}`, value);
	}
	return axios.post(`${apiEndpoint}`, value);
}

export function getModel(val) {
	if (val) {
		return axios.get(`${apiEndpoint}/${val}`);
	}
	return axios.get(`${apiEndpoint}`);
}

export function deleteModel(name) {
	return axios.delete(`${apiEndpoint}/${name}`);
}
