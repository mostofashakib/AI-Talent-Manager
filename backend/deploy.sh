#!/bin/bash

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" > /dev/null; then
  gcloud auth login
fi

PROJECT_ID=$(gcloud config list --format="value(core.project)")
if [ -z "$PROJECT_ID" ]; then
  echo "Project ID not set. Please configure it with 'gcloud config set project PROJECT_ID'."
  exit 1
fi

SERVICE_NAME="ai-talent-manager-backend"
REGION="us-central1"
IMAGE="gcr.io/ai-talent-manager/ai-talent-manager-backend"

if [ ! -f .env ]; then
  echo ".env file not found!"
  exit 1
fi

ENV_VARS=$(awk -F= 'BEGIN {ORS=","} {print $1"="$2}' .env | sed 's/,$//')

gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --region "$REGION" \
  --update-env-vars="$ENV_VARS" \
  --platform managed

if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed."
  exit 1
fi