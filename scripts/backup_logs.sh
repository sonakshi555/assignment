#!/bin/bash

# Configuration settings
BUCKET_NAME="yourname-app-logs-backup" # Ensure this matches your S3 bucket name
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOCAL_BACKUP_DIR="/tmp/nginx_logs_backup"
LOG_SOURCE="/var/log/nginx/access.log"

echo "Initializing scheduled log backup routine to S3..."

# Create clean temporary working space
mkdir -p "$LOCAL_BACKUP_DIR"

# Check if Nginx logs exist before proceeding
if [ -f "$LOG_SOURCE" ]; then
    # Snapshot logs to preserve continuous file logging writes
    cp "$LOG_SOURCE" "$LOCAL_BACKUP_DIR/access_$TIMESTAMP.log"
    
    # Compress file to optimize cloud object storage metrics
    gzip "$LOCAL_BACKUP_DIR/access_$TIMESTAMP.log"
    
    # Upload archived file utilizing EC2 attached IAM identity instance profile rules
    aws s3 cp "$LOCAL_BACKUP_DIR/access_$TIMESTAMP.log.gz" "s3://$BUCKET_NAME/logs/year=$(date +%Y)/month=$(date +%m)/access_$TIMESTAMP.log.gz"
    
    if [ $? -eq 0 ]; then
        echo "Log archive successfully committed to storage layer bucket."
        # Truncate active system logs to reclaim raw disk blocks safely
        sudo truncate -s 0 "$LOG_SOURCE"
    else
        echo "CRITICAL ERROR: S3 pipeline synchronization failed. Verify policy settings." >&2
    fi
else
    echo "ERROR: Nginx source streams could not be isolated." >&2
fi

# Purge local working runtime memory blocks
rm -rf "$LOCAL_BACKUP_DIR"