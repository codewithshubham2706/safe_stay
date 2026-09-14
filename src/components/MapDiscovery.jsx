import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ShieldCheck, Dumbbell, Utensils, BookOpen, ShoppingBag, Pill, AlertTriangle, CloudRain, Sun, Phone, MessageSquare } from 'lucide-react';

export default function MapDiscovery({
  center = [25.1388, 75.8458],
  hostels = [],
  amenities = [],
  signals = [],
  onSelectHostel,
  themeMode = 'dark'
}) {
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerGroup = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: center,
      zoom: 15,
      zoomControl: false
    });

    // Google Maps Tile Layer URL configuration
    // lyrs=m is Google Maps Standard Roadmap, lyrs=r is Google Roadmap Dark/Styled
    const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const lightGoogleTileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const tileUrl = themeMode === 'light' ? lightGoogleTileUrl : darkTileUrl;
    const attribution = themeMode === 'light' ? '&copy; Google Maps & SafeStay Spatial Engine' : '&copy; SafeStay Spatial Engine';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerGroup.current = L.layerGroup().addTo(map);
    leafletMapInstance.current = map;

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, []);

  // Dynamic Theme Tile Layer Switcher (Google Maps Light vs Dark)
  useEffect(() => {
    if (!leafletMapInstance.current) return;

    if (tileLayerRef.current) {
      leafletMapInstance.current.removeLayer(tileLayerRef.current);
    }

    const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const lightGoogleTileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const tileUrl = themeMode === 'light' ? lightGoogleTileUrl : darkTileUrl;
    const attribution = themeMode === 'light' ? '&copy; Google Maps & SafeStay Spatial Engine' : '&copy; SafeStay Spatial Engine';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(leafletMapInstance.current);

  }, [themeMode]);

  // Update map view when center changes
  useEffect(() => {
    if (leafletMapInstance.current && center) {
      leafletMapInstance.current.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center]);

  // Render Pins
  useEffect(() => {
    if (!leafletMapInstance.current || !markersLayerGroup.current) return;

    markersLayerGroup.current.clearLayers();

    // 1. Render Hostel Pins
    hostels.forEach(hostel => {
      const [lng, lat] = hostel.location.coordinates;
      const sviScore = hostel.sviScore || 10;
      let gradeClass = 'grade-a';
      if (sviScore > 60) gradeClass = 'grade-c';
      else if (sviScore >= 30) gradeClass = 'grade-b';

      const priceText = hostel.cachedMinRent ? `₹${(hostel.cachedMinRent / 1000).toFixed(1)}k/mo` : 'View';

      const customHtml = `
        <div class="map-hostel-pin ${gradeClass}">
          <span>🛡️ SVI ${sviScore.toFixed(0)}</span>
          <span style="background: rgba(0,0,0,0.3); padding: 1px 6px; border-radius: 10px; margin-left: 2px;">${priceText}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-leaflet-pin',
        iconSize: [120, 32],
        iconAnchor: [60, 16]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup content
      const popupHtml = `
        <div style="width: 220px; font-family: sans-serif;">
          <img src="${hostel.coverImage || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${hostel.name}</div>
          <div style="font-size: 11px; opacity: 0.8; margin-bottom: 8px;">📍 ${hostel.address}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 13px; font-weight: 700; color: #38bdf8;">₹${hostel.cachedMinRent}/mo</span>
            <span style="font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 6px; background: ${sviScore > 60 ? '#f43f5e' : sviScore > 30 ? '#f59e0b' : '#10b981'}; color: #fff;">
              ${hostel.sviGrade ? hostel.sviGrade.split(' ')[0] : 'Grade A'}
            </span>
          </div>
          <button id="inspect-btn-${hostel._id}" style="width: 100%; padding: 8px; border-radius: 8px; border: none; background: #6366f1; color: #fff; font-weight: 600; font-size: 12px; cursor: pointer;">
            📋 Inspect Hostel Sheet
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`inspect-btn-${hostel._id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectHostel(hostel);
          };
        }
      });

      markersLayerGroup.current.addLayer(marker);
    });

    // 2. Render Amenity Pins
    amenities.forEach(amenity => {
      const [lng, lat] = amenity.location.coordinates;
      let iconSymbol = '🏪';
      if (amenity.category === 'Gym') iconSymbol = '🏋️';
      else if (amenity.category === 'Mess / Tiffin') iconSymbol = '🍲';
      else if (amenity.category === 'Library') iconSymbol = '📚';
      else if (amenity.category === 'Pharmacy / Medical') iconSymbol = '💊';

      const amenityHtml = `<div class="map-amenity-pin">${iconSymbol}</div>`;
      const amenityIcon = L.divIcon({
        html: amenityHtml,
        className: 'custom-amenity-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { icon: amenityIcon });
      marker.bindPopup(`
        <div style="font-size: 12px;">
          <strong>${iconSymbol} ${amenity.name}</strong><br/>
          <span style="opacity: 0.8;">${amenity.category} • ${amenity.address}</span>
        </div>
      `);

      markersLayerGroup.current.addLayer(marker);
    });

    // 3. Render Area Signal Pins (Lighting & Monsoon Warnings)
    signals.forEach(sig => {
      const [lng, lat] = sig.location.coordinates;
      let signalHtml = '';
      if (sig.monsoonWaterloggingRisk) {
        signalHtml = `<div class="map-signal-pin waterlogging">🌊 Flood Prone Zone</div>`;
      } else if (sig.streetLightingRating === 'Dark Narrow Alley') {
        signalHtml = `<div class="map-signal-pin dark-alley">⚠️ Dark Alley</div>`;
      } else {
        signalHtml = `<div class="map-signal-pin" style="background: rgba(16,185,129,0.2); border: 1px solid #10b981; color: #10b981;">💡 Well Lit</div>`;
      }

      const signalIcon = L.divIcon({
        html: signalHtml,
        className: 'custom-signal-pin',
        iconSize: [110, 24],
        iconAnchor: [55, 12]
      });

      const marker = L.marker([lat, lng], { icon: signalIcon });
      markersLayerGroup.current.addLayer(marker);
    });

  }, [hostels, amenities, signals, themeMode]);

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Map Layer Branding Indicator */}
      <div className="glass-panel hide-mobile" style={{
        position: 'absolute',
        top: '110px',
        right: '24px',
        zIndex: 900,
        padding: '6px 12px',
        fontSize: '11px',
        fontWeight: '700',
        color: themeMode === 'light' ? '#0f172a' : '#38bdf8',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        🗺️ {themeMode === 'light' ? 'Google Maps Roadmap' : 'SafeStay Dark Spatial Vector'}
      </div>

      {/* Map Legend Overlay */}
      <div className="glass-panel hide-mobile" style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        zIndex: 900,
        padding: '12px 16px',
        fontSize: '11px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ fontWeight: '700', marginBottom: '2px' }}>🛡️ Structural Safety Grades</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          <span>Grade A (Sound SVI &lt; 30)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
          <span>Grade B (Moderate Risk 30-60)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} />
          <span>Grade C/D (Severe Hazard &gt; 60)</span>
        </div>
      </div>
    </div>
  );
}
