import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableNativeFeedback,
} from 'react-native';
import { MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';

class Home extends Component {
    state = {};

    navigationMain = name => {
        this.props.navigation.navigate(name);
    };

    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.homewrap}>
                    <TouchableNativeFeedback
                        onPress={() => this.navigationMain('SetupModal')}
                    >
                        <View style={styles.homeMain}>
                            <View style={styles.IconWrap}>
                                <Feather
                                    name="settings"
                                    size={25}
                                    color={'#fff'}
                                    style={styles.Icons}
                                />
                            </View>
                            <Text style={styles.TextWrap}>Setup</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={() => this.navigationMain('ModalCreate')}
                    >
                        <View style={styles.homeMain}>
                            <View style={styles.IconWrap}>
                                <MaterialCommunityIcons
                                    name="table-edit"
                                    size={25}
                                    color={'#fff'}
                                    style={styles.Icons}
                                />
                            </View>
                            <Text style={styles.TextWrap}>Model Create</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={styles.homewrap}>
                    <TouchableNativeFeedback
                        onPress={() => this.navigationMain('ViewScreen')}
                    >
                        <View style={styles.homeMain}>
                            <View style={styles.IconWrap}>
                                <MaterialCommunityIcons
                                    name="table-search"
                                    size={25}
                                    color={'#fff'}
                                    style={styles.Icons}
                                />
                            </View>
                            <Text style={styles.TextWrap}>
                                {'Search & View'}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={() => this.navigationMain('SetupModal')}
                    >
                        <View style={styles.homeMain}>
                            <View style={styles.IconWrap}>
                                <AntDesign
                                    name="infocirlce"
                                    size={25}
                                    color={'#fff'}
                                    style={styles.Icons}
                                />
                            </View>
                            <Text style={styles.TextWrap}>Setting</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#efefef',
        padding: 20,
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
        paddingVertical: 10,
    },
    homeMain: {
        width: Dimensions.get('window').width / 2 - 30,
        height: Dimensions.get('window').height / 5,
        backgroundColor: '#fff',
        marginRight: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    IconWrap: {
        backgroundColor: '#0c4ca3',
        height: 60,
        width: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    TextWrap: {
        marginTop: 20,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#666',
    },
});

export default Home;
