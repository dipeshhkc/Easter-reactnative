import { Item, Input, Label, Picker, Icon } from 'native-base';
import React from 'react';
import { Text } from 'react-native';

export const generateJSX = (type, label, placeholder, name, values, handleChange, icon = null, iconType = null, setFieldValue = null, options = null,ind) => {
	switch (type) {
		case 'value':
			return (
				<Item floatingLabel key={ind}>
					<Label>{label}</Label>
					<Input
						name={name}
						keyboardType="numeric"
						value={values[name]}
						onChangeText={text => {
							setFieldValue(name, text);
						}}
					/>
				</Item>
			);
		case 'icon':
			return (
				<Item floatingLabel key={ind}>
					<Label>
						<Text>{label}</Text>
						(
						<Icon style={{ fontSize: 14, marginLeft: 5 }} name={icon} type={iconType} />)
					</Label>
					<Input
						name={name}
						keyboardType="numeric"
						value={values[name]}
						onChangeText={text => {
							setFieldValue(name, text);
						}}
					/>
				</Item>
			);
		// case 'dropdown':
		//     return (
		//         <Item picker>
		//             <Picker
		//                 mode="dropdown"
		//                 iosIcon={<Icon name="arrow-down" />}
		//                 style={{ width: undefined }}
		//                 placeholder="Select your SIM"
		//                 placeholderStyle={{ color: '#bfc6ea' }}
		//                 placeholderIconColor="#007aff"
		//                 selectedValue={values[name]}
		//                 onValueChange={e => {
		//                     setFieldValue(name, e);
		//                 }}
		//             >
		//                 {options &&
		//                     options.map(m => (
		//                         <Picker.Item
		//                             label={m.text}
		//                             value={m.value}
		//                             key={m.id}
		//                         />
		//                     ))}
		//             </Picker>
		//         </Item>
		//     );
		default:
			break;
	}
};
