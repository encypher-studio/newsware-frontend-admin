interface IEnvironment {
  apiEndpointDescription: {
    host: string,
    websocketProtocol: string,
    restProtocol: string
  }
}

const defaultEnvironment = {
  apiEndpointDescription: {
    host: "localhost:8080",
    websocketProtocol: "ws",
    restProtocol: "http"
  }
}

const stagingEnvironment = {
  apiEndpointDescription: {
    host: "nwapi-staging.encypherstudio.com",
    websocketProtocol: "wss",
    restProtocol: "https"
  },
}

const productionEnvironment = {
  apiEndpointDescription: {
    host: "api.newsware.com",
    websocketProtocol: "wss",
    restProtocol: "https"
  }
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