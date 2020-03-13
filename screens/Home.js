import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { MaterialCommunityIcons, Feather, AntDesign, Entypo } from '@expo/vector-icons';
import { logout } from '../components/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentDate } from '../components/utils/dateUtils';
const logo = require('../assets/easter.png');

class Home extends Component {
	static navigationOptions = () => ({
		headerShown: false,
	});

	constructor(props) {
		super(props);

		this.state = {
			Role: '',
		};
	}

	month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	async componentDidMount() {
		const value = await AsyncStorage.getItem('user');
		if (value != null) {
			this.setState({ Role: JSON.parse(value).role });
		}
	}

	navigationMain = name => {
		this.props.navigation.navigate(name);
	};

	render() {
		const { Role } = this.state;
		return (
			<View style={styles.main} colors={'#cdcdcd'}>
				<View style={styles.upperPart}>
					<View style={styles.upperPartOne}>
						<View>
							<Text style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'NotoSerif', alignSelf: 'flex-start', letterSpacing: 2, fontSize: 25, justifyContent: 'center', marginTop: 10 }}>
								EASTERN
							</Text>
						</View>
						<View>
							<TouchableOpacity style={styles.iconContainer} onPress={() => logout(this.props.navigation)}>
								<Entypo name="log-out" size={25} color={'#fff'} style={styles.Icons} />
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.upperPartTwo}>
						<Image style={styles.upperPartTwoImg} source={logo} resizeMode={'contain'} />
						<View style={styles.upperPartTwoText}>
							<Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold', fontFamily: 'NotoSerif', marginBottom: 30, color: '#1D4CBC' }}>
								एक एक रुपैया को अर्थ छ,
								<Text>{'\n'}</Text>
								मेरो कम्पनी र मेरो परिवारको लागि।{' '}
							</Text>
							<Text
								style={{
									textAlign: 'left',
									paddingRight: 10,
									// fontStyle: 'italic',
									fontSize: 15,
									fontWeight: 'bold',
									fontFamily: 'NotoSerif',
									position: 'absolute',
									bottom: 10,
									left: 5,
									color: '#F24639',
								}}
							>
								{getCurrentDate()}
							</Text>
							<Text
								style={{
									textAlign: 'right',
									paddingRight: 10,
									// fontStyle: 'italic',
									fontSize: 15,
									fontWeight: 'bold',
									fontFamily: 'NotoSerif',
									position: 'absolute',
									bottom: 10,
									right: 5,
									color: '#F24639',
								}}
							>
								{`${this.month[new Date().getMonth()]} ${new Date().getDate()}, ${new Date().getFullYear()}`}
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.lowerPart}>
					{Role === 'admin' && (
						<View style={styles.homewrap}>
							<TouchableHighlight activeOpacity={0.5} underlayColor={'#f9e8ea'} style={styles.cardHighlight} onPress={() => this.navigationMain('SetupModal')}>
								<View style={styles.homeMain}>
									<View style={styles.IconWrap}>
										<Feather name="settings" size={35} color={'#fff'} style={styles.Icons} />
									</View>
									<Text style={styles.TextWrap}>CIF Price Center</Text>
								</View>
							</TouchableHighlight>

							<TouchableHighlight activeOpacity={0.5} underlayColor={'#f9e8ea'} style={styles.cardHighlight} onPress={() => this.navigationMain('ModalCreate')}>
								<View style={styles.homeMain}>
									<View style={styles.IconWrap}>
										<MaterialCommunityIcons name="table-edit" size={35} color={'#fff'} style={styles.Icons} />
									</View>
									<Text style={styles.TextWrap}>Model Parameter</Text>
								</View>
							</TouchableHighlight>
						</View>
					)}
					<View style={styles.homewrap}>
						<TouchableHighlight activeOpacity={0.5} underlayColor={'#f9e8ea'} style={styles.cardHighlight} onPress={() => this.navigationMain('ViewScreen')}>
							<View style={styles.homeMain}>
								<View style={styles.IconWrap}>
									<MaterialCommunityIcons name="table-search" size={35} color={'#fff'} style={styles.Icons} />
								</View>
								<Text style={styles.TextWrap}>Search</Text>
							</View>
						</TouchableHighlight>

						{Role === 'admin' && (
							<TouchableHighlight activeOpacity={0.5} underlayColor={'#f9e8ea'} style={styles.cardHighlight} onPress={() => this.navigationMain('AddUser')}>
								<View style={styles.homeMain}>
									<View style={styles.IconWrap}>
										<AntDesign name="adduser" size={35} color={'#fff'} style={styles.Icons} />
									</View>
									<Text style={styles.TextWrap}>Create User</Text>
								</View>
							</TouchableHighlight>
						)}
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	main: {
		// paddingBottom: 50,
		flex: 1,
	},
	upperPart: {
		flex: 1,
	},
	lowerPart: {
		flex: 1,
	},

	upperPartOne: {
		backgroundColor: '#1D4CBC',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		flex: 2,
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 30,
		paddingHorizontal: 10,
		// alignItems: 'flex-end',
	},
	upperPartTwo: {
		flex: 3,
		width: '95%',
		backgroundColor: '#fff',
		justifyContent: 'space-around',
		alignSelf: 'center',
		marginTop: -80,
		marginBottom: 20,
		borderRadius: 10,
		padding: 10,
		// shadowColor: '#999',

		// shadowOffset: {
		// 	width: 0,
		// 	height: 12,
		// },
		// shadowOpacity: 0.9,
		// shadowRadius: 16.0,
		// elevation: 2,
		// borderRadius: 20,
	},

	upperPartTwoImg: {
		// justifyContent:'flex-start',
		alignSelf: 'center',
		height: 70,
		flex: 1,
	},
	upperPartTwoText: {
		padding: 10,
		flex: 1,
		position: 'relative',
	},

	title: {
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 0.5,
		paddingBottom: 5,
		color: '#000000bf',
	},
	homewrap: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 10,
	},
	homeMain: {
		width: Dimensions.get('window').width / 2 - 30,
		height: Dimensions.get('window').height / 5,
		backgroundColor: '#fff',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		// shadowColor: '#999',
		// shadowOffset: {
		// 	width: 0,
		// 	height: 12,
		// },
		// shadowOpacity: 0.58,
		// shadowRadius: 16.0,
		// elevation: 2,

		// backgroundColor:'#1D4CBC'
	},
	IconWrap: {
		backgroundColor: '#b80f0a',
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
		width: 60,
		height: 60,
	},
	TextWrap: {
		marginTop: 8,
		textTransform: 'uppercase',
		fontSize: 13,
		// flex:1,
		fontWeight: 'bold',
		textAlign: 'center',
		letterSpacing: 1,
		color: '#666',
		width: '100%',
		// color:'white'
	},
	iconContainer: {
		color: '#fff',
		paddingTop: 15,
		width: 50,
		height: 50,
		marginBottom: 10,
		justifyContent: 'flex-start',
	},
	cardHighlight: {
		borderRadius: 20,
		marginBottom: 15,
	},
});

export default Home;
