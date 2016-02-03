'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  ScrollView,
  ToastAndroid,
  BackAndroid
} from 'react-native';

import ForgetPassword from './ForgetPassword';
import Login from './Login';
import Navbar from './Navbar';
import Register from './Register';
import ResetPassword from './ResetPassword';
import RestrictedPage from './RestrictedPage';
import Server, {host as Host, key as Key} from './Server';
import Style from './Style';

export {ForgetPassword, Login, Navbar, Register, ResetPassword, RestrictedPage, Server, Host, Key, Style};

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView>
        <Navbar title={'Example'} navigator={this.props.navigator} />
        <View>
          <TouchableHighlight style={styles.button} underlayColor={'#2bbbad'} onPress={() => this.gotoRoute('register')}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} underlayColor={'#2bbbad'} onPress={() => this.gotoRoute('login')}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} underlayColor={'#2bbbad'} onPress={() => this.gotoRoute('forget')}>
            <Text style={styles.buttonText}>FORGET PASSWORD</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} underlayColor={'#2bbbad'} onPress={() => this.gotoRoute('reset')}>
            <Text style={styles.buttonText}>RESET PASSWORD</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} underlayColor={'#2bbbad'} onPress={() => this.gotoRoute('restricted')}>
            <Text style={styles.buttonText}>RESTRICTED PAGE</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }

  gotoRoute(name) {
    return this.props.navigator.push({name: name});
  }
}

export default class extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navigator
        initialRoute={{name:'home'}}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => {
          return route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FadeAndroid;
        }}
      />
    );
  }

  renderScene(route, navigator) {
    _navigator = navigator;
    switch (route.name) {
      case 'register':
        return <Register navigator={navigator} />
        break;
      case 'login':
        return <Login navigator={navigator} />
        break;
      case 'forget':
        return <ForgetPassword navigator={navigator} />
        break;
      case 'reset':
        return <ResetPassword navigator={navigator} />
        break;
      case 'restricted':
        return <RestrictedPage navigator={navigator} />
        break;
      default:
        return <Home navigator={navigator} />
    }
  }
}

let _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
    return false;
  }
  _navigator.pop();
  return true;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 44,
    backgroundColor: '#26a69a',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 10
  },
  toolbar: {
    height: 60,
    backgroundColor: '#D6D2D2'
  }
});
