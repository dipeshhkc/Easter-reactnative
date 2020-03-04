import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Button,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { Form, Spinner } from 'native-base';
import { generateJSX } from '../components/utils/Views';
import { dropdownFormat } from '../components/utils/generals';
import { modelCollection, parameter } from '../components/utils/config';
import MyFormik from '../components/myFormik';

class ModalSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    setStateFromOtherFile = (option, value) => {
        this.setState({ [option]: value });
    };

    componentDidMount = () => {
        console.log(this.props.navigation);
        dropdownFormat(
            modelCollection,
            'modelOption',
            this.setStateFromOtherFile
        );
    };

    // initial = this.props.location.state && {
    //     ...this.props.location.state.initial,
    // };

    // id = this.initial && this.initial.id;
    // Furl = '/monitor-setup';
    // Burl = this.id ? `setup/Monitor/${this.id}` : 'setup/Monitor'
    Burl = 'http://batas.simriksacos.com.np/public/api/vehiclemodel';
    default = {};

    // prepareFormGroup = FormGroup => <Content>{FormGroup}</Content>;

    //Grouping form input according to 'row' property
    generateForm = (values, handleChange, setFieldValue) => {
        let FormGroup = [];
        return parameter.map(each => {
            if (each.default != '') {
                this.default[each.id] = each.default;
            }
            // if (each.row) {
            //     let TempFormGroup = [...FormGroup];
            //     FormGroup = [];
            //     FormGroup.push(
            return generateJSX(
                each.type,
                each.name,
                each.name,
                each.id,
                values,
                handleChange,
                each.icon,
                each.iconType,
                setFieldValue,
                each.id
            );
            // );
            // if (TempFormGroup.length != 0) {
            //     return this.prepareFormGroup(TempFormGroup);
            // }
            // } else {
            //     FormGroup.push(
            //         generateJSX(
            //             each.type,
            //             each.name,
            //             each.name,
            //             each.id,
            //             values,
            //             handleChange,
            //             each.icon,
            //             setFieldValue
            //         )
            //     );
            // }
        });
    };

    render() {
        let ModelSetupFormComponent = props => {
            const {
                handleChange,
                values,
                errors,
                touched,
                handleSubmit,
                setFieldValue,
                isSubmitting
            } = props.props;
            return (
                <View style={styles.screen}>
                    <Form>
                        <Text style={styles.title}>Model :</Text>
                        {generateJSX(
                            'dropdown',
                            'Model',
                            'Select Model',
                            'model',
                            values,
                            handleChange,
                            null, //for icon
                            null, //for icon
                            setFieldValue,
                            this.state.modelOption
                        )}
                        <Text>{'\n'}</Text>
                        <Text style={styles.title}>MRP Parameters :</Text>
                        <View>
                            {this.generateForm(
                                values,
                                handleChange,
                                setFieldValue
                            )}
                        </View>
                        <Text>{'\n'}</Text>
                       {isSubmitting&& <Spinner color='green' />}
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            title="Submit"
                            onPress={handleSubmit}
                            color={'#0c4ca3'}
                            style={{ fontWeight: 'bold' }}
                        />
                    </Form>
                </View>
            );
        };
        return (
            <KeyboardAvoidingView behavior="padding">
                <ScrollView>
                    <View style={styles.screen}>
                        <MyFormik
                            history={this.props.history}
                            navigation={this.props.navigation}
                            Furl={this.Furl}
                            Burl={this.Burl}
                            process={true}
                            initial={{...this.default,model:'10.90 L 3X2 SCL BUS'}}
                        >
                            {props => <ModelSetupFormComponent props={props} />}
                        </MyFormik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        margin: 10,
        padding: 5,
        backgroundColor: '#fff',
    },
    screen2: {
        marginVertical: 10,
        paddingVertical: 5,
    },
    title: {
        fontSize: 16,
        paddingBottom: 5,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: '#0c4ca3',
    },
});

export default ModalSetup;
