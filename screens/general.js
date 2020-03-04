import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableHighlight,
    TouchableNativeFeedback,
    Dimensions,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { Input, Spinner } from 'native-base';
import { Platform } from 'react-native';
import {
    parameter,
    modelCollection,
    tablePatameter,
    parameterDetail,
} from '../components/utils/config';
import { get } from '../components/services/api';
import { CleaveCurrency, NepaliCurrency } from '../components/utils/NepaliCurrency';

class General extends Component {
    state = {
        modalVisible: false,
        detailModal: false,
        busName: '',
        final: '',
        original: '',
        discount: 0,
        tier1val: 0,
        tier2val: 0,
        GeneralData: null,
        Burl: 'http://batas.simriksacos.com.np/public/api/vehiclemodel',
    };

    onModalClick = () => {
        this.setState(prevState => ({ modalVisible: !prevState.modalVisible }));
    };

    onDetailModal = () => {
        this.setState(prevState => ({ detailModal: !prevState.detailModal }));
    };

    onSelected = async val => {
        const { Burl } = this.state;
        let Url = `${Burl}/${val}`;
        this.setState({ loading: true });
        this.setState({ modalVisible: false });
        const { data: GeneralData } = await get(Url);
        let tier1val = GeneralData && GeneralData['tier1'];
        let tier2val = GeneralData && GeneralData['tier2'];
        this.setState({
            GeneralData,
            busName: val,
            modalVisible: false,
            loading: false,
            original: GeneralData && GeneralData['discussedMRP'],
            final: GeneralData && GeneralData['discussedMRP'],
            tier1val,
            tier2val
        });
    };

    handleDiscount = val => {
        const { original, GeneralData } = this.state;
        let newFinal;
        let tier1val;
        let tier2val;
        if (val) {
            newFinal = original - Number(val);
            tier1val = Number(GeneralData['tier1']) + Number(val);
            tier2val = Number(GeneralData['tier2']) + Number(val);
        } else {
            newFinal = original;
            tier1val = GeneralData['tier1'];
            tier2val = GeneralData['tier2'];
        }
        this.setState({ final: newFinal, discount: val, tier1val,tier2val });
    };

