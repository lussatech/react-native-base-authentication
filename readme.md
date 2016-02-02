## Requirements:

    lussatech-cli

-----
## Content:
* [Step 1: Get the code](#step1)
* [Step 2: Generate files](#step2)
* [Step 3: Customize files](#step3)

-----
<a name="step1"></a>
### Step 1: Get the code

    npm install react-native-base-authentication

-----
<a name="step2"></a>
### Step 2: Generate files

    lussatech generate react-native-base-authentication

-----
<a name="step3"></a>
### Step 3: Customize files

    react-native-project
    ...
    |_ lib
      |_ react-native-base-authentication
        |_ Example
        |_ ...
        |_ Register.js
        |_ ...
        |_ Server.js
    ...

#### Setting up your API end-point at `Server.js`, e.g.
```javascript
# lib/react-native-base-authentication/Server.js

export const  key = '@lussatech:session';       // key for asynstorage
export const host = 'http://example.com';
export default {
  auth: {
    login: function (data) {
      let url = host + '/auth/login',           // API URI for login
          opt = {
            method: 'post',
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
```

#### Customize your `Login`, `Register`, `ForgetPassword` and `ResetPassword` authentication form, e.g.
```javascript
# lib/react-native-base-authentication/Login.js

...
import api, {host,key} from './Server';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        email: undefined,
        ...
      },
      ...
    };
  }

  render() {
    return(
      <ScrollView ref={'loginForm'}>
        <Text style={style.title}>LOGIN</Text>
        <View key={'email'}>
          <TextInput
            ref={'email'}
            placeholder={'Email'}
            ...
            onChangeText={(text) => this.state.data.email = text}
            value={this.state.data.email} />
        </View>
        ...
        <TouchableHighlight style={style.button} onPress={this.onSubmit.bind(this)}>
          <Text style={style.buttonText}>{this.state.loading ? 'Please Wait . . .' : 'Submit'}</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  onSubmit() {
    ...
    api.auth.login(this.state.data)                           // call API URI for login
      .then((response) => {
        ...
      })
      .then((responseData) => {
        this.onSuccess(responseData);
      })
      .catch((error) => {
        ...
      })
      .done();
  }

  async onSuccess(data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));  // save response data on asynstorage as session
      ...
    } catch (error) {
      ...
    }
  }
}
...
```

#### Manage restricted page, e.g.
```javascript
# lib/react-native-base-authentication/RestrictedPage.js

...
export default class extends Component {
  ...
  componentWillMount() {
    this.loadSession().done();
  }

  async loadSession() {
    try {
      let value = await AsyncStorage.getItem(key);       // check session at asynstorage

      if (value !== null) {
        this.setState({loading: false, session: JSON.parse(value)});
      } else {
        this.setState({loading: false});
      }
    } catch (error) {
      ...
    }
  }

  render() {
    if (this.state.loading) return this.renderLoading();
    if (!this.state.session) return this.renderLogin();  // if no session at asynstorage, render login page

    return this.renderScene();
  }
  ...
}
...
```

#### Manage restricted menu, e.g.
```javascript
# lib/react-native-base-authentication/Navbar.js

...
const actions = [
  ...
  {title: 'Logout', auth: true},         // add props auth at actions menu
];

export default class extends Component {
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
      if (!val.auth) {
        temp.push(val);
      }
    });

    if (this.state.actions.length > temp.length) {
      AsyncStorage.getItem(key)                   // check session at asynstorage
        .then((value) => {
          if (value !== null) {
            this.state.session = value;
          } else {
            this.state.actions = temp;
          }
        })
        .catch((error) => {
          ...
        })
        .done();
    }
  }

  render() {
    return (
      <View style={style.container}>
        <ToolbarAndroid
          ...
          actions={this.state.actions}
        />
      </View>
    );
  }
}
...
```

#### Import `Login.js`, `Register.js`, `ForgetPassword.js`, `ResetPassword.js` and `RestrictedPage.js` to your _react-native-project_, e.g.
```javascript
# index.android.js

...
import RestrictedPage from './lib/react-native-base-authentication/RestrictedPage';

class Name extends Component {
  render() {
    return <RestrictedPage />;
  }
}
...
```

#### Or import `Example` to your _react-native-project_ to see an example, e.g.
```javascript
# index.android.js

...
import Example from './lib/react-native-base-authentication/Example';

class Name extends Component {
  render() {
    return <Example />;
  }
}
...
```
