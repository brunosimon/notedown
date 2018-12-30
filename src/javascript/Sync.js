import firebase from 'firebase/app'
import firebaseDatabase from 'firebase/database'
import * as firebaseUI from 'firebaseui'

export default class Sync
{
    constructor()
    {
        /**
         * APP
         */
        firebase.initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID
        })

        /**
         * AUTH
         */
        const auth = firebase.auth()

        auth.onAuthStateChanged((_user) =>
        {
            if(_user)
            {
                const user = {
                    displayName: _user.displayName,
                    email: _user.email,
                    emailVerified: _user.emailVerified,
                    photoURL: _user.photoURL,
                    isAnonymous: _user.isAnonymous,
                    uid: _user.uid,
                    providerData: _user.providerData
                }

                console.log('user', user)
            }
            else
            {
                // User is signed out.
                // ...
            }
        })

        /**
         * UI
         */
        const ui = new firebaseUI.auth.AuthUI(auth)

        ui.start(
            '.auth',
            {
                signInOptions:
                [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID
                ],
                signInFlow: 'popup',
                callbacks:
                {
                    signInSuccessWithAuthResult: (_test) =>
                    {
                        console.log('signInSuccessWithAuthResult', _test)
                    },
                    uiShown: () =>
                    {
                        console.log('uiShown')
                    }
                }
            }
        )

        /**
         * STYLE
         */
        const $link = document.createElement('link')
        $link.setAttribute('type', 'text/css')
        $link.setAttribute('rel', 'stylesheet')
        $link.setAttribute('href', 'https://cdn.firebase.com/libs/firebaseui/3.1.1/firebaseui.css')
        document.querySelector('head').appendChild($link)

        /**
         * DATABSE
         */
        const database = firebase.database()

        const ref = database.ref('users/a')
        ref.set(
            {
                name: 'toto',
                time: Date.now()
            },
            (_error) =>
            {
                console.log('_error', _error)
            }
        )

        ref.on('value', (_snapshot) =>
        {
            console.log('value', _snapshot.val())
        })
    }
}
