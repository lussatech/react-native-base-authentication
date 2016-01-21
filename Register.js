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
import style from './Style';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
             name: undefined,
            phone: undefined,
         password: undefined,
        passwordd: undefined,
             role: 'patient'
      }
    };
  }

  render() {
    return(
      <ScrollView ref={'registerForm'}>
        <Text style={style.title}>REGISTER</Text>
        <View key={'name'}>
          <TextInput ref={'name'} placeholder={'Full Name'} keyboardType={'default'} secureTextEntry={false} onFocus={this.onFocus.bind(this, 'name')} onChangeText={(text) => this.state.data.name = text} value={this.state.data.name} />
        </View>
        <View key={'phone'}>
          <TextInput ref={'phone'} placeholder={'Phone Number'} keyboardType={'numeric'} secureTextEntry={false} onFocus={this.onFocus.bind(this, 'phone')} onChangeText={(text) => this.state.data.phone = text} value={this.state.data.phone} />
        </View>
        <View key={'password'}>
          <TextInput ref={'password'} placeholder={'Password'} keyboardType={'default'} secureTextEntry={true} onFocus={this.onFocus.bind(this, 'password')} onChangeText={(text) => this.state.data.password = text} value={this.state.data.password} />
        </View>
        <View key={'passwordd'}>
          <TextInput ref={'passwordd'} placeholder={'Password Confirmation'} keyboardType={'default'} secureTextEntry={true} onFocus={this.onFocus.bind(this, 'passwordd')} onChangeText={(text) => this.state.data.passwordd = text} value={this.state.data.passwordd} />
        </View>
        <TouchableHighlight style={style.button} onPress={this.onSubmit.bind(this)}>
          <Text style={style.buttonText}>{'Submit'}</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  onFocus(argument) {
    setTimeout(() => {
      let scrollResponder = this.refs.registerForm.getScrollResponder();
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            React.findNodeHandle(this.refs[argument]), 110, true
          );
    }, 50);
  }

  onSubmit() {
    api.auth.login(this.state.data)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText || response._bodyText);
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.SHORT);
      })
      .done();
  }
}
