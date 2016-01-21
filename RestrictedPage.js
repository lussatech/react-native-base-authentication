'use strict';

import React, {
  Component,
  View,
  Text,
  AsyncStorage,
  ToastAndroid
} from 'react-native';

import ToolbarAndroid from 'ToolbarAndroid';
import style from './Style';
import {key} from './Server';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: {}
    };
  }

  componentWillMount() {
    this.loadSession().done();
  }

  async loadSession() {
    try {
      let value = await AsyncStorage.getItem(key);

      if (value !== null) {
        this.setState({session: JSON.parse(value)});
      } else {
        this.props.navigator.replace({
          name: 'login'
        });
      }
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.SHORT);
    }
  }

  render() {
    return (
      <View style={style.container}>
        <ToolbarAndroid
          style={style.toolbar}
          title={this.props.title}
          actions={[{title: 'Logout', show: 'always'}]}
          onActionSelected={this.onActionSelected.bind(this)} />

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
    );
  }

  onActionSelected(position) {
    switch (position) {
      default:
        this.onLogout();
    }
  }

  async onLogout() {
    try {
      await AsyncStorage.removeItem(key);
      ToastAndroid.show('Logout successfully!', ToastAndroid.SHORT);
      this.props.navigator.replace({
        name: 'login'
      });
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.SHORT);
    }
  }
}
