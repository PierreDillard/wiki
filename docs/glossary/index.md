---
hide:
- toc
---

# Glossaire {.no-collapse}  

[B](#b) | [C](#c) | [E](#e) | [O](#o) | [S](#s) | [T](#t)

---  

## B {#b}  

### bitrate {#bitrate}    

Bitrate refers to the amount of data processed per unit of time during encoding or streaming. It directly impacts the quality and size of multimedia files.  

#### Reference  
```bash 
bitrate(input_file, output_file, bitrate_value) 
```  

#### Usage  
- **Setting specific bitrates** for encoding to optimize for quality or file size 
- **Adjusting audio/video bitrates** to control bandwidth usage for streaming  

#### Troubleshooting  
!!! warning "File size too large"     
    Reduce the bitrate for a smaller file size.  

!!! warning "Poor quality"     
    Increase the bitrate to improve quality.  

#### Example  
```bash 
bitrate("input.mp4", "output.mp4", "1000k") 
```  

#### Parameters  
| Parameter | Description | 
|-----------|-------------| 
| **input_file** | Path to the source file. | 
| **output_file** | Output path. | 
| **bitrate_value** | Desired bitrate (e.g., `1000k` for 1000 kbps). |  

---  

## C {#c} 

### codec {#codec}

A codec is a software or hardware tool that encodes or decodes media data. GPAC supports various codecs for compressing and decompressing media streams.

#### Reference
```bash
codec(input_file, codec_name, output_file)
```

#### Usage
- **Compressing media files** for storage or streaming
- **Decompressing media data** for playback or editing
- **Selecting appropriate codecs** based on platform and quality requirements

#### Troubleshooting
!!! warning "Codec not supported"
    Verify that the codec is installed and supported by GPAC.

!!! warning "Incompatible codec"
    Choose a different codec compatible with your target platform.

#### Example
```bash
codec("input.mp4", "h264", "output.mp4")
```

#### Parameters
| Parameter | Description |
|-----------|-------------|
| **input_file** | Path to the source file. |
| **codec_name** | Name of the codec to use (e.g., `h264`, `aac`). |
| **output_file** | Output path. |

---

## E {#e}

### encode {#encode}

Encoding in GPAC is the process of converting raw media data into a compressed format using codecs. This is essential for reducing file sizes and preparing media for streaming or storage.

#### Reference
```bash
encode(input_file, output_file, codec, quality)
```

#### Usage
- **Compressing video or audio** for storage efficiency
- **Preparing media** for streaming services
- **Optimizing file sizes** while maintaining acceptable quality

#### Troubleshooting
!!! warning "Low quality output"
    Increase the quality parameter or bitrate.

!!! warning "Slow encoding speed"
    Consider using hardware acceleration or a faster codec.

#### Example
```bash
encode("input.raw", "output.mp4", "h264", "high")
```

#### Parameters
| Parameter | Description |
|-----------|-------------|
| **input_file** | Path to the source file. |
| **output_file** | Output path. |
| **codec** | Codec to use for encoding. |
| **quality** | Encoding quality setting (e.g., `low`, `medium`, `high`). |

### encrypt {#encrypt}

Encryption in GPAC refers to the process of securing media content by converting it into a code to prevent unauthorized access. GPAC supports various encryption standards like CENC and ISMA.

#### Reference
```bash
encrypt(input_file, output_file, encryption_scheme, key)
```

#### Usage
- **Securing media content** against unauthorized access
- **DRM implementation** for protected content distribution
- **Encrypting specific tracks** within a media container

#### Troubleshooting
!!! warning "Encryption failure"
    Verify that the encryption key and scheme are properly specified.

!!! warning "Incompatible encryption scheme"
    Choose an encryption scheme compatible with your target platform.

#### Example
```bash
encrypt("input.mp4", "output.mp4", "cenc", "encryption_key.key")
```

#### Parameters
| Parameter | Description |
|-----------|-------------|
| **input_file** | Path to the source file. |
| **output_file** | Output path for the encrypted file. |
| **encryption_scheme** | Encryption scheme to use (e.g., `cenc`, `isma`). |
| **key** | Path to encryption key or the key itself. |

---

## O {#o}  

### output {#output}   

The term "output" refers to the destination file or format where the result of encoding, decoding, or transcoding processes will be stored.  

#### Reference  
```bash 
output(output_file, format) 
```  

#### Usage  
- **Saving encoded or decoded multimedia files** 
- **Specifying the format** of the output file 
- **Exporting processed media streams**  

#### Troubleshooting  
!!! warning "Corrupted or non-functional output file"     
    Verify the format and codec compatibility with the output media player.  

!!! warning "Output file size too large"     
    Consider adjusting the bitrate or encoding settings.  

#### Example  
```bash 
output("output.mp4", "mp4") 
```  

#### Parameters  
| Parameter | Description | 
|-----------|-------------| 
| **output_file** | Path to save the output file. | 
| **format** | Format of the output file (e.g., `mp4`, `mkv`, `avi`). |  

---  

## S {#s}  

### sink {#sink}

A sink in GPAC is an output element that receives processed media data. It is usually the endpoint of a media processing pipeline.

#### Reference
```bash
sink(destination, format)
```

#### Usage
- **Routing processed media** to output destinations
- **Defining output targets** for media pipelines
- **Configuring output format** and parameters

#### Troubleshooting
!!! warning "Sink not receiving data"
    Verify that the media pipeline is correctly configured.

!!! warning "Incompatible sink format"
    Choose a format compatible with your sink.

#### Example
```bash
sink("output.mp4", "mp4")
```

#### Parameters
| Parameter | Description |
|-----------|-------------|
| **destination** | Target destination (file path, URL, device). |
| **format** | Format of the output (e.g., `mp4`, `rtmp`, `udp`). |

### source {#source}

In GPAC, a source is an input element that provides media data to be processed. It is typically the starting point of a media processing pipeline.

#### Reference
```bash
source(location, options)
```

#### Usage
- **Specifying input files** for processing
- **Defining stream sources** for media pipelines
- **Configuring input parameters** for optimal processing

#### Troubleshooting
!!! warning "Source not found"
    Verify that the source path or URL is correct.

!!! warning "Unreadable source"
    Check if the source format is supported by GPAC.

#### Example
```bash
source("input.mp4", {audio: true, video: true})
```

#### Parameters
| Parameter | Description |
|-----------|-------------|
| **location** | Path or URL to the source media. |
| **options** | Additional options for source configuration. |

### SAP  {#sap}    

SAP is an acronym which, in the context of media streaming, can stand for either *Stream Access Points* or *Session Announcement Protocol*. In this wiki, SAP typically refers to the former.  

#### Stream Access Points  

In the context of media packaging, stream access points enable random access and rendering of a stream in a media container.  

Refer to Annex I of ISO/IEC 14496-12:2022 for the exact definition of the different types of Stream Access Points.  

#### Session Announcement Protocol  

A protocol used for the announcement of multicast multimedia sessions, including video and audio streams. The protocol helps clients discover available streams and access information about them, such as stream locations, encoding formats, and timing.  

It is typically used alongside other protocols, such as RTP (Real-time Transport Protocol) for the actual media delivery, to handle session announcements and stream information dissemination.  

SAP was published by IETF as [RFC 2974](https://datatracker.ietf.org/doc/html/rfc2974) in 2000.

---

## T {#t}

### transcode {#transcode}

Transcoding is the process of converting a media file from one format to another. GPAC supports transcoding for various media formats to ensure compatibility and optimize playback.

#### Reference
```bash
transcode(input_file, output_file, output_format, codec_options)
```

#### Usage
- **Converting between different file formats**
- **Changing codec while preserving content**
- **Adapting media for different devices or platforms**

#### Troubleshooting
!!! warning "Quality loss during transcoding"
    Use higher quality settings or more efficient codecs.

!!! warning "Incompatible formats"
    Verify that the source format can be converted to the target format.

#### Example
```bash
transcode("input.mov", "output.mp4", "mp4", {video_codec: "h264", audio_codec: "aac"})
```

#### Parameters
| Parameter | Description |
|-----------|-------------|
| **input_file** | Path to the source file. |
| **output_file** | Output path. |
| **output_format** | Format of the output file. |
| **codec_options** | Options for video and audio codecs. |