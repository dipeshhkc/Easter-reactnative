import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableHighlight, Dimensions, Modal, Button } from 'react-native';
import { Formik } from 'formik';
import { Input, Label, Form, Item, Spinner, Picker, Icon } from 'native-base';
import UserTable from './userTable';
import { getUser, AddUser, deleteUser } from '../../components/services/addUserService';

class UserSetup extends Component {
    state = {
        data: {
            id:'',
            name: '',
            email: '',
            password: '',
            role: ''
        },
        UserData: [],
        errors: {},
        modalVisible: false,
        loading: true,
        isEdit: false,
        dataResponse: false,
    };

    async componentDidMount() {
        try {
            const { data: UserData } = await getUser();
            this.setState(prevState => ({ UserData:UserData.data, loading: !prevState.loading }));
        } catch (err) {
            this.setState({ errors: err });
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.dataResponse !== prevState.dataResponse) {
            const { data: UserData } = await getUser();
            this.setState({ UserData: UserData.data, loading: false });
        }
    }

    onModalClick = () => {
        this.setState(prevState => ({
            modalVisible: !prevState.modalVisible,
            data: {
                id:'',
                name: '',
                email: '',
                password: '',
                role: ''
            },
            isEdit: false,
            dataResponse: !prevState.dataResponse,
        }));
    };

    handleEdit = object => {
        this.setState(prevState => ({
            data: this.mapToViewModal(object),
            modalVisible: !prevState.modalVisible,
            isEdit: true,
        }));
    };

    mapToViewModal(adv) {
        return {
            id: adv.id,
            name: adv.name,
            email: adv.email,
            password: adv.password,
            role: adv.role
        };
    }

    handleDelete = async user => {
        const originalUserData = this.state.UserData;
        const UserData = originalUserData.filter(m => m.id !== user.id);
        this.setState({ UserData });

        try {
            await deleteUser(user.id);
            this.setState(prevState => ({ modalVisible: false, dataResponse: !prevState.dataResponse, loading: !prevState.loading }));
            alert('This User is deleted successfully.');
        } catch (ex) {
            if (ex.response && ex.response.status === 404) alert('This User has already been deleted.');
            this.setState({ UserData: originalUserData });
        }
    };

