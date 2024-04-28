## HD's Trackmania Events 

Companion software repository for HD's Trackmania Events.

### App

The `/app` directory contains an nx angular application used to power the hdweeklyleague.com website.
This also contains a lightweight nginx docker image to host the bundle, and helm charts to deploy it to a k8s cluster.

- Running locally
```
yarn start
```

- Running the tests and lint
```
yarn test
yarn lint
```
