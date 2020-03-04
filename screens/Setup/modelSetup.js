import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ModelSetup extends Component {
    state = {};

    render() {
        return (
            <View style={styles.screen}>
                <Text>Modal Setup</Text>
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

export default ModelSetup;
