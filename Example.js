/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
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

import BaseNavbar from './Navbar';
import BaseLogin from './Login';
import BaseRegister from './Register';
import BaseForgetPassword from './ForgetPassword';
import BaseResetPassword from './ResetPassword';
import BaseRestrictedPage from './RestrictedPage';

const icons = {
  back: require('./ic_menu_back.png'),
  logo: require('./ic_menu_logo.png'),
  menu: require('./ic_menu_option.png'),
};

const actions = [
  {title: 'Register', route: 'register'},
  {title: 'Login', route: 'login'},
  {title: 'Forget Password', route: 'forget'},
  {title: 'Reset Password', route: 'reset'},
  {title: 'Restricted Page', route: 'restricted'},
  {title: 'Profile'},
  {title: 'Logout'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
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
    backgroundColor: '#EC7E48',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 10
  },
  toolbar: {
    height: 60,
    backgroundColor: '#D6D2D2'
  }
});

let _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
    return false;
  }
  _navigator.pop();
  return true;
});

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView>
        <BaseNavbar title={'Example'} navigator={this.props.navigator} />
        <View>
          <TouchableHighlight style={styles.button} onPress={() => this.gotoRoute('register')}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this.gotoRoute('login')}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this.gotoRoute('forget')}>
            <Text style={styles.buttonText}>FORGET PASSWORD</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this.gotoRoute('reset')}>
            <Text style={styles.buttonText}>RESET PASSWORD</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this.gotoRoute('restricted')}>
            <Text style={styles.buttonText}>RESTRICTED PAGE</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }

  onActionSelected(position) {
    if (actions[position].route) {
      return this.gotoRoute(actions[position].route);
    }
    return ToastAndroid.show(actions[position].title, ToastAndroid.SHORT);
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
        return <BaseRegister navigator={navigator} />
        break;
      case 'login':
        return <BaseLogin navigator={navigator} />
        break;
      case 'forget':
        return <BaseForgetPassword navigator={navigator} />
        break;
      case 'reset':
        return <BaseResetPassword navigator={navigator} />
        break;
      case 'restricted':
        return <BaseRestrictedPage navigator={navigator} />
        break;
      default:
        return <Home navigator={navigator} />
    }
  }
}
