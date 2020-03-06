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
import { Platform, AsyncStorage } from 'react-native';
import {
    parameter,
    modelCollection,
    tablePatameter,
    parameterDetail,
} from '../components/utils/config';
import { get } from '../components/services/api';
import {
    CleaveCurrency,
    NepaliCurrency,
} from '../components/utils/NepaliCurrency';

class General extends Component {
    state = {
        modalVisible: false,
        detailModal: false,
        busName: '',
        discussedMRP: 0,
        suitableMRP: 0,
        Impact:0,
        discount: 0,
        tier1val: 0,
        tier2val: 0,
        originalValues:{},
        GeneralData: null,
        Role: '',
        Burl: 'http://batas.simriksacos.com.np/public/api/vehiclemodel',
    };

    async componentDidMount() {
        const value = await AsyncStorage.getItem('user');
        if (value != null) {
            this.setState({ Role: JSON.parse(value).role });
        }
    }

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

        let tier1val = GeneralData && GeneralData['overhead'];
        let tier2val = GeneralData && GeneralData['withoutOverhead'];
        let suitableMRP = GeneralData && GeneralData['suitableMRP'];
        let discussedMRP = GeneralData && GeneralData['suitableMRP'];

        this.setState({
                GeneralData,
                busName: val,
                modalVisible: false,
                loading: false,
                suitableMRP,
                discussedMRP,
                tier1val,
                tier2val,
                originalValues: {
                        tier1val,
                        tier2val,
                        suitableMRP,
                        discussedMRP,
                },
        });
    };

    handleDiscount = val => {
        const {
            suitableMRP,
            discussedMRP,
            tier1val,
            tier2val,
        } = this.state.originalValues;

        let newFinal;
        let Impact;
        let tier1;
        let tier2;

        if (val) {
            newFinal = Number(suitableMRP) - Number(val);
            Impact = Number(newFinal) - Number(suitableMRP);
            tier1 = Number(tier1val) + Number(Impact);
            tier2 = Number(tier2val) + Number(Impact);
        } else {
            newFinal = Number(discussedMRP);
            Impact = 0;
            tier1 = Number(tier1val);
            tier2 = Number(tier2val);
        }
        this.setState({
            discussedMRP: newFinal,
            discount: val,
            Impact,
            tier1val: tier1,
            tier2val:tier2,
        });
    };

    handleDiscussed = val => {
        const {
            suitableMRP,
            discussedMRP,
            tier1val,
            tier2val,
        } = this.state.originalValues;

        let newFinal;
        let Impact;
        let tier1;
        let tier2;
        let discussed ; 

        if (val) {
            console.log(val)
            newFinal = Number(suitableMRP) - val;
            Impact = val - Number(suitableMRP);
            tier1 = Number(tier1val) + Number(Impact);
            tier2 = Number(tier2val) + Number(Impact);
            discussed = val;
        } else {
            newFinal = 0;
            Impact = 0;
            tier1 = Number(tier1val);
            tier2 = Number(tier2val);
            discussed = Number(discussedMRP);
        }
        this.setState({
            discussedMRP: discussed,
            discount: newFinal,
            Impact,
            tier1val: tier1,
            tier2val:tier2,
        });
    };

    render() {
        const {
            GeneralData,
            discussedMRP,
            discount,
            Impact,
            tier1val,
            tier2val,
            Role
        } = this.state;
        

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
                                    {Role === 'admin' ?(
                                        <View style={styles.tbody}>
                                            {tablePatameter.map(m => (
                                                <View style={styles.tr} key={m.id}>
                                                    <Text style={styles.td}>
                                                        {m.name}
                                                    </Text>
                                                    <Text style={styles.td}>
                                                        {m.id == 'tier1'
                                                            ? NepaliCurrency(
                                                                tier1val
                                                            )
                                                            : m.id == 'tier2'
                                                                ? NepaliCurrency(
                                                                    tier2val
                                                                )
                                                                : NepaliCurrency(
                                                                    GeneralData[m.id]
                                                                )}
                                                    </Text>
                                                </View>
                                            ))}
                                        
                                            <View style={styles.tr}>
                                                <Text style={styles.td}>
                                                    IMPACT (Positive/Negative)
                                            </Text>
                                                <Text style={styles.td}>
                                                    {`(${NepaliCurrency(
                                                        Impact
                                                    )})`}
                                                </Text>
                                            </View>
                                            <View style={styles.tr}>
                                                <Text
                                                    style={{
                                                        ...styles.td,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Discussed MRP
                                            </Text>
                                                <View
                                                    style={{
                                                        ...styles.td,
                                                        paddingBottom: 0,
                                                        paddingTop: 4,
                                                    }}
                                                >
                                                    <TextInput
                                                        name={'final'}
                                                        style={styles.input}
                                                        value={discussedMRP}
                                                        keyboardType="numeric"
                                                        onChangeText={text => {
                                                            this.handleDiscussed(
                                                                text
                                                            );
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.tr}>
                                                <Text style={{
                                                    ...styles.td,
                                                    fontWeight: 'bold',
                                                }}>
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
                                                        value={NepaliCurrency(discount) || 0}
                                                        keyboardType="numeric"
                                                        onChangeText={text => {
                                                            this.handleDiscount(
                                                                text
                                                            );
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </View>)
                                    : (
                                        <View style={styles.tbody}>
                                                <View style={styles.tr}>
                                                    <Text style={styles.td}>
                                                        Invoice value in INR
                                                    </Text>
                                                    <Text style={styles.td}>
                                                        {GeneralData['inr']}
                                                    </Text>
                                                </View>
                                                <View style={styles.tr}>
                                                    <Text style={styles.td}>
                                                        Value in NPR
                                                    </Text>
                                                    <Text style={styles.td}>
                                                        {GeneralData['exRate']}
                                                    </Text>
                                                </View>
                                                <View style={styles.tr}>
                                                    <Text style={styles.td}>
                                                        TIER 2 (NP)
                                                    </Text>
                                                    <Text style={styles.td}>
                                                        {GeneralData['tier2']}
                                                    </Text>
                                                </View>
                                            </View>
                                    )}
                                </View>
                                {Role === 'admin' && 
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
                                }
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

                        {Role === 'admin' &&
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
                                                                    ? NepaliCurrency(
                                                                        GeneralData[
                                                                        `${m.id}V`
                                                                        ]
                                                                    )
                                                                    : m.id ==
                                                                        'exRate'
                                                                        ? NepaliCurrency(
                                                                            GeneralData[
                                                                            'npr'
                                                                            ]
                                                                        )
                                                                        : NepaliCurrency(
                                                                            GeneralData[
                                                                            m.id
                                                                            ]
                                                                        )}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )}
                                    </ScrollView>
                                </View>
                            </Modal>
                        }
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
