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
             name: undefined,
            phone: undefined,
         password: undefined,
        passwordd: undefined,
             role: 'patient'
      },
      loading: false,
      messages: []
    };
  }

  render() {
    let fields = [
      {ref: 'name', placeholder: 'Full Name', keyboardType: 'default', secureTextEntry: false, message: '* Full Name cannot be blank', style: [styles.inputText]},
      {ref: 'phone', placeholder: 'Phone Number', keyboardType: 'numeric', secureTextEntry: false, message: '* Phone Number cannot be blank', style: [styles.inputText]},
      {ref: 'password', placeholder: 'Password', keyboardType: 'default', secureTextEntry: true, message: '* Password cannot be blank', style: [styles.inputText]},
      {ref: 'passwordd', placeholder: 'Password Confirmation', keyboardType: 'default', secureTextEntry: true, message: '* Password Confirmation cannot be blank', style: [styles.inputText]},
    ];

    return(
      <ScrollView ref={'registerFormC'} {...this.props}>
        <TouchableOpacity activeOpacity={1} style={styles.titleContainer}>
          <Text style={styles.title}>REGISTER</Text>
        </TouchableOpacity>
        <View key={'messages'}>
          {this.renderMessages()}
        </View>
        <View key={'name'} style={styles.inputContainer}>
          <TextInput {...fields[0]} onFocus={() => this.onFocus({...fields[0]})} onChangeText={(text) => this.state.data.name = text} />
        </View>
        <View key={'phone'} style={styles.inputContainer}>
          <TextInput {...fields[1]} onFocus={() => this.onFocus({...fields[1]})} onChangeText={(text) => this.state.data.phone = text} />
        </View>
        <View key={'password'} style={styles.inputContainer}>
          <TextInput {...fields[2]} onFocus={() => this.onFocus({...fields[2]})} onChangeText={(text) => this.state.data.password = text} />
        </View>
        <View key={'passwordd'} style={styles.inputContainer}>
          <TextInput {...fields[3]} onFocus={() => this.onFocus({...fields[3]})} onChangeText={(text) => this.state.data.passwordd = text} />
        </View>
        <TouchableHighlight style={this.state.loading ? styles.buttonDisabled : styles.button} underlayColor={'#2bbbad'} onPress={() => this.onSubmit(fields)}>
          <Text style={styles.buttonText}>{this.state.loading ? 'Please Wait . . .' : 'Submit'}</Text>
        </TouchableHighlight>
        <View style={{flex:1,flexDirection:'row',alignItems:'flex-start',margin:8}}>
          <Text style={{fontSize:17}}>{'Have an account? '}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.gotoRoute('login')}>
            <Text style={{fontSize:17,color:'#512DA8'}}>{'Login'}</Text>
          </TouchableOpacity>
        </View>
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
      let scrollResponder = this.refs.registerFormC.getScrollResponder();
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

    this.gotoRoute('login'); return; // for demo only

    this.setState({loading: true});

    api.auth.register(this.state.data)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText || response._bodyText);
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        ToastAndroid.show(JSON.stringify(responseData), ToastAndroid.LONG);
        this.replaceRoute('login');
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