    render() {
        const { loading, UserData, isEdit } = this.state;
        return (
            <View style={styles.screen}>
                {loading ? (
                    <View style={styles.mainscreen}>
                        <ActivityIndicator size={40} color={'#0c4ca3'} />
                    </View>
                ) : (
                        <ScrollView>
                            <TouchableHighlight
                                style={styles.th1}
                                onPress={() => {
                                    this.onModalClick();
                                }}
                            >
                                <Text style={styles.modalButton}>Add User</Text>
                            </TouchableHighlight>
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
                                        <TouchableHighlight
                                            onPress={() => {
                                                this.onModalClick();
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...styles.modalButton,
                                                    backgroundColor: 'red',
                                                    width: '100%',
                                                    marginBottom: 10,
                                                }}
                                            >
                                                Close
										</Text>
                                        </TouchableHighlight>
                                        {isEdit && (
                                            <TouchableHighlight
                                                onPress={() => {
                                                    this.handleDelete(this.state.data);
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        ...styles.modalButton,
                                                        backgroundColor: 'red',
                                                        width: '100%',
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    Delete
											</Text>
                                            </TouchableHighlight>
                                        )}
                                    </View>
                                    <Formik
                                        initialValues={this.state.data}
                                        enableReinitialize={true}
                                        onSubmit={async (values, actions) => {
                                            actions.setSubmitting(true);

                                            try {
                                                const response = await AddUser(values, isEdit);
                                                if (response.data.error) throw new Error(response.data.error);
                                                else {
                                                    if (isEdit) {
                                                        alert('Edited successfully!');
                                                    } else {
                                                        alert('Added successfully!');
                                                    }
                                                    this.onModalClick();
                                                }
                                                actions.resetForm();
                                                actions.setSubmitting(false);
                                            } catch (ex) {
                                                if (ex.response && ex.response.status === 404) {
                                                    alert('Something went wrong.');
                                                } else {
                                                    this.setState({
                                                        AddUserErrors: ex,
                                                    });
                                                }
                                                actions.setSubmitting(false);
                                            }
                                        }}
                                    >
                                        {({ isSubmitting, handleBlur, setFieldValue, values, errors, touched, handleSubmit, handleChange, handleReset }) => (
                                            <View style={styles.modalDetail}>
                                                <Form>
                                                    <Item
                                                        floatingLabel
                                                        style={{
                                                            paddingVertical: 5,
                                                        }}
                                                    >
                                                        <Label>{'Username'}</Label>
                                                        <Input
                                                            name={'name'}
                                                            value={values.name}
                                                            style={styles.input}
                                                            onChangeText={text => {
                                                                setFieldValue('name', text);
                                                            }}
                                                        />
                                                    </Item>
                                                    <Item
                                                        floatingLabel
                                                        style={{
                                                            paddingVertical: 5,
                                                        }}
                                                    >
                                                        <Label>{'Email'}</Label>
                                                        <Input
                                                            name={'email'}
                                                            keyboardType={'email-address'}
                                                            value={values.email}
                                                            style={styles.input}
                                                            onChangeText={text => {
                                                                setFieldValue('email', text);
                                                            }}
                                                        />
                                                    </Item>
                                                    <Item
                                                        floatingLabel
                                                        style={{
                                                            paddingVertical: 5,
                                                        }}
                                                    >
                                                        <Label>{'Password'}</Label>
                                                        <Input
                                                            name={'password'}
                                                            secureTextEntry={true}
                                                            value={values.password}
                                                            style={styles.input}
                                                            onChangeText={text => {
                                                                setFieldValue('password', text);
                                                            }}
                                                        />
                                                    </Item>
                                                    <Item picker>
                                                        <Picker
                                                            mode="dropdown"
                                                            iosIcon={<Icon name="arrow-down" />}
                                                            style={{ marginTop: 15}}
                                                            placeholderIconColor="#007aff"
                                                            value={values.role}
                                                            selectedValue={values.role}
                                                            onValueChange={e => {
                                                                setFieldValue('role', e);
                                                            }}
                                                        >
                                                            <Picker.Item label="Select Role" value="" />
                                                            <Picker.Item label="Admin" value="admin" />
                                                            <Picker.Item label="User" value="user" />
                                                        </Picker>
                                                    </Item>
                                                    <View
                                                        style={{
                                                            marginTop: 20,
                                                        }}
                                                    >
                                                        {isSubmitting && <Spinner color="green" />}
                                                        <Button
                                                            disabled={isSubmitting}
                                                            type="submit"
                                                            title="Submit"
                                                            onPress={handleSubmit}
                                                            color={'#0c4ca3'}
                                                            style={{
                                                                fontWeight: 'bold',
                                                                marginTop: 20,
                                                            }}
                                                        />
                                                    </View>
                                                </Form>
                                            </View>
                                        )}
                                    </Formik>
                                </View>
                            </Modal>
                            <UserTable data={UserData} clicked={row => this.handleEdit(row)} />
                        </ScrollView>
                    )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainscreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screen: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
    },
    errors: {
        textAlign: 'left',
        backgroundColor: '#ff0000e6',
        padding: 15,
        borderRadius: 5,
        fontWeight: 'bold',
        color: '#fff',
    },
    button: {
        width: Dimensions.get('window').width - 20,
        margin: 10,
    },
    modalWrapper: {
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#fff',
    },
    detailmodalWrapper: {
        marginTop: 20,
    },
    modalContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#d2d0d0',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalDetail: {
        paddingVertical: 5,
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
});

export default UserSetup;
