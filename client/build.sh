#!/bin/sh
ionic build --prod

if [ -e ../server/public ]
then
  rm -R ../server/public
fi
mv www ../server/public