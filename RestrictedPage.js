'use strict';

import React, {
  Component,
  View,
  Text,
  AsyncStorage,
  ToastAndroid,
  ScrollView,
  ProgressBarAndroid
} from 'react-native';

import Login from './Login';
import Navbar from './Navbar';
import styles from './Style';
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
    this.loadSession().done(() => this.setState({loading: false}));
  }

  async loadSession() {
    try {
      let value = await AsyncStorage.getItem(key);

      if (value !== null) this.setState({session: JSON.parse(value)});
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
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
        <Navbar
          title={'Restricted Page'}
          navigator={this.props.navigator}
          onLogout={() => this.onLogout().done(() => this.setState({session: undefined}))}
        />
        <View>
          <Text style={styles.instructions}>
            {JSON.stringify(this.state.session)}
          </Text>
        </View>
      </ScrollView>
    );
  }

  renderLogin() {
    return <Login navigator={this.props.navigator} />;
  }

  renderLoading() {
    return <ProgressBarAndroid />;
  }

  async onLogout() {
    try {
      await AsyncStorage.removeItem(key);
      ToastAndroid.show('Logout successfully!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.SHORT);
    }
  }
}
