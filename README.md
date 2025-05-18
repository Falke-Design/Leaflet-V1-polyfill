# Polyfill for removed methods / options in Leaflet V2

Just include the Javascript file into your project and make `L` available in the window object.

Module:
```
<script type="module">
    import L from 'leaflet';
    window.L = L;
    import './leaflet-v1-polyfill.js';

    // Add the polyfills
    applyAllPolyfills();

```

Vanilla Script:

```
<script src="leaflet-global-src.js"></script>
<script src="leaflet-v1-polyfill.js"></script>
<script>
    // Add the polyfills
    applyAllPolyfills();
    
```

## The different Polyfills

Bundles:
- `applyAllPolyfills()`
- `applyMinimumPolyfills()` (MouseEvents, Factory Methods) - should be enough for the most small plugins

Polyfills:
- `applyBrowserPolyfill()`
- `applyDomUtilPolyfill()`
- `applyUtilPolyfill()`
- `applyMouseEventPolyfill()`
- `applyDomEventPolyfill()`
- `applyDeprecatedMethodsPolyfill()`
- `applyFactoryMethodsPolyfill()`
- `applyMiscPolyfill()`



## Excluded from the Polyfill

- https://github.com/Leaflet/Leaflet/pull/8603
- https://github.com/Leaflet/Leaflet/pull/8612
- Partially https://github.com/Leaflet/Leaflet/pull/8734
- https://github.com/Leaflet/Leaflet/pull/8196