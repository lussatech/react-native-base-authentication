'use strict';

import React, {
  Component,
  StyleSheet,
  ToastAndroid,
  View,
  Text,
  TextInput,
  PropTypes,
  AsyncStorage
} from 'react-native';

import ToolbarAndroid from 'ToolbarAndroid';

import {key} from './Server';

export default class extends Component {
  static propTypes = {
     onSearch: PropTypes.func,
    onRefresh: PropTypes.func,
     onLogout: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
          search: false,
           query: undefined,
         actions: actions,
         session: undefined
    };
  }

  componentWillMount() {
    let temp = [];

    this.state.actions.map((val, key) => {
      if (!val.auth) {
        temp.push(val);
      }
    });

    if (this.state.actions.length > temp.length) {
      AsyncStorage.getItem(key)
        .then((value) => {
          if (value !== null) {
            this.state.session = value;
          } else {
            this.state.actions = temp;
          }
        })
        .catch((error) => {
          ToastAndroid.show(String(error).replace('Error: ',''), ToastAndroid.SHORT);
        })
        .done();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          overflowIcon={icons.more}
          actions={actions}
          onActionSelected={this.onActionSelected.bind(this)}>
          {this.state.search ? this.renderSearch() : this.renderTitle()}
        </ToolbarAndroid>
      </View>
    );
  }

  renderTitle() {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    );
  }

  renderSearch() {
    return (
      <View style={styles.titleContainer}>
        <TextInput
          style={{backgroundColor:'#ffffff',padding:2}}
          ref={'search'}
          placeholder={'type something . . .'}
          placeholderTextColor={'#BFBFBF'}
          autoFocus={true}
          onChangeText={(text) => this.state.query = text}
          onSubmitEditing={() => this.onSearch()}
        />
      </View>
    );
  }

  onActionSelected(position) {
    switch (position) {
       case 0: this.onSearch(); break;
       case 1: this.onRefresh(); break;
       case 5: this.onLogout(); break;
      default: ToastAndroid.show(`${actions[position].title} selected.`, ToastAndroid.SHORT);
    }
  }

  onSearch() {
    this.props.onSearch && this.props.onSearch();

    if (this.state.query) ToastAndroid.show(`${this.state.query} not found`, ToastAndroid.SHORT);
    this.setState({search: !this.state.search, query: undefined});
  }

  onRefresh() {
    this.props.onRefresh && this.props.onRefresh();
  }

  onLogout() {
    this.props.onLogout && this.props.onLogout();
  }
}

const icons = {
     more: require('./icons/ic_action_more.png'),
   search: require('./icons/ic_action_search.png'),
  refresh: require('./icons/ic_action_refresh.png'),
};

const actions = [
  {title: 'Search', icon: icons.search, show: 'always'},
  {title: 'Refresh', icon: icons.refresh, show: 'ifRoom'},
  {title: 'Single Sign On'},
  {title: 'Notifications'},
  {title: 'Profile', auth: true},
  {title: 'Logout', auth: true},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  toolbar: {
    height: 60,
    backgroundColor: '#00796B'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 20,
    color: '#ffffff'
  }
});
