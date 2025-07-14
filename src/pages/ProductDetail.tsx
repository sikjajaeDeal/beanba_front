import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MapPin, ArrowLeft, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { salePostService, SalePost } from '@/services/salePostService';
import { likeService } from '@/services/likeService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { postPk } = useParams<{ postPk: string }>();
  const [product, setProduct] = useState<SalePost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!postPk) return;

    const loadProduct = async () => {
      try {
        const data = await salePostService.getSalePostDetail(Number(postPk));
        setProduct(data);
      } catch (error) {
        toast({
          title: '오류',
          description: error instanceof Error ? error.message : '상품 정보를 불러오는데 실패했습니다.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [postPk, toast]);

  const formatPrice = (price: number) => {
    return price === 0 ? '무료나눔' : `${price.toLocaleString()}원`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStateText = (state: string) => {
    switch (state) {
      case 'S': return '판매중';
      case 'C': return '거래완료';
      case 'R': return '예약중';
      default: return '알 수 없음';
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'S': return 'bg-green-100 text-green-800';
      case 'C': return 'bg-gray-100 text-gray-800';
      case 'R': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: '로그인 필요',
        description: '좋아요를 하려면 로그인이 필요합니다.',
        variant: 'destructive'
      });
      return;
    }

    if (!product) return;

    setIsLiking(true);
    try {
      await likeService.likeProduct(product.postPk);
      // 상품 정보 다시 불러오기
      const updatedProduct = await salePostService.getSalePostDetail(product.postPk);
      setProduct(updatedProduct);
      toast({
        title: '좋아요',
        description: updatedProduct.salePostLiked ? '좋아요를 등록했습니다.' : '좋아요를 취소했습니다.'
      });
    } catch (error) {
      toast({
        title: '오류',
        description: error instanceof Error ? error.message : '좋아요 처리에 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLiking(false);
    }
  };

  const nextImage = () => {
    if (product?.imageUrls && product.imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls!.length);
    }
  };

  const prevImage = () => {
    if (product?.imageUrls && product.imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.imageUrls!.length) % product.imageUrls!.length);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">상품 정보를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
            <Link 
              to="/products" 
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>상품 목록으로 돌아가기</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/products" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>상품 목록으로 돌아가기</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="relative">
            {product.imageUrls && product.imageUrls.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={product.imageUrls[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <Badge 
                    className={`absolute top-4 left-4 ${getStateColor(product.state)}`}
                  >
                    {getStateText(product.state)}
                  </Badge>
                  
                  {/* Navigation Arrows */}
                  {product.imageUrls.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Image Thumbnails */}
                {product.imageUrls.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.imageUrls.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`${product.title} 이미지 ${index + 1}`}
                        className={`flex-shrink-0 w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                          index === currentImageIndex
                            ? 'ring-2 ring-green-500 opacity-100'
                            : 'opacity-60 hover:opacity-80'
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                        onClick={() => selectImage(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src="/placeholder.svg"
                  alt={product.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
                />
                <Badge 
                  className={`absolute top-4 left-4 ${getStateColor(product.state)}`}
                >
                  {getStateText(product.state)}
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                {product.categoryName}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <div className="text-3xl font-bold text-green-600 mb-6">
                {formatPrice(product.hopePrice)}
              </div>
            </div>

            {/* Product Stats */}
            <div className="flex items-center space-x-6 py-4 border-y border-gray-200">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">조회 {product.viewCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">좋아요 {product.likeCount}</span>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">상품 설명</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.content}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">판매자 정보</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">판매자</span>
                  <span className="font-medium">{product.sellerNickname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">등록일</span>
                  <span className="font-medium">{formatDate(product.postAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상태 변경일</span>
                  <span className="font-medium">{formatDate(product.stateAt)}</span>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">위치 정보</h3>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  위도: {product.latitude.toFixed(6)}, 경도: {product.longitude.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 flex items-center justify-center space-x-2"
                onClick={handleLike}
                disabled={isLiking}
              >
                <Heart className={`h-5 w-5 ${product.salePostLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{product.salePostLiked ? '찜 취소' : '찜하기'}</span>
              </Button>
              <Button 
                size="lg" 
                className="flex-1"
                disabled={product.state === 'C'}
              >
                {product.state === 'C' ? '거래완료' : '연락하기'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;