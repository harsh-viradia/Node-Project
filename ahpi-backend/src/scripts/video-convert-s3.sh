#!/bin/bash
PATH="$PATH":/snap/bin
# THIS SCRIPT CONVERTS EVERY MP4 (IN THE CURRENT FOLDER AND SUBFOLDER) TO A MULTI-BITRATE VIDEO IN MP4-DASH
# For each file "videoname.mp4" it creates a folder "dash_videoname" containing a dash manifest file "stream.mpd" and subfolders containing video segments.

# Validation tool:
# http://dashif.org/conformance.html

# Documentation:
# https://tdngan.wordpress.com/2016/11/17/how-to-encode-multi-bitrate-videos-in-mpeg-dash-for-mse-based-media-players/

# Remember to add the following mime-types (uncommented) to .htaccess:
# AddType video/mp4 m4s
# AddType application/dash+xml mpd

# DASH-264 JavaScript Reference Client
# https://github.com/Dash-Industry-Forum/dash.js
# https://github.com/Dash-Industry-Forum/dash.js/wiki

# Check programs
if [ -z "$(which ffmpeg)" ]; then
    echo "Error: ffmpeg is not installed"
    exit 1
fi

if [ -z "$(which /var/www/orbit-skills-node/src/scripts/packager)" ]; then
    echo "Error: packager is not installed"
    exit 1
fi

if [ -z "$(which s3cmd)" ]; then
    echo "Error: s3cmd is not installed"
    exit 1
fi

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Error: Invalid Arguement, You must pass 2 Arguements"
    exit 1
fi

input="$1"
output="$2"
filedir="$3"

dir="${input%/*}"

filename=$(basename "$input") # fullname of the file
f="${filename%.*}" # name without extension

outputfolder="${filedir}/${f}"
mkdir "${outputfolder}"

# Get the file from cloud storage
echo "${input}"
echo "${filename}"
filepath=${filedir}/${filename}

# Copy server file to local path
# s3cmd --configure --access_key=$AWS_S3_ACCESS_KEY_ID --secret_key=$AWS_S3_SECRET_ACCESS_KEY --region=$AWS_REGION --host=$AWS_HOST_NAME --host-bucket=$BKT_HOST_NAME
s3cmd get s3://"${input}" "${filepath}" --no-check-certificate

if [ ! -d "dash_${f}" ]; then
echo "Converting \"$f\" to multi-bitrate video in MPEG-DASH"
dummyfilepath="${filedir}/converting.dummy"
touch "${dummyfilepath}"


audioname="${filedir}/${f}_audio.m4a"

ffmpeg -y -i "${filepath}" -c:a aac -ac 2 -ab 128k -vn "${audioname}"

lowname="${filedir}/${f}_360p.mp4"

ffmpeg -y -i "${filepath}" -c:a copy -vf "scale=-2:360" -c:v libx264 -x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72 -minrate 600k -maxrate 600k -bufsize 600k -b:v 600k -f mp4 -pass 1 -y /dev/null
ffmpeg -y -i "${filepath}" -c:a copy -vf "scale=-2:360" -c:v libx264 -x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72 -minrate 600k -maxrate 600k -bufsize 600k -b:v 600k -f mp4 -pass 2 "${lowname}"

midname="${filedir}/${f}_720p.mp4"

# ffmpeg -y -i "${filename}" -c:a copy -vf "scale=-2:480" -c:v libx264 -x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72 -minrate 800k -maxrate 800k -bufsize 800k -b:v 800k -f mp4 -pass 1 -y /dev/null
# ffmpeg -y -i "${filename}" -c:a copy -vf "scale=-2:480" -c:v libx264 -x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72 -minrate 800k -maxrate 800k -bufsize 800k -b:v 800k -f mp4 -pass 2 "${midname}"

ffmpeg -y -i "${filepath}" -c:a copy -vf "scale=-2:720" -c:v libx264 -x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72 -minrate 1000k -maxrate 1000k -bufsize 1000k -b:v 1000k -f mp4 -pass 1 -y /dev/null
ffmpeg -y -i "${filepath}" -c:a copy -vf "scale=-2:720" -c:v libx264 -x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72 -minrate 1000k -maxrate 1000k -bufsize 1000k -b:v 1000k -f mp4 -pass 2 "${midname}"

# rm -f ffmpeg*log*
# packager --segment_duration=10 --fragment_duration=2 'input=sampleConv.mp4,stream=video,output=myvideo.mp4,init_segment=video_init.mp4,segment_template=video_$Number$.mp4' 'input=sampleConv.mp4,stream=audio,output=myaudio.mp4,init_segment=audio_init.mp4,segment_template=audio_$Number$.mp4' --mpd_output myvideo_vod.mpd

/var/www/orbit-skills-node/src/scripts/packager --segment_duration=20 --fragment_duration=3 --generate_static_live_mpd \
  in="${audioname}",stream=audio,output="${outputfolder}/${audioname}",playlist_name="${f}_audio.m3u8",hls_group_id=audio,hls_name=ENGLISH,init_segment="${outputfolder}/${f}_audio_init.m4a",segment_template="${outputfolder}/${f}_audio_\$Number\$.m4a" \
  in="${lowname}",stream=video,output="${outputfolder}/${lowname}",playlist_name="${f}_360p.m3u8",iframe_playlist_name="${f}_360p_iframe.m3u8",init_segment="${outputfolder}/${f}_360p_init.mp4",segment_template="${outputfolder}/${f}_360p_\$Number\$.mp4" \
  in="${midname}",stream=video,output="${outputfolder}/${midname}",playlist_name="${f}_720p.m3u8",iframe_playlist_name="${f}_720p_iframe.m3u8",init_segment="${outputfolder}/${f}_720p_init.mp4",segment_template="${outputfolder}/${f}_720p_\$Number\$.mp4" \
  --hls_master_playlist_output "${outputfolder}/${f}.m3u8" \
  --mpd_output "${outputfolder}/${f}.mpd"


  # in=h264_main_720p_3000.mp4,stream=video,output=h264_720p.mp4,playlist_name=h264_720p.m3u8,iframe_playlist_name=h264_720p_iframe.m3u8 \
  # in=h264_high_1080p_6000.mp4,stream=video,output=h264_1080p.mp4,playlist_name=h264_1080p.m3u8,iframe_playlist_name=h264_1080p_iframe.m3u8 \

# transfer the directory to bucket
s3cmd put --recursive "${outputfolder}" s3://"${output}/" --no-check-certificate 

# Remove the unnecessary files
rm  -R "${dummyfilepath}" "${filepath}" "${outputfolder}" "${audioname}" "${lowname}" "${midname}"

fi

cd "$SAVEDIR"
