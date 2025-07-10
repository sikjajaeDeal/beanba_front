
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Package } from 'lucide-react';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: '강원도 청정 감자',
      seller: '강원농가',
      location: '강원도 정선군',
      price: '12,000원/10kg',
      rating: 4.8,
      reviews: 156,
      image: 'photo-1618160702438-9b02ab6515c9',
      badge: '베스트셀러',
      minOrder: '최소주문 50kg'
    },
    {
      id: 2,
      name: '제주도 유기농 당근',
      seller: '제주유기농',
      location: '제주도 서귀포시',
      price: '8,500원/5kg',
      rating: 4.9,
      reviews: 203,
      image: 'photo-1465146344425-f00d5f5c8f07',
      badge: '유기농',
      minOrder: '최소주문 20kg'
    },
    {
      id: 3,
      name: '횡성한우 등심',
      seller: '횡성축산',
      location: '강원도 횡성군',
      price: '45,000원/1kg',
      rating: 4.7,
      reviews: 89,
      image: 'photo-1493962853295-0fd70327578a',
      badge: '프리미엄',
      minOrder: '최소주문 5kg'
    },
    {
      id: 4,
      name: '완도 전복',
      seller: '완도수산',
      location: '전남 완도군',
      price: '35,000원/1kg',
      rating: 4.6,
      reviews: 124,
      image: 'photo-1506744038136-46273834b3fb',
      badge: '신선보장',
      minOrder: '최소주문 3kg'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            인기 상품
          </h2>
          <p className="text-lg text-gray-600">
            많은 구매자들이 선택한 믿을 수 있는 식재료입니다
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={`https://images.unsplash.com/${product.image}?w=400&h=300&fit=crop`}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700">
                  {product.badge}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{product.name}</h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Package className="h-4 w-4 mr-1" />
                  {product.minOrder}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">{product.price}</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    문의하기
                  </Button>
                </div>
                
                <div className="mt-2 text-sm text-gray-500">
                  판매자: {product.seller}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8">
            더 많은 상품 보기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
