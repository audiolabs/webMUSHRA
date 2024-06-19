#!/bin/bash

# Directory containing WAV files
DIRECTORY="."

# Duration in seconds
DURATION=5

# Loop through all WAV files in the directory
for FILE in "$DIRECTORY"/*.wav; do
    # Check if the file exists and is a regular file
    if [ -f "$FILE" ]; then
        # Temporary output file
        TEMP_FILE="${FILE%.wav}_temp.wav"

        # Use ffmpeg to trim the audio file and save to temporary file
        ffmpeg -i "$FILE" -t "$DURATION" -c copy "$TEMP_FILE"

        # Replace original file with the trimmed file
        mv "$TEMP_FILE" "$FILE"

        echo "$FILE has been shortened to $DURATION seconds."
    fi
done
