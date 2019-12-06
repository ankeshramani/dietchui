import auth0 from 'auth0-js'

export class Auth {

  constructor() {
    // --- Auth Lock Login ---
    this.auth = new auth0.WebAuth({
        domain: "login.optionsedu.com",
        clientID: "dQEcuM5Tj5Wf8EuR9e0wfgmRgHB4YNpt",
        redirectUrl: '',
        responseType: 'token id_token',
        scope: 'openid profile email',
    })
  }


  onLoad = () => {
    return new Promise(resolve => {
      
      this.auth.on('hash_parsed', (authResult) => {

        if (Auth.isAuthenticated()) return resolve('loggedIn')
        else if (!!authResult && !!authResult.idTokenPayload) {
          const {
            accessToken,
            idToken,
            scope,
            idTokenPayload: {
              name,
              sub,
              nickname
            }
          } = authResult
          // validate for beta scopes
          // Set the time that the Access Token will expire at
          const expiresAt = JSON.stringify((3 * 86400000) + new Date().getTime())

          localStorage.setItem('user_name', name)
          localStorage.setItem('user_nickname', nickname)
          localStorage.setItem('user_uid', sub)
          localStorage.setItem('expires_at', expiresAt)
          localStorage.setItem('access_token', accessToken)
          localStorage.setItem('id_token', idToken)
          localStorage.setItem('permissions', scope)

          return resolve('authenticated')
          
        } else {

          // save attempted URL
          const url = window.location.href.toString()
          const base = String(process.env.REACT_APP_ROOT)
          const redirect = `/${url.split(base).pop()}`
          localStorage.setItem('redirect', redirect)

          // show auth lock
          //this.showLock()
          return resolve('')
        }
      })
    })
  }
  
  onLogin = ({username, password}) => {
    this.auth.client.login({
      realm: 'Username-Password-Authentication',
      username: username,
      password: password,
    }, function(err, authResult) {
      // Auth tokens in the result or an error
      console.log(authResult)
    });
  }
  
  renewToken() {
    this.auth.checkSession({}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          this.setSession(result);
        }
      }
    );
  }
  
  setSession(authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    
    // schedule a token renewal
    this.scheduleRenewal();
    
  }
  
  scheduleRenewal() {

    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const delay = expiresAt - Date.now();
    if (delay > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken();
      }, delay);
    }
  }

  // display login lock
  showLock = () => this.auth.show()

  // on log out
  logout = () => {

    // log out AuthLock & return to login
    this.auth.logout({
      returnTo: String(process.env.REACT_APP_ROOT)
    })
    clearTimeout(this.tokenRenewalTimeout);
  }

  // check auth
  static isAuthenticated = () => {

    // Check whether the current time is past the Access Token's expiry time
    const expiresAt = Number(JSON.parse(window.localStorage.getItem('expires_at')))
    return new Date().getTime() < expiresAt
  }
}
