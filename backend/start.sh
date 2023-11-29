#!/bin/bash

set -e

python3 startup.py

exec gunicorn -t 0 -b :$PORT main:app