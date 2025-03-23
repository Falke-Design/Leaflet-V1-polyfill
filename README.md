# Polyfill for removed methods / options in Leaflet V2

Just include the Javascript file into your project and make `L` available in the window object.

```
    import L from 'leaflet';
    window.L = L;
    import './leaflet-v1-polyfill.js';
```

