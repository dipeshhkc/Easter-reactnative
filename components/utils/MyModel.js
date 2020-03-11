import React from 'react';
import { View, StyleSheet, Text,Modal,TouchableOpacity,ScrollView } from 'react-native';

const MyModel = props => {
	return (
		<Modal
			animationType="slide"
			transparent={false}
			visible={props.modalVisible}
			onRequestClose={() => {
				props.onModelClick()
			}}
		>
			<View style={styles.modalWrapper}>
				<View style={styles.modalContainer}>
					<TouchableOpacity
						onPress={() => {
							props.onModelClick()
						}}
					>
						<Text
							style={{
								...styles.modalButton,
								backgroundColor: 'red',
								width: '20%',
								marginBottom: 10,
							}}
						>
							Close
						</Text>
					</TouchableOpacity>
				</View>

				<ScrollView>
					<View style={styles.modalDetail}>
						{props.modelData &&
							props.modelData.map((m, index) => (
								<TouchableOpacity
									onPress={() => {
										props.onSelected(m.model);
									}}
									key={m.id}
								>
									<View style={styles.modalDetailWrap}>
										<Text
											style={{
												fontWeight: 'bold',
											}}
										>
											{m.model}
										</Text>
									</View>
								</TouchableOpacity>
							))}
					</View>
				</ScrollView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalWrapper: {
		paddingHorizontal: 20,
		marginTop: 20,
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
	modalDetail: {
        paddingTop: 10,
		paddingBottom: 70,
	},
	modalDetailWrap: {
		paddingVertical: 25,
		paddingHorizontal: 2,
		borderBottomWidth: 1,
		borderBottomColor: '#ECECEC',
	},
	
	modalContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#000',
	},
});

export default MyModel;
