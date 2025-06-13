#!/bin/bash

docker compose up -d

docker-compose logs -f git-spect-server
