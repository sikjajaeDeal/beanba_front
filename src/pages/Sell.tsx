import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Package, DollarSign } from 'lucide-react';

const Sell = () => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    quantity: '',
    unit: '',
    price: '',
    location: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('상품 등록:', formData);
    // 실제 구현 시 API 호출
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
            신선한 식재료를 지역 구매자들에게 직접 판매해보세요
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 콩바구니에서 판매하세요?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Package className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">다양한 상품 카테고리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  곡물, 채소, 축산물, 수산물 등 다양한 식재료를 자유롭게 판매하세요
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">경쟁력 있는 수수료</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  합리적인 수수료와 빠른 정산으로 더 많은 수익을 확보하세요
                </p>
              </CardContent>
            </Card>
          </div>
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
              아래 양식을 작성하여 상품을 등록해주세요
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="productName">상품명 *</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      placeholder="상품명을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grains">곡물/잡곡</SelectItem>
                        <SelectItem value="vegetables">채소류</SelectItem>
                        <SelectItem value="meat">축산물</SelectItem>
                        <SelectItem value="seafood">수산물</SelectItem>
                        <SelectItem value="fruits">과일류</SelectItem>
                        <SelectItem value="dairy">유제품</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">상품 설명 *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="상품에 대한 자세한 설명을 입력하세요"
                    rows={4}
                    required
                  />
                </div>

                {/* Quantity and Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="quantity">수량 *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      placeholder="수량"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit">단위 *</Label>
                    <Select onValueChange={(value) => handleInputChange('unit', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="단위 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="ton">톤</SelectItem>
                        <SelectItem value="box">박스</SelectItem>
                        <SelectItem value="piece">개</SelectItem>
                        <SelectItem value="bundle">묶음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="price">가격 (원) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="가격"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">생산지/소재지 *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="예: 경기도 이천시"
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="contactName">담당자명 *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="담당자명"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contactPhone">연락처 *</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="010-0000-0000"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contactEmail">이메일</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="이메일 주소"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="border-t pt-6">
                  <Label>상품 이미지</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">이미지를 드래그하거나 클릭하여 업로드</p>
                    <p className="text-sm text-gray-500">PNG, JPG 파일 (최대 5MB)</p>
                    <Button type="button" variant="outline" className="mt-4">
                      파일 선택
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700 px-12">
                    상품 등록하기
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
