interface IEnvironment {
  apiEndpointDescription: {
    host: string,
    websocketProtocol: string,
    restProtocol: string
  },
  usersUrl: string
}

const defaultEnvironment: IEnvironment = {
  apiEndpointDescription: {
    host: "localhost:8080",
    websocketProtocol: "ws",
    restProtocol: "http"
  },
  usersUrl: "https://nw-frontend-users-staging.web.app"
}

const stagingEnvironment: IEnvironment = {
  apiEndpointDescription: {
    host: "nwapi-staging.encypherstudio.com",
    websocketProtocol: "wss",
    restProtocol: "https"
  },
  usersUrl: "https://nw-frontend-users-staging.web.app"
}

const productionEnvironment: IEnvironment = {
  apiEndpointDescription: {
    host: "api.newsware.com",
    websocketProtocol: "wss",
    restProtocol: "https"
  },
  usersUrl: "https://users.newsware.com"
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