#!/usr/bin/env python3
"""
YouTube Transcript Extractor
Extracts transcripts from YouTube videos with timestamps in a clean, readable format.

Usage:
    python youtube_transcript_extractor.py <youtube_url>
    python youtube_transcript_extractor.py <youtube_url> --output <filename>

Or import as a module:
    from youtube_transcript_extractor import extract_transcript
    transcript = extract_transcript("https://www.youtube.com/watch?v=...")
"""

import re
import sys
from typing import Optional
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)


def extract_video_id(url: str) -> Optional[str]:
    """
    Extract video ID from various YouTube URL formats.

    Supports:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - https://www.youtube.com/v/VIDEO_ID

    Args:
        url: YouTube URL string

    Returns:
        Video ID string or None if not found
    """
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None


def format_timestamp(seconds: float) -> str:
    """
    Convert seconds to readable timestamp format.

    Args:
        seconds: Time in seconds (can be float)

    Returns:
        Formatted timestamp string:
        - [0:00] for times under 1 hour
        - [1:23:45] for times over 1 hour
    """
    seconds = int(seconds)
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60

    if hours > 0:
        return f"[{hours}:{minutes:02d}:{secs:02d}]"
    else:
        return f"[{minutes}:{secs:02d}]"


def extract_transcript(url: str, languages: list = ['en']) -> str:
    """
    Extract transcript from YouTube video with timestamps.

    Args:
        url: YouTube video URL
        languages: List of language codes to try (default: ['en'])

    Returns:
        Formatted transcript string with timestamps

    Raises:
        ValueError: If video ID cannot be extracted or URL is invalid
        TranscriptsDisabled: If transcripts are disabled for the video
        NoTranscriptFound: If no transcript is available in requested languages
        VideoUnavailable: If the video is unavailable or private
    """
    # Extract video ID
    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError(
            "Could not extract video ID from URL. "
            "Please provide a valid YouTube URL."
        )

    # Fetch transcript
    try:
        api = YouTubeTranscriptApi()
        fetched_transcript = api.fetch(video_id, languages=tuple(languages))
    except TranscriptsDisabled:
        raise TranscriptsDisabled(
            f"Transcripts are disabled for video: {video_id}"
        )
    except NoTranscriptFound:
        raise NoTranscriptFound(
            f"No transcript found for video: {video_id} in languages: {languages}"
        )
    except VideoUnavailable:
        raise VideoUnavailable(
            f"Video is unavailable or private: {video_id}"
        )

    # Format transcript with timestamps
    formatted_lines = []
    for snippet in fetched_transcript.snippets:
        timestamp = format_timestamp(snippet.start)
        text = snippet.text.strip()
        formatted_lines.append(f"{timestamp} {text}")

    return '\n'.join(formatted_lines)


def save_transcript(transcript: str, filename: str) -> None:
    """
    Save transcript to a file.

    Args:
        transcript: Formatted transcript string
        filename: Output filename
    """
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(transcript)
    print(f"Transcript saved to: {filename}")


def main():
    """Command-line interface for the transcript extractor."""
    if len(sys.argv) < 2:
        print("Usage: python youtube_transcript_extractor.py <youtube_url> [--output <filename>]")
        print("\nExample:")
        print("  python youtube_transcript_extractor.py 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'")
        print("  python youtube_transcript_extractor.py 'https://youtu.be/dQw4w9WgXcQ' --output transcript.txt")
        sys.exit(1)

    url = sys.argv[1]
    output_file = None

    # Check for --output flag
    if len(sys.argv) >= 4 and sys.argv[2] == '--output':
        output_file = sys.argv[3]

    try:
        print(f"Extracting transcript from: {url}")
        transcript = extract_transcript(url)

        if output_file:
            save_transcript(transcript, output_file)
        else:
            print("\n" + "="*50)
            print("TRANSCRIPT")
            print("="*50 + "\n")
            print(transcript)

    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except TranscriptsDisabled as e:
        print(f"Error: {e}", file=sys.stderr)
        print("This video does not have transcripts/captions enabled.", file=sys.stderr)
        sys.exit(1)
    except NoTranscriptFound as e:
        print(f"Error: {e}", file=sys.stderr)
        print("Try specifying different languages or check if captions are available.", file=sys.stderr)
        sys.exit(1)
    except VideoUnavailable as e:
        print(f"Error: {e}", file=sys.stderr)
        print("The video may be private, deleted, or region-restricted.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
