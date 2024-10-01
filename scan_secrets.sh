#!/bin/bash

# Directories to scan
TARGET_DIRS=("backend" "frontend")

# File extensions to scan (without using complicated -name options)
FILE_EXTENSIONS=("*.js" "*.jsx" "*.ts" "*.tsx" "*.py" "*.json" "*.yml" "*.yaml" "*.sh")

# Patterns to identify potential secrets
PATTERNS=("password" "secret" "key" "token" "api_key" "access_token" "client_secret" "auth")

# Skip certain directories or files
EXCLUDED_PATHS=("venv" "node_modules" "package.json" "package-lock.json" "yarn.lock")

echo "Scanning 'frontend' and 'backend' directories for potential hardcoded secrets..."

# Loop through each target directory
for target_dir in "${TARGET_DIRS[@]}"; do
    if [ -d "$target_dir" ]; then
        # Loop through each extension type to avoid complex -name combinations
        for ext in "${FILE_EXTENSIONS[@]}"; do
            find "$target_dir" -type f -name "$ext" | while read -r file; do
                # Skip excluded paths
                skip=false
                for exclude in "${EXCLUDED_PATHS[@]}"; do
                    if [[ "$file" == *"$exclude"* ]]; then
                        skip=true
                        break
                    fi
                done

                # If not in excluded paths, check for patterns
                if [ "$skip" = false ]; then
                    for pattern in "${PATTERNS[@]}"; do
                        # Search for patterns ignoring cases where environment variables are used
                        matches=$(grep -in "$pattern" "$file" | grep -viE 'getenv|process\.env|os\.environ')
                        if [[ -n "$matches" ]]; then
                            echo "Potential secret found in file: $file"
                            echo "$matches"
                            echo "-----------------------------"
                        fi
                    done
                fi
            done
        done
    else
        echo "Directory '$target_dir' does not exist."
    fi
done

echo "Scan completed."
