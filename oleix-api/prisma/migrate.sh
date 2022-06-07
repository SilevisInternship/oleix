#!/bin/bash

export DATABASE_URL="$1"
npx prisma migrate deploy