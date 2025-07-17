import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Wheat, Carrot, Apple, Beef, Fish, Sprout, Target } from 'lucide-react';
import ProductInfoPanel from './ProductInfoPanel';

declare global {
  interface Window {
    kakao: any;
  }
}

interface Product {
  id: string;
  name: string;
  price: string;
  category: '곡물/두류' | '채소류' | '특용작물' | '과일류' | '축산물' | '수산물';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  seller: string;
  description: string;
  image: string;
}

const MapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userMarker, setUserMarker] = useState<any>(null);

  // Mock data for nearby products
  const mockProducts: Product[] = [
    {
      id: '1',
      name: '신선한 유기농 쌀 20kg',
      price: '65,000원',
      category: '곡물/두류',
      location: { lat: 37.5665 + 0.002, lng: 126.9780 + 0.001, address: '서울시 중구 명동1가' },
      seller: '김농부',
      description: '올해 수확한 신선한 유기농 쌀입니다. 농약을 전혀 사용하지 않고 재배했습니다.',
      image: 'photo-1536304993881-ff6e9eefa2a6'
    },
    {
      id: '2',
      name: '당도 높은 방울토마토 5kg',
      price: '25,000원',
      category: '채소류',
      location: { lat: 37.5665 - 0.001, lng: 126.9780 + 0.002, address: '서울시 중구 소공동' },
      seller: '이농장',
      description: '당도 높은 방울토마토입니다. 직접 키운 신선한 토마토를 저렴하게 판매합니다.',
      image: 'photo-1592841200221-23b3b2d1aeb8'
    },
    {
      id: '3',
      name: '홍로 사과 10kg',
      price: '45,000원',
      category: '과일류',
      location: { lat: 37.5665 + 0.001, lng: 126.9780 - 0.002, address: '서울시 중구 회현동' },
      seller: '박과수원',
      description: '당도 높은 홍로 사과입니다. 충북 청주에서 직접 키운 사과를 서울로 가져왔습니다.',
      image: 'photo-1560806887-1e4fd5b5ac44'
    },
    {
      id: '4',
      name: '1등급 한우 등심 2kg',
      price: '120,000원',
      category: '축산물',
      location: { lat: 37.5665 - 0.002, lng: 126.9780 - 0.001, address: '서울시 중구 충무로1가' },
      seller: '정육점',
      description: '1등급 한우 등심입니다. 신선도를 보장하며 정육 전문점에서 직접 판매합니다.',
      image: 'photo-1546833999-b9f581a1996d'
    },
    {
      id: '5',
      name: '완도산 활전복 1kg',
      price: '80,000원',
      category: '수산물',
      location: { lat: 37.5665 + 0.0015, lng: 126.9780 + 0.0015, address: '서울시 중구 을지로1가' },
      seller: '수산물상회',
      description: '신선한 완도산 활전복입니다. 바로 잡아 올린 싱싱한 전복을 판매합니다.',
      image: 'photo-1544551763-46a013bb70d5'
    },
    {
      id: '6',
      name: '국산 참깨 500g',
      price: '15,000원',
      category: '특용작물',
      location: { lat: 37.5665 - 0.0015, lng: 126.9780 + 0.0008, address: '서울시 중구 장충동' },
      seller: '농산물직판장',
      description: '100% 국산 참깨입니다. 고소한 맛과 향이 일품인 프리미엄 참깨를 저렴하게 판매합니다.',
      image: 'photo-1586201375761-83865001e31c'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '곡물/두류': return Wheat;
      case '채소류': return Carrot;
      case '특용작물': return Sprout;
      case '과일류': return Apple;
      case '축산물': return Beef;
      case '수산물': return Fish;
      default: return MapPin;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '곡물/두류': return '#F59E0B'; // amber
      case '채소류': return '#10B981'; // emerald
      case '특용작물': return '#8B5CF6'; // violet
      case '과일류': return '#EF4444'; // red
      case '축산물': return '#F97316'; // orange
      case '수산물': return '#3B82F6'; // blue
      default: return '#6B7280'; // gray
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsPanelOpen(true);
  };

  const moveToCurrentLocation = () => {
    if (map && currentLocation) {
      const moveLatLon = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      map.setCenter(moveLatLon);
      map.setLevel(4);
    }
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("현재 위치 - 위도: " + latitude + ", 경도: " + longitude);
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('위치 정보를 가져올 수 없습니다:', error.message);
            // 서울 시청 좌표를 기본값으로 사용
            resolve({ lat: 37.5665, lng: 126.9780 });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        console.error('브라우저가 위치 서비스를 지원하지 않습니다.');
        // 서울 시청 좌표를 기본값으로 사용
        resolve({ lat: 37.5665, lng: 126.9780 });
      }
    });
  };

  const convertCoordsToAddress = (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      if (window.kakao && window.kakao.maps) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        
        geocoder.coord2Address(lng, lat, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const addressName = result[0].road_address 
              ? result[0].road_address.address_name 
              : result[0].address.address_name;
            
            // 간단한 주소로 변환 (시/구 정도만)
            const parts = addressName.split(' ');
            const shortAddress = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : addressName;
            resolve(shortAddress);
          } else {
            resolve('주소를 찾을 수 없습니다');
          }
        });
      } else {
        resolve('주소를 찾을 수 없습니다');
      }
    });
  };

  const createMarkerContent = (category: string, price: string) => {
    const color = getCategoryColor(category);
    return `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      ">
        <div style="
          width: 40px;
          height: 40px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          ">🛍️</div>
        </div>
        <div style="
          background-color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          margin-top: 4px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          white-space: nowrap;
        ">${price}</div>
      </div>
    `;
  };

  useEffect(() => {
    const initializeKakaoMap = async () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(async () => {
          try {
            // 현재 위치 가져오기
            const location = await getCurrentLocation();
            setCurrentLocation(location);
            
            // 현재 위치의 주소 가져오기
            const address = await convertCoordsToAddress(location.lat, location.lng);
            setCurrentAddress(address);
            
            const container = mapContainer.current;
            const options = {
              center: new window.kakao.maps.LatLng(location.lat, location.lng),
              level: 4
            };
            
            const kakaoMap = new window.kakao.maps.Map(container, options);
            setMap(kakaoMap);

            // 카카오 기본 마커로 현재 위치 표시
            const userMarkerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
            const userKakaoMarker = new window.kakao.maps.Marker({
              position: userMarkerPosition,
              map: kakaoMap
            });
            
            setUserMarker(userKakaoMarker);

            // Create product markers
            const newMarkers: any[] = [];
            mockProducts.forEach((product) => {
              const markerPosition = new window.kakao.maps.LatLng(product.location.lat, product.location.lng);
              const markerContent = createMarkerContent(product.category, product.price);
              
              const customMarker = new window.kakao.maps.CustomOverlay({
                map: kakaoMap,
                position: markerPosition,
                content: markerContent,
                yAnchor: 1
              });

              // Add click event
              const markerElement = customMarker.getContent().querySelector('div');
              if (markerElement) {
                markerElement.addEventListener('click', () => {
                  handleProductClick(product);
                });
              }

              newMarkers.push(customMarker);
            });
            
            setMarkers(newMarkers);
          } catch (error) {
            console.error('지도 초기화 중 오류 발생:', error);
          }
        });
      }
    };

    // Check if Kakao Maps script is already loaded
    if (window.kakao && window.kakao.maps) {
      initializeKakaoMap();
    } else {
      // Load Kakao Maps script if not already loaded
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAOMAP_KEY}&libraries=services&autoload=false`;
      document.head.appendChild(script);

      script.onload = () => {
        initializeKakaoMap();
      };

      script.onerror = () => {
        console.error('Failed to load Kakao Maps script');
      };

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            내 주변 거래 상품
          </h2>
          <p className="text-lg text-gray-600">
            현재 위치 기준 반경 300m 내 신선한 식재료를 확인해보세요
          </p>
          {currentAddress && (
            <p className="text-xl text-green-600 font-semibold mt-3">
              📍 현재 위치: {currentAddress}
            </p>
          )}
        </div>
        
        {/* Map Container */}
        <div className="w-full h-96 bg-white rounded-lg shadow-lg overflow-hidden relative border">
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Current Location Button */}
          <button
            onClick={moveToCurrentLocation}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Target className="w-6 h-6 text-red-500" />
          </button>
          
          {/* Distance Label */}
          <div className="absolute bottom-4 left-4 bg-green-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
            반경 300m
          </div>

          {/* Category Legend */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm font-semibold text-gray-800 mb-2">카테고리</div>
            <div className="space-y-1">
              {['곡물/두류', '채소류', '특용작물', '과일류', '축산물', '수산물'].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  />
                  <span className="text-xs text-gray-700">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Panel */}
      <ProductInfoPanel
        product={selectedProduct}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </section>
  );
};

export default MapSection;
