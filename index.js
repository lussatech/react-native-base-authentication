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
          return route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.HorizontalSwipeJump;
        }}
      />
    );
  }

  renderScene(route, navigator) {
    _navigator = navigator;
    switch (route.name) {
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
        return <Register navigator={navigator} />
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
