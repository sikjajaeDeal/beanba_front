import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { salePostService, SalePost } from '@/services/salePostService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const MyPosts = () => {
  const [posts, setPosts] = useState<SalePost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { memberInfo } = useAuth();

  useEffect(() => {
    if (!memberInfo) {
      toast({
        title: "오류",
        description: "로그인이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    fetchMyPosts();
  }, [memberInfo]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const data = await salePostService.getMyPosts();
      setPosts(data);
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "내 게시글을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postPk: number) => {
    try {
      await salePostService.deleteSalePost(postPk);
      toast({
        title: "성공",
        description: "게시글이 삭제되었습니다.",
      });
      // 목록 새로고침
      fetchMyPosts();
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "게시글 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">내 게시글 관리</h1>
        </div>
        <div className="text-center py-8">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/profile">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">내 게시글 관리</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          아직 등록한 게시글이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.postPk} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative">
                  <Link to={`/product/${post.postPk}`}>
                    <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      {post.thumbnailUrl ? (
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          이미지 없음
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* 삭제 및 수정 버튼 */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: 수정 기능 구현 예정
                        toast({
                          title: "알림",
                          description: "수정 기능은 곧 구현될 예정입니다.",
                        });
                      }}
                    >
                      수정
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePost(post.postPk)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Link to={`/product/${post.postPk}`}>
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {post.categoryName}
                    </span>
                    <h3 className="font-semibold text-lg truncate hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(post.hopePrice)}원
                      </span>
                      <span className="text-xs text-gray-500">
                        조회 {post.viewCount} · 좋아요 {post.likeCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{post.sellerNickname}</span>
                      <span>{formatDate(post.postAt)}</span>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default MyPosts;