
import React, { useEffect, useRef, useState } from 'react';
import { SalePost, getStateText } from '@/services/salePostService';

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
  nearbyProducts?: SalePost[];
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
  showCurrentLocationMarker = false,
  nearbyProducts = []
}: KakaoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState<string>('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 상태별 마커 이미지 설정
  const getMarkerImageBySaleState = (state: string) => {
    const markerImages = {
      'S': { // 판매중
        src: 'https://beanba-file-bucket-seoul.s3.ap-northeast-2.amazonaws.com/1752813906890_배경 제거 프로젝트-1.png',
        size: { width: 47, height: 69 },
        offset: { x: 23, y: 69 }
      },
      'H': { // 판매보류
        src: 'https://beanba-file-bucket-seoul.s3.ap-northeast-2.amazonaws.com/1752814708931_marker_icon_3.png',
        size: { width: 43, height: 55 },
        offset: { x: 21, y: 55 }
      },
      'R': { // 예약중
        src: 'https://beanba-file-bucket-seoul.s3.ap-northeast-2.amazonaws.com/1752814993159_marker_icon_2.png',
        size: { width: 45, height: 55 },
        offset: { x: 22, y: 55 }
      },
      'C': { // 판매완료
        src: 'https://beanba-file-bucket-seoul.s3.ap-northeast-2.amazonaws.com/1752814993159_marker_icon_2.png',
        size: { width: 45, height: 55 },
        offset: { x: 22, y: 55 }
      }
    };

    return markerImages[state as keyof typeof markerImages] || markerImages['S'];
  };

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
          
          console.log('지도 초기화 완료, 주변 상품 수:', nearbyProducts.length);
          
          // 기본 위치 마커 (nearbyProducts가 없거나 showCurrentLocationMarker가 true일 때)
          if (nearbyProducts.length === 0 || showCurrentLocationMarker) {
            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              title: showCurrentLocationMarker ? '현재 위치' : '위치'
            });
            marker.setMap(map);
            console.log('기본 위치 마커 생성 완료');
          }

          // 주변 상품 마커들 생성 (nearbyProducts가 있을 때만)
          if (nearbyProducts.length > 0) {
            nearbyProducts.forEach((product, index) => {
              console.log(`마커 ${index + 1} 생성 중:`, product.title, product.latitude, product.longitude);
              
              const markerImageInfo = getMarkerImageBySaleState(product.state);
              
              // 마커 이미지 생성
              const markerImage = new window.kakao.maps.MarkerImage(
                markerImageInfo.src,
                new window.kakao.maps.Size(markerImageInfo.size.width, markerImageInfo.size.height),
                { offset: new window.kakao.maps.Point(markerImageInfo.offset.x, markerImageInfo.offset.y) }
              );

              // 마커 생성
              const marker = new window.kakao.maps.Marker({
                map: map,
                position: new window.kakao.maps.LatLng(product.latitude, product.longitude),
                title: product.title,
                image: markerImage
              });

              // 인포윈도우 내용
              const infoWindowContent = `
                <div style="padding: 10px; width: 200px;">
                  <h4 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${product.title}</h4>
                  <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${product.categoryName}</p>
                  <p style="margin: 0 0 5px 0; font-size: 12px; color: #333;">가격: ${product.hopePrice.toLocaleString()}원</p>
                  <p style="margin: 0 0 5px 0; font-size: 12px;">
                    <span style="padding: 2px 6px; background-color: ${product.state === 'S' ? '#dcfce7' : product.state === 'H' ? '#fef3c7' : product.state === 'R' ? '#dbeafe' : '#f3f4f6'}; 
                                color: ${product.state === 'S' ? '#166534' : product.state === 'H' ? '#92400e' : product.state === 'R' ? '#1e40af' : '#374151'}; 
                                border-radius: 4px; font-size: 11px;">
                      ${getStateText(product.state)}
                    </span>
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #666;">
                    조회 ${product.viewCount} · 찜 ${product.likeCount}
                  </p>
                </div>
              `;

              // 인포윈도우 생성
              const infoWindow = new window.kakao.maps.InfoWindow({
                content: infoWindowContent
              });

              // 마커 클릭 이벤트
              window.kakao.maps.event.addListener(marker, 'click', () => {
                infoWindow.open(map, marker);
              });

              // 마커 마우스오버 이벤트
              window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                infoWindow.open(map, marker);
              });

              // 마커 마우스아웃 이벤트
              window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                infoWindow.close();
              });
            });
          }

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
  }, [latitude, longitude, level, showAddress, onAddressChange, showCurrentLocationMarker, nearbyProducts]);

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
