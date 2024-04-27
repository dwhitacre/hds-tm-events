#!/usr/bin/env bash

(
  cd app;
  heroku container:push -a hds-tm-events web;
  heroku container:release -a hds-tm-events web;
)