'use strict';

import React, {
  Component,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ToastAndroid,
  AsyncStorage
} from 'react-native';

import styles from './Style';
import api, {host, key} from './Server';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
           email: undefined,
        password: undefined,
            role: 0
      },
      loading: false
    };
  }

  render() {
    let fields = [
      {ref: 'email', placeholder: 'Email', keyboardType: 'email-address', secureTextEntry: false},
      {ref: 'password', placeholder: 'Password', keyboardType: 'default', secureTextEntry: true},
    ];

    return(
      <ScrollView ref={'loginForm'} {...this.props}>
        <Text style={styles.title}>LOGIN</Text>
        <View key={'email'}>
          <TextInput {...fields[0]} onFocus={() => this.onFocus({...fields[0]})} onChangeText={(text) => this.state.data.email = text} />
        </View>
        <View key={'password'}>
          <TextInput {...fields[1]} onFocus={() => this.onFocus({...fields[1]})} onChangeText={(text) => this.state.data.password = text} />
        </View>
        <TouchableHighlight style={this.state.loading ? styles.buttonDisabled : styles.button} underlayColor={'#2bbbad'} onPress={() => this.onSubmit()}>
          <Text style={styles.buttonText}>{this.state.loading ? 'Please Wait . . .' : 'Submit'}</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  onFocus(argument) {
    setTimeout(() => {
      let scrollResponder = this.refs.loginForm.getScrollResponder();
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            React.findNodeHandle(this.refs[argument.ref]), 110, true
          );
    }, 50);
  }

  onSubmit() {
    if (this.state.loading) {
      ToastAndroid.show('Please Wait . . .', ToastAndroid.SHORT);
      return null;
    }

    let valid = true;

    Object.keys(this.state.data).map((val, key) => {
      if ([null, undefined, 'null', 'undefined', ''].indexOf(this.state.data[val]) > -1) valid = false;
    });

    if (!valid) return null;

    this.setState({loading: true});

    api.auth.login(this.state.data)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText || response._bodyText);
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        ToastAndroid.show(JSON.stringify(responseData), ToastAndroid.LONG);
        this.onSuccess(responseData).done();
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
      })
      .done(() => {
        this.setState({loading: false});
      });
  }

  async onSuccess(data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
    }
  }
}
