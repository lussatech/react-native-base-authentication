'use strict';

import React, {
  Component,
  ScrollView,
  Text,
  TouchableOpacity,
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
         role: 2
      },
      loading: false
    };
  }

  render() {
    let fields = [
      {ref: 'phone', placeholder: 'Phone Number', keyboardType: 'numeric', secureTextEntry: false, style: [styles.inputText]},
    ];

    return(
      <ScrollView ref={'forgetForm'} {...this.props}>
        <TouchableOpacity activeOpacity={1} style={styles.titleContainer}>
          <Text style={styles.title}>{'FORGET PASSWORD'}</Text>
        </TouchableOpacity>
        <View key={'phone'} style={styles.inputContainer}>
          <TextInput {...fields[0]} onFocus={() => this.onFocus({...fields[0]})} onChangeText={(text) => this.state.data.phone = text} />
        </View>
        <TouchableOpacity activeOpacity={0.7} style={{alignSelf:'flex-end',margin:8}} onPress={() => this.gotoRoute('reset')}>
          <Text style={{fontSize:17,color:'#2196F3'}}>{'Reset password?'}</Text>
        </TouchableOpacity>
        <TouchableHighlight style={this.state.loading ? styles.buttonDisabled : styles.button} underlayColor={'#2bbbad'} onPress={() => this.onSubmit(fields)}>
          <Text style={styles.buttonText}>{this.state.loading ? 'Please Wait . . .' : 'Submit'}</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  onFocus(argument) {
    setTimeout(() => {
      let scrollResponder = this.refs.forgetForm.getScrollResponder();
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

    api.auth.forget(this.state.data)
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

  goBack() {
    if (this.props.navigator) {
      this.props.navigator.pop();
    }
  }

  gotoRoute(name) {
    if (this.props.navigator && this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length-1].name != name) {
      this.props.navigator.push({name: name});
    }
  }

  replaceRoute(name) {
    if (this.props.navigator && this.props.navigator.getCurrentRoutes()[this.props.navigator.getCurrentRoutes().length-1].name != name) {
      this.props.navigator.replace({name: name});
    }
  }
}
