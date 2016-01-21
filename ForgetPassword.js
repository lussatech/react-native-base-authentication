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
        phone: undefined,
         role: 2
      }
    };
  }

  render() {
    return(
      <ScrollView ref={'forgetForm'}>
        <Text style={style.title}>FORGET PASSWORD</Text>
        <View key={'phone'}>
          <TextInput ref={'phone'} placeholder={'Phone Number'} keyboardType={'numeric'} secureTextEntry={false} onFocus={this.onFocus.bind(this, 'phone')} onChangeText={(text) => this.state.data.phone = text} value={this.state.data.phone} />
        </View>
        <TouchableHighlight style={style.button} onPress={this.onSubmit.bind(this)}>
          <Text style={style.buttonText}>{'Submit'}</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  onFocus(argument) {
    setTimeout(() => {
      let scrollResponder = this.refs.forgetForm.getScrollResponder();
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            React.findNodeHandle(this.refs[argument]), 110, true
          );
    }, 50);
  }

  onSubmit() {
    api.auth.forget(this.state.data)
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
