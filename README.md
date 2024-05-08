## HD's Trackmania Events 

Companion software repository for HD's Trackmania Events. For each part of the solution you can run them independently or you run them together using docker, process compose, or helm/k8s.

### Process Compose

From the root you can kick off the `app`, `api`, and `db` all in one go. This does not run the db migrations, you want to run those separately.
```
process-compose
```

### Docker Compose

From the root you can kick off the `app`, `api`, `db`, and a `nginx` lb in one go. This does not tun the db migrations, you want to run those separately.
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

### Test

The `/test` directory contains api tests for the solution. This will be expanded to include e2e tests. Currently this does not run in process compose / docker compose as it needs the db seeding to happen before running.

- Running locally with browser
```
yarn start
```

- Running headless
```
yarn cypress run
```