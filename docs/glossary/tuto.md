# Basic Tutorials for Getting Started with GPAC

## Step 1: Installing and Verifying GPAC

1. Download GPAC from the official website: https://gpac.io
2. Install GPAC following the instructions for your operating system.
3. Open a terminal or command prompt.
4. Verify the installation by typing:
   ```
   gpac -version
   ```
5. If you see the GPAC version, the installation is successful!

## Step 2: Inspecting a Media File

1. Choose a video file (for example, video.mp4) on your computer.
2. In the terminal, navigate to the folder containing the file.
3. Execute the following command:
   ```
   gpac -i video.mp4 inspect
   ```
4. You will see detailed information about your video file, such as codec, resolution, etc.

## Step 3: Extracting an Audio Track

1. Use the same video file as before.
2. Execute the command:
   ```
   gpac -i video.mp4 -o audio.aac
   ```
3. This will extract the audio track from your video and save it in AAC format.

## Step 4: Converting Video Format

1. Take your video.mp4 file.
2. To convert it to WebM format, use:
   ```
   gpac -i video.mp4 -o video.webm
   ```
3. GPAC will automatically convert your video to WebM format.

## Step 5: Creating a Thumbnail

1. To create a thumbnail of your video, use:
   ```
   gpac -i video.mp4 -o thumbnail.png:secs=5
   ```
2. This will create a PNG image from the 5th second of your video.

These tutorials will give you a solid foundation to start using GPAC. Feel free to explore further by consulting the official GPAC documentation for more advanced features!