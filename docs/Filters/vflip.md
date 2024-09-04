<!-- automatically generated - do not edit, patch gpac/applications/gpac/gpac.c -->

# Video flip  {:data-level="all"}  
  
Register name used to load filter: __vflip__  
This filter is not checked during graph resolution and needs explicit loading.  
Filters of this class can connect to each-other.  
  
This filter flips uncompressed video frames vertically, horizontally, in both directions or no flip  
  

# Options    
  
<a id="mode">__mode__</a> (enum, default: _vert_, updatable): flip mode  

- off: no flipping (passthrough)  
- vert: vertical flip  
- horiz: horizontal flip  
- both: horizontal and vertical flip  
  
  
