## HD's Trackmania Events 

Companion software repository for HD's Trackmania Events. For each part of the solution you can run them independently or you run them together using docker, process compose, or helm/k8s.

### Process Compose

> Note the `app` runs on 8080 by default and so does process-compose. I've modified the process compose port to be 8999 via an environment variable `PC_PORT_NUM=8999`.

From the root you can kick off the `app`, `api`, `db`, and `tmiosim` all in one go. This does not run the db migrations, you want to run those separately.
```
process-compose
```

### Docker Compose

From the root you can kick off the `app`, `api`, `db`, an `nginx` lb and `tmiosim` in one go. This does not tun the db migrations, you want to run those separately.
```
docker compose up --build
```

### Helm / K8s

This is mostly used for actual infrastructure and probably will not work out of the box with KinD, miniKube, or the like. The default helm charts assume you have the following:
- Secrets and Namespaces precreated
- Ingress Nginx installed in your cluster
- Cert-Manager and Letsencrpyt Cluster Issuers

If you have all that, and get the naming (or value overrides configured), you should be able to deploy the helm charts to your cluster. See the `.github/workflows` for the exact actions.

### App

The `/app` directory contains an nx angular application used to power the hdweeklyleague.com website.
This also contains a lightweight nginx docker image to host the bundle.

- Running locally
```
yarn start
```

- Running the tests and lint
```
yarn test
yarn lint
yarn format
```

### Api

The `/api` directory contains a golang webserver to populate the data for the hdweeklyleague.com website. This is runs as docker container as well as an simple executable.

- Running locally
```
go run .
```

- Running the tests
```
go test .
```

### Db

The `/db` directory contains the tern migration scripts for managing the database. This is used to bootstrap a local database for development, but also to manage the production database versions.

- Migrating to latest
```
tern migrate
```

- Creating a new migration
```
tern new <name>
tern migrate -d +1
```

- Downgrading
```
tern migrate -d -1
```

### Nginx Lb

The nginx loadbalancer, aka ingress, is simply the public nginx docker image configured with the nginx conf in `docker/nginx.conf`. This is used in the docker compose step to properly emulate how the app and api will behave in a more k8s like environment where the services are behind an ingress-nginx deployment.

This only really should be run directly when composing all the services together via docker compose.

### TmioSim

This is a simulator of trackmania.io using mockoon. If you want to make changes to this you will likely want to download the mockoon GUI, though direct changes to the json are technically supported as well. This is used in all local environments by default to avoid hitting trackmania io's api unecessarily for development and testing purposes.