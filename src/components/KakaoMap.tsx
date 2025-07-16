
import React, { useEffect, useRef } from 'react';

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  width?: string;
  height?: string;
  level?: number;
  className?: string;
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
  className = ""
}: KakaoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);

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
        });
      }
    };

    // 카카오 맵 스크립트가 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      // 스크립트 로드
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAOMAP_KEY}&autoload=false`;
      document.head.appendChild(script);

      script.onload = () => {
        initializeMap();
      };

      script.onerror = () => {
        console.error('카카오 맵 스크립트 로드 실패');
      };
    }
  }, [latitude, longitude, level]);

  return (
    <div 
      ref={mapContainer} 
      style={{ width, height }} 
      className={`rounded-lg border ${className}`}
    />
  );
};

export default KakaoMap;
