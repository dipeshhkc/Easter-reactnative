import axios from 'axios';
import { bURL } from '../app-config';

const apiEndpoint = `${bURL}api/login`;

export function AddLogin(value) {
	return axios.post(`${apiEndpoint}`, value);
}
