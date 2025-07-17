
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import KakaoMap from './KakaoMap';

const MapSection = () => {
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.5636, // 기본값: 서울 중구
    longitude: 126.9975
  });
  const [locationName, setLocationName] = useState('서울 중구');

  useEffect(() => {
    // 현재 위치 가져오기
    const getCurrentLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("현재 위치 - 위도:", latitude, "경도:", longitude);
            
            setCurrentLocation({ latitude, longitude });
            
            // 주소 변환은 KakaoMap 컴포넌트에서 처리
          },
          (error) => {
            console.error('위치 정보를 가져올 수 없습니다:', error.message);
            // 기본 위치 사용 (서울 중구)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5분간 캐시
          }
        );
      } else {
        console.log("브라우저가 위치 서비스를 지원하지 않습니다.");
      }
    };

    getCurrentLocation();
  }, []);

  const handleAddressChange = (address: string) => {
    setCurrentAddress(address);
    // 주소에서 시/구 정보 추출
    const parts = address.split(' ');
    const shortAddress = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : address;
    setLocationName(shortAddress);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            내 주변 농산물 거래 현황
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            지도에서 확인하는 실시간 거래 정보
          </p>
          
          {/* 현재 위치 표시 */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-full px-6 py-3 shadow-lg border-2 border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                <span className="text-2xl font-semibold text-gray-800">
                  📍 현재 위치: {locationName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 16:9 비율의 지도 컨테이너 */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full h-[600px]">
          <KakaoMap
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
            width="100%"
            height="100%"
            level={8}
            showAddress={false}
            onAddressChange={handleAddressChange}
            className="w-full h-full"
            showCurrentLocationMarker={true}
          />
        </div>

        {/* 지도 설명 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            지도를 클릭하거나 드래그하여 다른 지역의 거래 현황을 확인해보세요
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
