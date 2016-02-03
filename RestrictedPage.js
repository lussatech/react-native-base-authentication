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
    this.loadSession().done();
  }

  async loadSession() {
    try {
      let value = await AsyncStorage.getItem(key);

      if (value !== null) this.setState({session: JSON.parse(value)});
    } catch (error) {
      ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.LONG);
    } finally {
      this.setState({loading: false});
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
          <Text style={styles.welcome}>
            Welcome to Restricted Page!
          </Text>
          <Text style={styles.instructions}>
            If you can see this page,
          </Text>
          <Text style={styles.instructions}>
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
        <Text style={styles.instructions}>
          please wait . . .
        </Text>
      </View>
    );
  }
}
