#!/bin/bash
sudo lsof -ti tcp:3000 | xargs kill -9
