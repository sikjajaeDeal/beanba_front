
import React, { useEffect, useRef, useState } from 'react';

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  width?: string;
  height?: string;
  level?: number;
  className?: string;
  showAddress?: boolean;
  onAddressChange?: (address: string) => void;
  showCurrentLocationMarker?: boolean;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = ({ 
  latitude, 
  longitude, 
  width = "100%", 
  height = "200px", 
  level = 3,
  className = "",
  showAddress = false,
  onAddressChange,
  showCurrentLocationMarker = false
}: KakaoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState<string>('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = mapContainer.current;
          if (!container) return;

          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: level
          };
          
          const map = new window.kakao.maps.Map(container, options);
          
          // 마커 생성
          const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          
          marker.setMap(map);

          // geocoder 서비스 사용하여 주소 변환
          if (showAddress || onAddressChange) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            
            geocoder.coord2Address(longitude, latitude, (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const addressName = result[0].road_address 
                  ? result[0].road_address.address_name 
                  : result[0].address.address_name;
                
                setAddress(addressName);
                if (onAddressChange) {
                  onAddressChange(addressName);
                }
              }
            });
          }
        });
      }
    };

    const loadKakaoMapScript = () => {
      // 이미 스크립트가 로드되어 있는지 확인
      if (window.kakao && window.kakao.maps) {
        setIsScriptLoaded(true);
        initializeMap();
        return;
      }

      // 이미 스크립트 태그가 있는지 확인
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAOMAP_KEY}&libraries=services&autoload=false`;
      
      script.onload = () => {
        console.log('카카오 맵 스크립트 로드 성공');
        setIsScriptLoaded(true);
        initializeMap();
      };

      script.onerror = () => {
        console.error('카카오 맵 스크립트 로드 실패');
      };

      document.head.appendChild(script);
    };

    loadKakaoMapScript();
  }, [latitude, longitude, level, showAddress, onAddressChange, showCurrentLocationMarker]);

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        style={{ width, height }} 
        className={`rounded-lg border ${className}`}
      />
      {showAddress && address && (
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-md z-10">
          {address}
        </div>
      )}
      {!isScriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
