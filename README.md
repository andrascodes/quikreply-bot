# quikreply-bot

The QuikReply-Bot project is a Facebook Messenger Chatbot starter project. You can deploy a working bot with a development environment, Analytics dashboard and a POSTGRESQL database in a matter of minutes.

The application consists of 3 modules: the Chatbot module, the Analytics module, the frontend app for data visualization and an optional Text classifying API.

## Installation
1. Clone the repository to your own computer from Github
2. Run ```yarn install``` to install the dependencies
3. Create a ```.env``` file to inside the projects root folder to specify the configurations.

### Activating the Chatbot module
This is the chatbot itself which communicates with the Messenger Platform API.

1. Follow the [Quick Start in the Messenger Platform documentation](https://developers.facebook.com/docs/messenger-platform/guides/quick-start) to create your credentials.
2. Specify your credentials in the ```.env``` file as environment variables.
   - ```FB_PAGE_ID=<FB page id>```
   - ```FB_APP_SECRET=<FB app secret>```
   - ```FB_PAGE_TOKEN=<FB page token>```
   - ```FB_VERIFY_TOKEN=<FB verify token>```
3. Specify on which URLs you can reach your bot. 
   - ```TUNNEL_SUBDOMAIN=<subdomain>```
      - The app uses localtunnel so you can connect your chatbot to the Messenger Platform in a local dev environment. This requires a ```SUBDOMAIN```. The app will be available on: ```https://<TUNNEL_SUBDOMAIN>.localtunnel.me```
   - ```SERVER_PORT=<port>```
      - The app will run on this port in a local environment.
   - ```LOCAL_SERVER_URL=<by default: http://localhost>```
     - the main part of the URL where the app runs

### Activating the Analytics module
  1. Create a POSTGRESQL database instance.
  2. Specify the URL in the ```.env``` file.
     - ```DATABASE_URL= <postgres://...>```

### Activating the Text classifying API
  1. Deploy the [QRAnalytics-NLP](https://github.com/andrewszucs/qranalytics-nlp) project.
  2. Specify its URL in the ```.env``` file.
     - ```NLPAPI_URL=<the APIs URL>```

### Deploy and use the web client
You need to sign in on the web client. The intial username and password is admin/password. Change this in the Database in a production environment.