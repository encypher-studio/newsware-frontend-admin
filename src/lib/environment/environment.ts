import { FirebaseOptions } from "firebase/app"

interface IEnvironment {
  apiEndpointDescription: {
    host: string,
    websocketProtocol: string,
    restProtocol: string
  },
  usersUrl: string
  firebaseOptions: FirebaseOptions
}

const firebaseOptionsStaging = {
  apiKey: "AIzaSyD6ulCmv_WCGw1MIgLnAF8vn1_WWcz2RYg",
  authDomain: "nw-users-auth-staging.firebaseapp.com",
  projectId: "nw-users-auth-staging",
  storageBucket: "nw-users-auth-staging.appspot.com",
  messagingSenderId: "360373770580",
  appId: "1:360373770580:web:fdfa43fa673f5dc84390c1"
}

const firebaseOptionsProduction = {
  apiKey: "AIzaSyApqorMxAivVJjj1ScCK1RzlsRwHkdymZk",
  authDomain: "nw-users-auth.firebaseapp.com",
  projectId: "nw-users-auth",
  storageBucket: "nw-users-auth.appspot.com",
  messagingSenderId: "524941915741",
  appId: "1:524941915741:web:75b6577991503e11a2ffb4"
}

const defaultEnvironment: IEnvironment = {
  apiEndpointDescription: {
    host: "localhost:8080",
    websocketProtocol: "ws",
    restProtocol: "http"
  },
  usersUrl: "https://nw-frontend-users-staging.web.app",
  firebaseOptions: firebaseOptionsStaging
}

const stagingEnvironment: IEnvironment = {
  apiEndpointDescription: {
    host: "staging.api.newsware.com",
    websocketProtocol: "wss",
    restProtocol: "https"
  },
  usersUrl: "https://nw-frontend-users-staging.web.app",
  firebaseOptions: firebaseOptionsStaging
}

const productionEnvironment: IEnvironment = {
  apiEndpointDescription: {
    host: "api.newsware.com",
    websocketProtocol: "wss",
    restProtocol: "https"
  },
  usersUrl: "https://users.newsware.com",
  firebaseOptions: firebaseOptionsProduction
}

export const Environment: IEnvironment = (() => {
  if (import.meta.env.VITE_ENV === "production") {
    return productionEnvironment
  }

  if (import.meta.env.VITE_ENV === "staging") {
    return stagingEnvironment
  }

  return defaultEnvironment
})()