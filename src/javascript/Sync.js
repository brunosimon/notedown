import firebase from 'firebase/app'
import firebaseDatabase from 'firebase/database'
import firebaseAuth from 'firebase/auth'
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

                // Set database
                this.setDatabase()

                // If anonymous show sign in button
                if(this.user.isAnonymous)
                {
                    this.ui.$signIn.classList.remove('is-hidden')
                }
                // Hide sign in button
                else
                {
                    this.ui.$signIn.classList.add('is-hidden')
                }
            }

            // Not signed in
            else
            {
                // Sign in as anonymous
                this.auth.signInAnonymously()
            }
        })
    }

    /**
     * UI
     */
    setUI()
    {
        this.ui = {}
        this.ui.$signIn = document.querySelector('.js-sign-in')

        this.ui.$signIn.addEventListener('click', (_event) =>
        {
            _event.preventDefault()

            const provider = new firebase.auth.GoogleAuthProvider()

            this.auth
                .signInWithPopup(provider)
                .then(
                    () =>
                    {
                        window.setTimeout(() =>
                        {
                            alert('You are now connected and your notes will be saved.')
                        }, 500)
                    }
                )
                .catch(
                    (_error) =>
                    {
                        window.setTimeout(() =>
                        {
                            alert('An error occured.\nCheck the console for more info.')
                        }, 500)
                    }
                )
        })
    }

    /**
     * Database
     */
    setDatabase()
    {
        this.database = firebase.database()
        this.refs = {}
        this.refs.main = this.database.ref(`users/${this.user.uid}`)
        this.refs.state = this.refs.main.child('state')

        this.refs.main.once('value', (_snapshot) =>
        {
            const value = _snapshot.val()

            this.trigger('firstSync', [ value ])
        })

        this.refs.state.on('value', (_snapshot) =>
        {
            const value = _snapshot.val()

            this.trigger('stateUpdate', [ value ])
        })
    }
}
