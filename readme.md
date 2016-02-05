### Installation
    npm i react-native-base-authentication

### Generate Files
Before generate library files to your react-native-project, make sure that `lussatech-cli` is installed globally in your machine, otherwise use this command to install it:

    npm i lussatech-cli -g

If `lussatech-cli` have been installed, change directory to your react-native-project and run this command:

    lussatech generate react-native-base-authentication

then the library files will be added automatically inside your react-native-project, e.g.

    react-native-project
    |_ ...
    |_ lib
      |_ react-native-base-authentication
        |_ ...
        |_ index.js
        |_ ...

### Usage
```javascript
...
import BaseAuth, {      // sample app
/* available components */
  Navbar,               // sample navigation bar
  Login,                // sample login view
  Register,             // sample register view
  ForgetPassword,       // sample forget password view
  ResetPassword,        // sample reset password view
  RestrictedPage,       // sample restricted view
/* available constants  */  
  Server,               // sample api end-point
  Host,                 // sample host for api end-point
  Key,                  // sample key for asynstorage
  Style                 // sample styles
} from './lib/react-native-base-authentication';

class Name extends Component {
  render() {
    return (
      <BaseAuth />      // sample calling component
    );
  }
}
...
```

###### Manage API end-point
To manage api end-point, update `Server.js` based on your api end-point, e.g.

```javascript
# lib/react-native-base-authentication/Server.js

...
export const  key = '@lussatech:session'; // key for asynstorage
export const host = 'http://example.com'; // host for api end-point
export default {
  auth: {
    login: function (data) {
      let url = `${host}/auth/login`,     // api url for login
          opt = {                         // optional second argument
            method: 'post',               //  to customize the HTTP request
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          };

      return fetch(url, opt);
    },
    ...
  },
  ...
};
...
```

###### Customize navigation bar
To customize navigation bar, update `Navbar.js` based on your need, e.g.

```javascript
# lib/react-native-base-authentication/Navbar.js

...
export default class extends Component {
  /* to validate props value */
  static propTypes = {
    onLogout: PropTypes.func,
    ...
  };

  constructor(props) {
    super(props);

    this.state = {
      actions: actions,
      ...
    };
  }

  componentWillMount() {
    let temp = [];

    this.state.actions.map((val, key) => {
      if (!val.auth) temp.push(val);
    });

    if (this.state.actions.length > temp.length) {
      AsyncStorage.getItem(Key)                          // check session at asynstorage
        .then((value) => {
          if (value !== null) this.state.session = value;
          else this.state.actions = temp;                // if no session, hide auth menu
        })
        .catch((error) => {
          ...
        })
        .done();
    }
  }

  /* when a menu is selected */
  onActionSelected(position) {
    switch (position) {
       ...
       case 5: this.onLogout(); break;
      default: ToastAndroid.show(`${actions[position].title} selected.`, ToastAndroid.SHORT);
    }
  }
  ...

  /* when selected menu is `Logout` */
  onLogout() {
    /* calling onLogout props action if available */
    this.props.onLogout && this.props.onLogout();
  }
  ...
}

/* list of menu */
const actions = [
  {title: 'Search', icon: icons.search, show: 'always'},
  {title: 'Refresh', icon: icons.refresh, show: 'ifRoom'},
  ...
  /* only authenticated user can see this menu */
  {title: 'Profile', auth: true},
  {title: 'Logout', auth: true},
];
...
```

then include the navigation bar inside your react-native-project, e.g.

```javascript
# lib/react-native-base-authentication/RestrictedPage.js

  ...
  render() {
    return (
      <ScrollView>
        <Navbar title={'Restricted Page'} onLogout={() => this.onLogout().done())} />
        <View>
          ...
        </View>
      </ScrollView>
    );
  }

  async onLogout() {
    ...
  }
  ...
```

#### Customize views
To customize views, update `ForgetPassword.js`, `Login.js`, `Register.js`, `ResetPassword.js` and `RestrictedPage.js` based on your need, e.g.

```javascript
# lib/react-native-base-authentication/Login.js

...
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
           email: undefined,
        password: undefined,
        ...
      },
      ...
    };
  }

  render() {
    let fields = [
      {ref: 'email', placeholder: 'Email', keyboardType: 'email-address', secureTextEntry: false, style: [styles.inputText]},
      {ref: 'password', placeholder: 'Password', keyboardType: 'default', secureTextEntry: true, style: [styles.inputText]},
      ...
    ];

    return(
      ...
        <View key={'email'}>
          <TextInput {...fields[0]} onChangeText={(text) => this.state.data.email = text} />
        </View>
        <View key={'password'}>
          <TextInput {...fields[1]} onChangeText={(text) => this.state.data.password = text} />
        </View>
        ...
        <TouchableHighlight onPress={() => this.onSubmit()}>
          <Text>{'Submit'}</Text>
        </TouchableHighlight>
      ...
    );
  }

  onSubmit() {
    ...
    api.auth.login(this.state.data)                           // call api url for login
      .then((response) => {
        if (!response.ok) throw Error(response.statusText || response._bodyText);
        return response.json();
      })
      .then((responseData) => {
        this.onSuccess(responseData).done();                  // store session at asynstorage
      })
      .catch((error) => {
        ...
      })
      .done(() => {
        ...
      });
  }

  async onSuccess(data) {
    try {
      await AsyncStorage.setItem(Key, JSON.stringify(data));  // save response data on asynstorage as session
      ...
    } catch (error) {
      ...
    }
  }
}
...
```

```javascript
# lib/react-native-base-authentication/RestrictedPage.js

...
export default class extends Component {
  ...
  componentWillMount() {
    this.loadSession().done();                                // check session at asynstorage
  }

  render() {
    if (!this.state.session) return this.renderLogin();       // if no session at asynstorage, render login page
    ...
  }

  async loadSession() {
    try {
      let value = await AsyncStorage.getItem(Key);            

      if (value !== null) this.setState({session: JSON.parse(value)});
    } catch (error) {
      ...
    }
  }

  async onLogout() {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      ...
    }
  }
  ...
}
...
```
