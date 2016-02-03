'use strict';

import React, {
  Component,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ToastAndroid
} from 'react-native';

import api from './Server';
import styles from './Style';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
                phone: undefined,
        resetPassCode: undefined,
             password: undefined,
            passwordd: undefined,
                 role: 2
      },
      loading: false,
      messages: []
    };
  }

  render() {
    let fields = [
      {ref: 'phone', placeholder: 'Phone Number', keyboardType: 'numeric', secureTextEntry: false, message: '* Phone number cannot be blank'},
      {ref: 'resetPassCode', placeholder: 'Reset Code', keyboardType: 'default', secureTextEntry: false, message: '* Reset Code cannot be blank'},
      {ref: 'password', placeholder: 'Password', keyboardType: 'default', secureTextEntry: true, message: '* Password cannot be blank'},
      {ref: 'passwordd', placeholder: 'Password Confirmation', keyboardType: 'default', secureTextEntry: true, message: '* Password Confirmation cannot be blank'},
    ];

    return(
      <ScrollView ref={'resetForm'} {...this.props}>
        <Text style={styles.title}>RESET PASSWORD</Text>
        <View key={'messages'} style={{marginBottom: 10}}>
          {this.renderMessages()}
        </View>
        <View key={'phone'}>
          <TextInput {...fields[0]} onFocus={() => this.onFocus({...fields[0]})} onChangeText={(text) => this.state.data.phone = text} />
        </View>
        <View key={'resetPassCode'}>
          <TextInput {...fields[1]} onFocus={() => this.onFocus({...fields[1]})} onChangeText={(text) => this.state.data.resetPassCode = text} />
        </View>
        <View key={'password'}>
          <TextInput {...fields[2]} onFocus={() => this.onFocus({...fields[2]})} onChangeText={(text) => this.state.data.password = text} />
        </View>
        <View key={'passwordd'}>
          <TextInput {...fields[3]} onFocus={() => this.onFocus({...fields[3]})} onChangeText={(text) => this.state.data.passwordd = text} />
        </View>
        <TouchableHighlight style={this.state.loading ? styles.buttonDisabled : styles.button} underlayColor={'#2bbbad'} onPress={() => this.onSubmit(fields)}>
          <Text style={styles.buttonText}>{this.state.loading ? 'Please Wait . . .' : 'Submit'}</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  renderMessages() {
    if (this.state.messages.length > 0) {
      let messages = this.state.messages.map((val, key) => {
        if (val.message) return <Text style={styles.message} key={key}>{val.message}</Text>;
      });

      return messages;
    }
  }

  onFocus(argument) {
    setTimeout(() => {
      let scrollResponder = this.refs.resetForm.getScrollResponder();
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            React.findNodeHandle(this.refs[argument.ref]), 110, true
          );
    }, 50);
  }

  onSubmit(argument) {
    if (this.state.loading) {
      ToastAndroid.show('Please Wait . . .', ToastAndroid.SHORT);
      return null;
    }

    let keys = Object.keys(this.state.data).map((val, key) => {
      if ([null, undefined, 'null', 'undefined', ''].indexOf(this.state.data[val]) > -1) return val;
    });

    this.setState({messages: []});

    argument.map((val, key) => {
      if (keys.indexOf(val.ref) > -1) this.setState({messages: this.state.messages.concat(val)});
    });

    if (this.state.messages.length > 0) return null;

    this.setState({loading: true});

    api.auth.reset(this.state.data)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText || response._bodyText);
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        ToastAndroid.show(JSON.stringify(responseData), ToastAndroid.LONG);
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
      })
      .done(() => {
        this.setState({loading: false});
      });
  }
}
