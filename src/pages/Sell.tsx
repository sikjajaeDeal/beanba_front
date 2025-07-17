import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Package, DollarSign } from 'lucide-react';
import { salePostService, SalePostRequest } from '@/services/salePostService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Sell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    categoryPk: '',
    content: '',
    hopePrice: '',
    latitude: '37.123456', // 기본값 설정 (회원가입 정보에서 가져올 예정)
    longitude: '127.654321' // 기본값 설정 (회원가입 정보에서 가져올 예정)
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalImages = [...selectedImages, ...newFiles];
      setSelectedImages(totalImages.slice(0, 4)); // 최대 4개로 제한
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: '로그인 필요',
        description: '상품 등록을 위해 로그인해주세요.',
        variant: 'destructive'
      });
      navigate('/products');
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: '이미지 필수',
        description: '상품 이미지를 최소 1개 이상 업로드해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const salePostRequest: SalePostRequest = {
        categoryPk: parseInt(formData.categoryPk),
        title: formData.title,
        content: formData.content,
        hopePrice: parseInt(formData.hopePrice),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      await salePostService.createSalePost(salePostRequest, selectedImages);

      toast({
        title: '등록 완료',
        description: '상품이 성공적으로 등록되었습니다.',
      });

      // 등록 후 상품 목록 페이지로 이동
      navigate('/products');
      
    } catch (error) {
      toast({
        title: '등록 실패',
        description: error instanceof Error ? error.message : '상품 등록에 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            식재료 판매하기
          </h1>
          <p className="text-xl text-green-100 mb-8">
            곡물, 채소, 축산물, 수산물 등 다양한 식재료를 자유롭게 판매하세요
          </p>
        </div>
      </section>

      {/* Product Registration Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              상품 등록하기
            </h2>
            <p className="text-lg text-gray-600">
              곡물, 채소, 축산물, 수산물 등 다양한 식재료를 자유롭게 판매하세요
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">상품명 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="상품명을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="categoryPk">카테고리 *</Label>
                    <Select onValueChange={(value) => handleInputChange('categoryPk', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">식자재</SelectItem>
                        <SelectItem value="2">곡물/잡곡</SelectItem>
                        <SelectItem value="3">채소류</SelectItem>
                        <SelectItem value="4">축산물</SelectItem>
                        <SelectItem value="5">수산물</SelectItem>
                        <SelectItem value="6">과일류</SelectItem>
                        <SelectItem value="7">유제품</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">상품 설명 *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="예) 구매날짜 : 2025년 05월 12일, 유통기한 : 2025년 7월 24일"
                    rows={4}
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="hopePrice">희망 가격 (원) *</Label>
                  <Input
                    id="hopePrice"
                    type="number"
                    value={formData.hopePrice}
                    onChange={(e) => handleInputChange('hopePrice', e.target.value)}
                    placeholder="희망 가격"
                    required
                  />
                </div>

                {/* Map Section */}
                <div>
                  <Label>판매 위치</Label>
                  <div className="mt-2 h-64 bg-gray-100 rounded-lg flex items-center justify-center border">
                    <p className="text-gray-500">카카오맵이 여기에 표시됩니다</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">회원가입 시 등록한 위치를 기반으로 지도가 표시됩니다.</p>
                </div>

                {/* Image Upload */}
                <div className="border-t pt-6">
                  <Label>상품 이미지 * (최대 4개)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">이미지를 선택하여 업로드 (최대 4개)</p>
                    <p className="text-sm text-gray-500">PNG, JPG 파일 (최대 5MB)</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-4 mr-2"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                    >
                      파일 선택
                    </Button>
                    {selectedImages.length > 0 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setSelectedImages([])}
                      >
                        전체 삭제
                      </Button>
                    )}
                    {selectedImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-green-600 mb-2">
                          {selectedImages.length}개 파일 선택됨 (최대 4개)
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {selectedImages.slice(0, 4).map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 px-12"
                    disabled={isLoading}
                  >
                    {isLoading ? '등록 중...' : '상품 등록하기'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sell;
