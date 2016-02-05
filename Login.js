'use strict';

import React, {
  Component,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ToastAndroid,
  AsyncStorage,
  Navigator,
  Image
} from 'react-native';

import styles from './Style';
import api, {host, key} from './Server';
import Register from './Register';
import RestrictedPage from './RestrictedPage';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
           email: undefined,
        password: undefined,
            role: 0
      },
      loading: false,
      session: undefined
    };
  }

  render() {
    let fields = [
      {ref: 'email', placeholder: 'Email', keyboardType: 'email-address', secureTextEntry: false, style: [styles.inputText]},
      {ref: 'password', placeholder: 'Password', keyboardType: 'default', secureTextEntry: true, style: [styles.inputText]},
    ];

    return (
      <ScrollView ref={'loginFormC'} {...this.props}>
        <TouchableOpacity activeOpacity={1} style={styles.titleContainer}>
          <Text style={styles.title}>{'LOGIN'}</Text>
        </TouchableOpacity>
        <View key={'email'} style={styles.inputContainer}>
          <TextInput {...fields[0]} onFocus={() => this.onFocus({...fields[0]})} onChangeText={(text) => this.state.data.email = text} />
        </View>
        <View key={'password'} style={styles.inputContainer}>
          <TextInput {...fields[1]} onFocus={() => this.onFocus({...fields[1]})} onChangeText={(text) => this.state.data.password = text} />
        </View>
        <TouchableOpacity activeOpacity={0.7} style={{alignSelf:'flex-end',margin:8}} onPress={() => this.gotoRoute('forget')}>
          <Text style={{fontSize:17,color:'#2196F3'}}>{'Forget password?'}</Text>
        </TouchableOpacity>
        <TouchableHighlight style={this.state.loading ? styles.buttonDisabled : styles.button} underlayColor={'#2bbbad'} onPress={() => this.onSubmit()}>
          <Text style={styles.buttonText}>{this.state.loading ? 'Please Wait . . .' : 'Submit'}</Text>
        </TouchableHighlight>
        <View style={{flex:1,flexDirection:'row',alignItems:'flex-start',margin:8}}>
          <Text style={{fontSize:17}}>{'Doesn\'t have an account? '}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.goBack()}>
            <Text style={{fontSize:17,color:'#E65100'}}>{'Register'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  onFocus(argument) {
    setTimeout(() => {
      let scrollResponder = this.refs.loginFormC.getScrollResponder();
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            React.findNodeHandle(this.refs[argument.ref]), 110, true
          );
    }, 50);
  }

  onSubmit() {
    if (this.state.loading) {
      ToastAndroid.show('Please Wait . . .', ToastAndroid.SHORT);
      return;
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
        this.onSuccess(responseData).done(() => this.replaceRoute('restricted'));
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
