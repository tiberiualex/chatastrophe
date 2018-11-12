export default class NotificationResource {
  allTokens = [];
  tokensLoaded = false;
  user = null;

  constructor(messaging, database) {
    this.messaging = messaging;
    this.database = database;

    try {
      this.messaging
        .requestPermission()
        .then(res => {
          console.log('Permission granted');
        }).catch(err => {
          console.log('denied ', err);
        });
    } catch(err) {
      console.log('denied ', err);
    }
    this.setupTokenRefresh();
    this.database.ref('/fmcTokens').on('value', snapshot => {
      this.allTokens = snapshot.val();
      this.tokensLoaded = true;
    });
  }

  changeUser(user) {
    this.user = user;
    this.saveTokenToServer();
  }

  setupTokenRefresh() {
    this.messaging.onTokenRefresh(() => {
      this.saveTokenToServer();
    });
  }

  saveTokenToServer() {
    this.messaging.getToken().then(res => {
      if (this.tokensLoaded) {
        const existingToken = this.findExistingToken(res);
        if (existingToken) {
          firebase
            .database()
            .ref(`/fcmTokens/${existingToken}`)
            .set({
              token: res,
              user_id: this.user.uid
            });
        } else {
          this.registerToken(res);
        }
      }
    });
  }

  registerToken(token) {
      firebase.database()
      .ref('fmcTokens/')
      .push({
        token: token,
        user_id: this.user.uid
      }).catch(err => {
        console.log(err)
      });
  }

  findExistingToken(tokenToSave) {
    for (let tokenKey in this.allTokens) {
      const token = this.allTokens[tokenKey].token;
      if (token === tokenToSave) {
        return tokenKey;
      }
    }
    return false;
  }
}
