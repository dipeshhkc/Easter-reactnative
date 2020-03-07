import React, { Component } from 'react';
import {
        View,
        Text,
        StyleSheet,
        Dimensions,
        TouchableNativeFeedback,
        AsyncStorage
} from 'react-native';
import { MaterialCommunityIcons, Feather, AntDesign, Entypo } from '@expo/vector-icons';
import { logout } from '../components/services/api';
import { Caraousel } from '../components/caraousel';
import { Images } from '../components/utils/config';

class Home extends Component {
        constructor(props) {
                super(props);
                
                this.state = {
                        Role: '',
                //         Images: [
                //                 '../assets/bus/skyline-pro-staff-bus.png',
                //                 '../assets/bus/indian-truck.png',
                //                 '../assets/bus/eicher-school-buses.png',
                //                 '../assets/bus/ambulance.png'
                //       ]  
                };
        }

        static navigationOptions = (navigation) => {
                return {
                        headerRight: () => (
                                <TouchableNativeFeedback onPress={() => logout(navigation.navigation)}>
                                        <View style={styles.iconContainer}>
                                                <Entypo name="log-out" size={25} color={'#fff'} style={styles.Icons} />
                                        </View>
                                </TouchableNativeFeedback>
                        )
                }
        }

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
                        <>
                        <View style={styles.screen}>
                                {Role === 'admin' &&
                                        <View style={styles.homewrap}>
                                                <TouchableNativeFeedback
                                                        onPress={() =>
                                                                this.navigationMain(
                                                                        'SetupModal'
                                                                )
                                                        }
                                                >
                                                        <View style={styles.homeMain}>
                                                                <View
                                                                        style={
                                                                                styles.IconWrap
                                                                        }
                                                                >
                                                                        <Feather
                                                                                name="settings"
                                                                                size={
                                                                                        25
                                                                                }
                                                                                color={
                                                                                        '#fff'
                                                                                }
                                                                                style={
                                                                                        styles.Icons
                                                                                }
                                                                        />
                                                                </View>
                                                                <Text
                                                                        style={
                                                                                styles.TextWrap
                                                                        }
                                                                >
                                                                        CIF Price Center
                                                        </Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                                <TouchableNativeFeedback
                                                        onPress={() =>
                                                                this.navigationMain(
                                                                        'ModalCreate'
                                                                )
                                                        }
                                                >
                                                        <View style={styles.homeMain}>
                                                                <View
                                                                        style={
                                                                                styles.IconWrap
                                                                        }
                                                                >
                                                                        <MaterialCommunityIcons
                                                                                name="table-edit"
                                                                                size={
                                                                                        25
                                                                                }
                                                                                color={
                                                                                        '#fff'
                                                                                }
                                                                                style={
                                                                                        styles.Icons
                                                                                }
                                                                        />
                                                                </View>
                                                                <Text
                                                                        style={
                                                                                styles.TextWrap
                                                                        }
                                                                >
                                                                        Model Parameter
                                                        </Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                        </View>
                                }
                                <View style={styles.homewrap}>
                                        <TouchableNativeFeedback
                                                onPress={() =>
                                                        this.navigationMain(
                                                                'ViewScreen'
                                                        )
                                                }
                                        >
                                                <View style={styles.homeMain}>
                                                        <View
                                                                style={
                                                                        styles.IconWrap
                                                                }
                                                        >
                                                                <MaterialCommunityIcons
                                                                        name="table-search"
                                                                        size={
                                                                                25
                                                                        }
                                                                        color={
                                                                                '#fff'
                                                                        }
                                                                        style={
                                                                                styles.Icons
                                                                        }
                                                                />
                                                        </View>
                                                        <Text
                                                                style={
                                                                        styles.TextWrap
                                                                }
                                                        >
                                                                {
                                                                        'Search & View'
                                                                }
                                                        </Text>
                                                </View>
                                        </TouchableNativeFeedback>
                                        {Role === 'admin' &&
                                                <TouchableNativeFeedback
                                                        onPress={() =>
                                                                this.navigationMain(
                                                                        'AddUser'
                                                                )
                                                        }
                                                >
                                                        <View style={styles.homeMain}>
                                                                <View
                                                                        style={
                                                                                styles.IconWrap
                                                                        }
                                                                >
                                                                        <AntDesign
                                                                                name="adduser"
                                                                                size={
                                                                                        25
                                                                                }
                                                                                color={
                                                                                        '#fff'
                                                                                }
                                                                                style={
                                                                                        styles.Icons
                                                                                }
                                                                        />
                                                                </View>
                                                                <Text
                                                                        style={
                                                                                styles.TextWrap
                                                                        }
                                                                >
                                                                        Create User
                                                        </Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                        }
                                </View>
                                </View>
                                <Caraousel images={Images}/>
                                </>
                );
        }
}

const styles = StyleSheet.create({
        screen: {
                flex: 1,
                backgroundColor: '#efefef',
                padding: 20,
                paddingBottom: 0
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
                backgroundColor: '#b80f0a',
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
        iconContainer: {
                marginRight: 15
        }
});



export default Home;
