#!/bin/bash

# Array of ports to check
ports=(3000 3001 3002 3003 3004  8085 8088 4000 4001 5000 5001 8141 5001 8080 9099 9199)

# Iterate over the ports and find the PIDs
for port in "${ports[@]}"
do
  # Find PID using lsof
  pid=$(lsof -t -i:"$port")
  
  if [ -n "$pid" ]; then
    echo "Terminating process with PID $pid on port $port"
    # Terminate the process
    kill -9 "$pid"
  else
    echo "No process running on port $port"
  fi
done


# Terminate processes related to Firebase using ps aux | grep firebase
pids=$(ps aux | grep firebase | grep -v grep | awk '{print $2}')
for pid in $pids
do
  if [ -n "$pid" ]; then
    echo "Terminating Firebase-related process with PID $pid"
    kill -9 "$pid"
  else
    echo "No Firebase-related process found"
  fi
done

# Terminating all firebase related activities
additional_pids=$(ps aux | grep -E 'firebase|emulators' | grep -v grep | awk '{print $2}')
for pid in $additional_pids
do
  if [ -n "$pid" ]; then
    echo "Terminating additional Firebase-related process with PID $pid"
    kill -9 "$pid"
  else
    echo "No additional Firebase-related process found"
  fi
done

echo "All Firebase-related processes terminated."
