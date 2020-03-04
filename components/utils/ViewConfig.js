import React from 'react';
import {
    Item,
    Input,
    Label,

    View,
   
} from 'native-base';


const axios = require('axios');

inputFieldsMapper = (config) => {
    return (
        <Item floatingLabel key={config.name}>
            <Label>{config.title}</Label>
            <Input
                secureTextEntry={config.secureTextEntry}
                onChangeText={config.props.handleChange(config.name)}
                value={(config.props && config.props.values[config.name]) || ''}
                name={config.name}
                keyboardType={config.keyboardType}
            />
        </Item>
    );
};

export const inputView = ConfigArr => {
    return ConfigArr.map((each, id) => (
        <View key={id} style={{ padding: 5 }}>
            {inputFieldsMapper(each)}
        </View>
    ));
};
