import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginGate from './components/LoginGate';
import FloatingNavbar from './components/FloatingNavbar';
import MapDiscovery from './components/MapDiscovery';
import HostelDetailDrawer from './components/HostelDetailDrawer';
import AIConciergeModal from './components/AIConciergeModal';
import StructuralAuditModal from './components/StructuralAuditModal';
import LandlordVerificationModal from './components/LandlordVerificationModal';
import EmergencySOSModal from './components/EmergencySOSModal';
import PaidCommunityModal from './components/PaidCommunityModal';
import { searchSpatialHostels } from './services/apiService';

function SafeStayApp() {
  const { isAuthenticated, user } = useAuth();

  // Theme Mode State ('light' default, 'dark' optional)
  const [themeMode, setThemeMode] = useState('light');

  // Toggle Theme Function
  const handleToggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (themeMode === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, [themeMode]);

  // State
  const [searchQuery, setSearchQuery] = useState('');      // navbar text (place search)
  const [nameFilter, setNameFilter] = useState('');        // explicit "filter listings" text
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [genderFilter, setGenderFilter] = useState('All');
  const [activeCity, setActiveCity] = useState('Kota');

  const [mapCenter, setMapCenter] = useState([25.1388, 75.8458]); // Default Kota
  const [hostels, setHostels] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [signals, setSignals] = useState([]);

  // Modals & Drawers
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [showAIConcierge, setShowAIConcierge] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showLandlordModal, setShowLandlordModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  // Trigger AI Concierge once on initial authentication
  const [hasRunInitialAI, setHasRunInitialAI] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasRunInitialAI) {
      setShowAIConcierge(true);
      setHasRunInitialAI(true);
    }
  }, [isAuthenticated, hasRunInitialAI]);

  // City center mapping
  const cityCoords = {
    'Kota': [25.1388, 75.8458],
    'Delhi - North Campus': [28.6942, 77.2095],
    'Delhi - Kalu Sarai (IIT Hub)': [28.5447, 77.1926],
    'Bengaluru - Koramangala': [12.9352, 77.6245]
  };

  const handleCityChange = (city) => {
    setActiveCity(city);
    const coords = cityCoords[city] || cityCoords['Kota'];
    setMapCenter(coords);
  };

  // India-wide place picked from navbar autocomplete → fly the map there
  const handlePlaceSelect = (place) => {
    if (!place || typeof place.lat !== 'number' || typeof place.lng !== 'number') return;
    setActiveCity(place.name || place.displayName?.split(',')[0] || 'Searched Area');
    setSearchQuery('');
    setNameFilter(''); // fresh area: clear any hostel-name filter
    setMapCenter([place.lat, place.lng]);
  };

  // Fetch Spatial Data
  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setTimeout(() => {
      searchSpatialHostels({
        lat: mapCenter[0],
        lng: mapCenter[1],
        gender: genderFilter,
        category: selectedCategory,
        aiQuery: nameFilter
      }).then(data => {
        if (data) {
          setHostels(data.hostels || []);
          setAmenities(data.amenities || []);
          setSignals(data.signals || []);
        }
      });
    }, 300); // 300ms debounced spatial query

    return () => clearTimeout(timer);
  }, [isAuthenticated, mapCenter, genderFilter, selectedCategory, nameFilter]);

  const handleApplyAIRecommendation = (result, prefs) => {
    if (result && result.recommendedCenter) {
      // Leaflet uses [lat, lng]
      const [lng, lat] = result.recommendedCenter;
      setMapCenter([lat, lng]);
    }
    if (prefs.gender) setGenderFilter(prefs.gender);
    if (result.hostels && result.hostels.length > 0) {
      setHostels(result.hostels);
    }
  };

  if (!isAuthenticated) {
    return <LoginGate />;
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Floating Spatial Navigation Bar */}
      <FloatingNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAIConcierge={() => setShowAIConcierge(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        genderFilter={genderFilter}
        onGenderFilterChange={setGenderFilter}
        activeCity={activeCity}
        onCityChange={handleCityChange}
        onPlaceSelect={handlePlaceSelect}
        onFilterByName={setNameFilter}
        onTriggerSOS={() => setShowSOSModal(true)}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Spatial Map Canvas */}
      <MapDiscovery
        center={mapCenter}
        hostels={hostels}
        amenities={amenities}
        signals={signals}
        onSelectHostel={setSelectedHostel}
        themeMode={themeMode}
      />

      {/* Hostel Detail Inspection Drawer */}
      <HostelDetailDrawer
        hostel={selectedHostel}
        onClose={() => setSelectedHostel(null)}
        onOpenAuditModal={() => setShowAuditModal(true)}
        onOpenLandlordVerify={() => setShowLandlordModal(true)}
        onOpenPaidCommunity={() => setShowCommunityModal(true)}
        onTriggerSOS={() => setShowSOSModal(true)}
      />

      {/* AI Lifestyle & Budget Concierge Wizard Modal */}
      <AIConciergeModal
        isOpen={showAIConcierge}
        onClose={() => setShowAIConcierge(false)}
        onApplyRecommendation={handleApplyAIRecommendation}
        initialAnchor={cityCoords[activeCity] ? activeCity : 'Kota'}
        anchorPoint={{ lat: mapCenter[0], lng: mapCenter[1] }}
        anchorLabel={activeCity}
      />

      {/* Student Structural Audit Submission Modal */}
      <StructuralAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        hostel={selectedHostel}
        onAuditSubmitted={(updatedScores) => {
          if (selectedHostel && updatedScores) {
            setSelectedHostel(prev => ({
              ...prev,
              ...updatedScores
            }));
          }
        }}
      />

      {/* Landlord AI Document Verification Portal */}
      <LandlordVerificationModal
        isOpen={showLandlordModal}
        onClose={() => setShowLandlordModal(false)}
        hostel={selectedHostel}
        onVerificationSuccess={() => {
          if (selectedHostel) {
            setSelectedHostel(prev => ({
              ...prev,
              owner: { ...prev.owner, aiVerificationStatus: 'AI_Verified' }
            }));
          }
        }}
      />

      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        userLocation={[mapCenter[1], mapCenter[0]]}
        studentName={user?.fullName}
      />

      {/* Paid WhatsApp Safety Community Gateway Modal */}
      <PaidCommunityModal
        isOpen={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        localityName={activeCity}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeStayApp />
    </AuthProvider>
  );
}
