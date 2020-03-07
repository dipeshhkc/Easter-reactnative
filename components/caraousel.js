import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

import { SliderBox } from 'react-native-image-slider-box';

export const Caraousel = props => {
	return (
		<View style={styles.screen}>
			<SliderBox
				images={props.images}
				sliderBoxHeight={200}
				onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
				dotColor="#a72331"
				inactiveDotColor="#90A4AE"
				paginationBoxVerticalPadding={20}
				autoplay
				circleLoop
				resizeMethod={'resize'}
				resizeMode={'cover'}
				paginationBoxStyle={{
					position: 'absolute',
					bottom: 0,
					padding: 0,
					alignItems: 'center',
					alignSelf: 'center',
					justifyContent: 'center',
					paddingVertical: 30,
				}}
				dotStyle={{
					width: 10,
					height: 10,
					borderRadius: 5,
					marginHorizontal: 0,
					padding: 0,
					margin: 0,
					backgroundColor: '#a72331',
				}}
				ImageComponentStyle={styles.ImageCom}
				imageLoadingColor="#a72331"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	ImageCom: {
		borderRadius: 10,
		maxWidth: Dimensions.get('window').width - 40,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginBottom: 20,
	},
});
