import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';

import Routes from './navigation/routes';
import { Provider as PaperProvider } from 'react-native-paper';
import { Root } from 'native-base';

import { AppLoading, SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { View } from 'react-native';
import { Spinner, Text } from 'native-base';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		isSplashReady: false,
		isAppReady: false,
	};

	_cacheResourcesAsync = async () => {
		SplashScreen.hide();
		await loadResourcesAsync();
		this.setState({ isSplashReady: true });
	};

	render() {
		if (!this.state.isSplashReady) {
			return (
				<AppLoading
					startAsync={this._cacheResourcesAsync}
					onError={handleLoadingError}
					onFinish={() => {
						// this.setState({ isSplashReady: true });
					}}
					autoHideSplash={false}
				/>
			);
		}
		return (
			<View style={{ flex: 1 }}>
				<Root>
					<PaperProvider>
						<Routes />
					</PaperProvider>
				</Root>
				{/* <Text> WOrking</Text> */}
			</View>
		);
	}
}

async function loadResourcesAsync() {
	await Promise.all([
		Font.loadAsync({
			// This is the font that we are using for our tab bar
			// We include SpaceMono because we use it in HomeScreen.js. Feel free to
			// remove this if you are not using it in your app
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			NotoSerif: require('./assets/NotoSerifDevanagari-Regular.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			...Ionicons.font,
		}),
	]);
}

function handleLoadingError(error) {
	// In this case, you might want to report the error to your error reporting
	// service, for example Sentry
	console.warn(error);
}