    render() {
        const { GeneralData, final, discount,tier1val,tier2val } = this.state;

        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 80;
        return (
            <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <ScrollView>
                    <View style={styles.container}>
                        <TouchableHighlight
                            style={styles.th1}
                            onPress={() => {
                                this.onModalClick();
                            }}
                        >
                            <Text style={styles.modalButton}>Select Model</Text>
                        </TouchableHighlight>
                        {GeneralData ? (
                            <View>
                                <View style={styles.table}>
                                    <View style={styles.thead}>
                                        <View style={styles.tr}>
                                            <Text style={styles.th}>
                                                Details
                                            </Text>
                                            <Text style={styles.th}>
                                                {this.state.busName ||
                                                    'Bus Name'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tbody}>
                                        {tablePatameter.map(m => (
                                            <View style={styles.tr} key={m.id}>
                                                <Text style={styles.td}>
                                                    {m.name}
                                                </Text>
                                                <Text style={styles.td}>
                                                    {/* {GeneralData[m.id]} */}
                                                    {m.id == 'tier1'
                                                        ? NepaliCurrency(tier1val): m.id=='tier2'?NepaliCurrency(tier2val)
                                                        // : GeneralData[m.id]
                                                        :NepaliCurrency(GeneralData[m.id])
                                                    }
                                                     
                                                </Text>
                                            </View>
                                        ))}
                                        <View style={styles.tr}>
                                            <Text style={{...styles.td,fontWeight:'bold'}}>
                                                Discussed MRP
                                            </Text>
                                            <Text style={styles.td}>
                                                {NepaliCurrency(final)}
                                            </Text>
                                        </View>
                                        <View style={styles.tr}>
                                            <Text style={styles.td}>
                                                IMPACT (Positive/Negative)
                                            </Text>
                                            <Text style={styles.td}>
                                                {`(${NepaliCurrency(discount)})`}
                                            </Text>
                                        </View>
                                        <View style={styles.tr}>
                                            <Text style={styles.td}>
                                                Discount
                                            </Text>
                                            <View
                                                style={{
                                                    ...styles.td,
                                                    paddingBottom: 0,
                                                    paddingTop: 4,
                                                }}
                                            >
                                                <TextInput
                                                    name={'discount'}
                                                    style={styles.input}
                                                    keyboardType="numeric"
                                                    onChangeText={text => {
                                                        this.handleDiscount(
                                                            text
                                                        );
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <TouchableHighlight
                                    style={styles.th1}
                                    onPress={() => {
                                        this.onDetailModal();
                                    }}
                                >
                                    <Text style={styles.modalButton}>
                                        More Details
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        ) : (
                            <View>
                                {!this.state.loading && (
                                    <Text style={styles.notAvailableText}>
                                        Data Not Available.Please Select Another
                                        Model
                                    </Text>
                                )}
                                {this.state.loading && (
                                    <Spinner color="green" />
                                )}
                            </View>
                        )}
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                this.onModalClick();
                            }}
                        >
                            <View style={styles.modalWrapper}>
                                <View style={styles.modalContainer}>
                                    <TouchableNativeFeedback
                                        onPress={() => {
                                            this.onModalClick();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...styles.modalButton,
                                                backgroundColor: 'red',
                                                width: '20%',
                                                marginBottom: 10,
                                            }}
                                        >
                                            Close
                                        </Text>
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={styles.modalDetail}>
                                    <ScrollView>
                                        {modelCollection &&
                                            modelCollection.map((m, index) => (
                                                <TouchableNativeFeedback
                                                    onPress={() => {
                                                        this.onSelected(m);
                                                    }}
                                                    key={index}
                                                >
                                                    <View
                                                        style={
                                                            styles.modalDetailWrap
                                                        }
                                                    >
                                                        <Text
                                                            style={{
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            {m}
                                                        </Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>

                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.detailModal}
                            onRequestClose={() => {
                                this.onDetailModal();
                            }}
                        >
                            <View style={styles.detailmodalWrapper}>
                                <ScrollView>
                                    <TouchableNativeFeedback
                                        onPress={() => {
                                            this.onDetailModal();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...styles.modalButton,
                                                backgroundColor: 'red',
                                                width: '20%',
                                                marginBottom: 10,
                                                marginLeft: 10,
                                            }}
                                        >
                                            Close
                                        </Text>
                                    </TouchableNativeFeedback>
                                    {GeneralData && (
                                        <View style={styles.table}>
                                            <View style={styles.thead}>
                                                <View style={styles.tr}>
                                                    <Text
                                                        style={{
                                                            ...styles.th,
                                                            width: '33.33%',
                                                        }}
                                                    >
                                                        Details
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            ...styles.th,
                                                            width: '33.33%',
                                                        }}
                                                    >
                                                        CUR / %
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            ...styles.th,
                                                            width: '33.33%',
                                                        }}
                                                    >
                                                        {this.state.busName ||
                                                            'Model Name'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.tbody}>
                                                {parameterDetail.map(m => (
                                                    <View
                                                        style={styles.tr}
                                                        key={m.id}
                                                    >
                                                        <Text
                                                            style={{
                                                                ...styles.td,
                                                                width: '33.33%',
                                                            }}
                                                        >
                                                            {m.name}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                ...styles.td,
                                                                width: '33.33%',
                                                            }}
                                                        >
                                                            {GeneralData[
                                                                `${m.id}V`
                                                            ]
                                                                ? GeneralData[
                                                                      m.id
                                                                  ]
                                                                : m.id ==
                                                                  'exRate'
                                                                ? GeneralData[
                                                                      'exRate'
                                                                  ]
                                                                : ' '}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                ...styles.td,
                                                                width: '33.33%',
                                                            }}
                                                        >
                                                            {GeneralData[
                                                                `${m.id}V`
                                                            ]
                                                                ? NepaliCurrency(GeneralData[
                                                                      `${m.id}V`
                                                                  ])
                                                                : m.id == 'exRate'
                                                                ? NepaliCurrency(GeneralData[
                                                                      'npr'
                                                                  ])
                                                                : NepaliCurrency(GeneralData[
                                                                      m.id
                                                                  ])}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                </ScrollView>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    table: {
        marginHorizontal: 10,
        marginBottom: 10,
        borderLeftWidth: 1,
        borderLeftColor: '#ECECEC',
        borderTopWidth: 1,
        borderTopColor: '#ECECEC',
        borderRadius: 2,
    },
    thead: {
        textAlign: 'left',
    },
    tr: {
        flexDirection: 'row',
    },
    th: {
        fontWeight: 'bold',
        width: '50%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ECECEC',
        borderRightWidth: 1,
        borderRightColor: '#ECECEC',
    },
    th1: {
        width: Dimensions.get('window').width - 20,
        margin: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ECECEC',
        // borderRightWidth: 1,
        // borderRightColor: '#ECECEC',
    },
    td: {
        textAlign: 'left',
        width: '50%',
        padding: 10,
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#ECECEC',
        borderRightWidth: 1,
        borderRightColor: '#ECECEC',
    },
    modalButton: {
        backgroundColor: '#0c4ca3',
        color: '#fff',
        textAlign: 'center',
        borderRadius: 5,
        padding: 11,
        justifyContent: 'center',
        alignItems: 'center',
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    modalWrapper: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    detailmodalWrapper: {
        marginTop: 20,
    },
    modalContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    modalDetail: {
        paddingVertical: 10,
    },
    modalDetailWrap: {
        paddingVertical: 25,
        paddingHorizontal: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#ECECEC',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        margin: 0,
    },
    notAvailableText: {
        paddingVertical: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default General;
