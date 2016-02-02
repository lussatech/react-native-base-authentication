'use strict';

import React, {
  Component,
  View,
  Text,
  AsyncStorage,
  ToastAndroid,
  ScrollView
} from 'react-native';

import Login from './Login';
import Navbar from './Navbar';
import style from './Style';
import {key} from './Server';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: undefined,
      loading: true
    };
  }

  componentWillMount() {
    this.loadSession().done();
  }

  async loadSession() {
    try {
      let value = await AsyncStorage.getItem(key);

      if (value !== null) {
        this.setState({loading: false, session: JSON.parse(value)});
      } else {
        this.setState({loading: false});
      }
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.SHORT);
    }
  }

  render() {
    if (this.state.loading) return this.renderLoading();
    if (!this.state.session) return this.renderLogin();

    return this.renderScene();
  }

  renderScene() {
    return (
      <ScrollView>
        <Navbar title={'Restricted Page'} navigator={this.props.navigator} />
        <View>
          <Text style={style.welcome}>
            Welcome to Restricted Page!
          </Text>
          <Text style={style.instructions}>
            If you can see this page,
          </Text>
          <Text style={style.instructions}>
            Its means that you already logged in.
          </Text>
        </View>
      </ScrollView>
    );
  }

  renderLogin() {
    return <Login />;
  }

  renderLoading() {
    return (
      <View>
        <Text style={style.instructions}>
          please wait . . .
        </Text>
      </View>
    );
  }
}
