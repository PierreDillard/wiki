<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# MP3 reframer  
  
Register name used to load filter: __rfmp3__  
This filter may be automatically loaded during graph resolution.  
  
This filter parses MPEG-1/2 audio files/data and outputs corresponding audio PID and frames.  
  

# Options  {.no-collapse}  
  
<div markdown class="option">  
<a id="index" data-level="basic">__index__</a> (dbl, default: _1.0_): indexing window length  
</div>  
<div markdown class="option">  
<a id="expart" data-level="basic">__expart__</a> (bool, default: _false_): expose pictures as a dedicated video PID  
</div>  
<div markdown class="option">  
<a id="forcemp3">__forcemp3__</a> (bool, default: _true_): force mp3 signaling for MPEG-2 Audio layer 3  
</div>  
  
