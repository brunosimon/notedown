import firebase from 'firebase/app'
import firebaseDatabase from 'firebase/database'
import * as firebaseUI from 'firebaseui'
import EventEmitter from './EventEmitter'

export default class Sync extends EventEmitter
{
    constructor()
    {
        super()

        this.user = false

        this.setApp()
        this.setAuth()
        this.setUI()
    }

    /**
     * App
     */
    setApp()
    {
        firebase.initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID
        })
    }

    /**
     * Auth
     */
    setAuth()
    {
        this.auth = firebase.auth()

        this.auth.onAuthStateChanged((_user) =>
        {
            // Already signed in
            if(_user)
            {
                // Create user
                this.user = {
                    displayName: _user.displayName,
                    email: _user.email,
                    isAnonymous: _user.isAnonymous,
                    uid: _user.uid,
                    providerData: _user.providerData
                }

                console.log('user.isAnonymous', this.user.isAnonymous)
                console.log('user.uid', this.user.uid)

                // Set database
                this.setDatabase()
            }

            // Not signed in
            else
            {
                // Sign in as anonymous
                this.auth.signInAnonymously().catch((_error) =>
                {
                    console.log('signInAnonymously', '_error', _error)
                })
            }
        })
    }

    /**
     * UI
     */
    setUI()
    {
        // Add style
        const $link = document.createElement('link')
        $link.setAttribute('type', 'text/css')
        $link.setAttribute('rel', 'stylesheet')
        $link.setAttribute('href', 'https://cdn.firebase.com/libs/firebaseui/3.1.1/firebaseui.css')
        document.querySelector('head').appendChild($link)

        this.ui = new firebaseUI.auth.AuthUI(this.auth)

        this.ui.start(
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
    }

    /**
     * Database
     */
    setDatabase()
    {
        this.database = firebase.database()
        this.ref = this.database.ref(`users/${this.user.uid}`)

        // Try to retrieve data
        this.ref.on('value', (_snapshot) =>
        {
            const value = _snapshot.val()

            // No data found
            if(value === null)
            {
                // Create initial data
                this.ref.set({
                    time: Date.now(),
                    text: ''
                })
            }
            else
            {
                this.trigger('update', [ value ])
            }
        })
    }
}
