
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
  onAddressChange
}: KakaoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = mapContainer.current;
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
                const addressName = result[0].address.address_name;
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

    // 카카오 맵 스크립트가 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      // 스크립트 로드 (services 라이브러리 포함)
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAOMAP_KEY}&libraries=services&autoload=false`;
      document.head.appendChild(script);

      script.onload = () => {
        initializeMap();
      };

      script.onerror = () => {
        console.error('카카오 맵 스크립트 로드 실패');
      };
    }
  }, [latitude, longitude, level, showAddress, onAddressChange]);

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
    </div>
  );
};

export default KakaoMap;
