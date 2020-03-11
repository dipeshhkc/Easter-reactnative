import React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import CheckUser from '../components/utils/checkUser';

import HomeScreen from '../screens/Home';
import GeneralScreen from '../screens/general';
import ModalSetup from '../screens/modelSetup';

//Setup Screen
import SetupModalScreen from '../screens/Setup/modelSetup';
// import LoginScreen from '../screens/Login/LoginScreen';
import LoginScreen from '../screens/Login/Login';

//Create Screen
import UserSetup from '../screens/User/addUser';

const NavHead = (Name, title) => {
	return {
		screen: Name,
		navigationOptions: {
			headerTitle: title,
		},
	};
};

const Routes = createStackNavigator({
	Home: HomeScreen,
	ModalCreate: NavHead(ModalSetup, 'Model Create'),
	ViewScreen: NavHead(GeneralScreen, 'Search View'),

	//Setup Part
	SetupModal: NavHead(SetupModalScreen, 'Model Setup'),
	AddUser: NavHead(UserSetup, 'User Setup'),
});

const loginSwitch = createSwitchNavigator({
	CheckUser: CheckUser,
	Login: LoginScreen,
	Home: Routes,
});

export default createAppContainer(loginSwitch);
