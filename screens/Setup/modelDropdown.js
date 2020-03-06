import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Form, Item, Picker, Icon } from 'native-base';

const ModelDropdown = props => {
	return (
		<View style={styles.modalDetail}>
			<Text style={styles.title}>Model :</Text>
			<Form>
				<Item picker>
					<Picker
						mode="dropdown"
						iosIcon={<Icon name="arrow-down" />}
						placeholder="Select your SIM"
						placeholderStyle={{ color: '#bfc6ea' }}
						placeholderIconColor="#007aff"
						selectedValue={props.default}
						onValueChange={e => {
							props.handleChange(e);
						}}
					>
						<Picker.Item label={'Select Any Model'} value={''} />
						{props.options && props.options.map(m => <Picker.Item label={m.model} value={m.model} key={m.id} />)}
					</Picker>
				</Item>
			</Form>
		</View>
	);
};

const styles = StyleSheet.create({
	modalDetail: {
		margin: 10,
		marginBottom: 0,
		padding: 5,
		paddingBottom: 0,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 16,
		paddingBottom: 5,
		fontWeight: '700',
		letterSpacing: 0.5,
		color: '#0c4ca3',
	},
});

export default ModelDropdown;
