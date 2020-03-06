import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getCurrentUser } from '../services/api';

class CheckUser extends Component {
	constructor(props) {
		super(props);
		getCurrentUser(props.navigation);
	}

	render() {
		return (
			<View style={styles.screen}>
				<ActivityIndicator size={40} color={'#0c4ca3'} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default CheckUser;
