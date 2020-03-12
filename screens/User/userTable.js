import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { DataTable } from 'react-native-paper';

class UserTable extends Component {
	state = {
		currentPage: 0,
	};

	onPageChange = val => {
		this.setState({ currentPage: val });
	};

	render() {
		return (
			<View style={styles.screen}>
				<DataTable>
					<DataTable.Header>
						<DataTable.Title style={styles.text}>Username</DataTable.Title>
					</DataTable.Header>

					{this.props.data.map((row, index) => (
						<TouchableHighlight key={index} onPress={() => this.props.clicked(row)}>
							<DataTable.Row>
								<DataTable.Cell style={styles.text1}>{row.name}</DataTable.Cell>
							</DataTable.Row>
						</TouchableHighlight>
					))}

					{/* <DataTable.Pagination
						page={this.state.currentPage}
						rows={10}
						numberOfPages={this.props.data.length / 10}
						onPageChange={page => {
							this.onPageChange(page);
						}}
						label={`${this.state.currentPage} of 3`}
					/> */}
				</DataTable>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	screen: {
		paddingVertical: 20,
	},
	iconWrappper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	text: {
		justifyContent: 'center',
		fontSize: 18,
		color: '#000',
	},
	text1: {
		justifyContent: 'center',
		fontSize: 12,
	},
});

export default UserTable;
