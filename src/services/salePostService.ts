import { authService } from './authService';

export interface SalePostCreateRequest {
  categoryPk: number;
  title: string;
  content: string;
  hopePrice: number;
}

export interface SalePost {
  postPk: number;
  sellerNickname: string;
  categoryName: string;
  title: string;
  content: string;
  hopePrice: number;
  viewCount: number;
  likeCount: number;
  postAt: string;
  stateAt: string;
  state: string;
  latitude: number;
  longitude: number;
  thumbnailUrl?: string; // 전체 목록에서만 사용
  imageUrls?: string[]; // 단건 조회에서만 사용
  salePostLiked: boolean;
}

export interface MyPostsResponse {
  content: SalePost[];
  page: number;
  size: number;
  totalElements: number;
  totalPage: number;
  last: boolean;
}

export interface SalePostsResponse {
  content: SalePost[];
  page: number;
  size: number;
  totalElements: number;
  totalPage: number;
  last: boolean;
}

const API_BASE_URL = 'http://localhost:8080/api';

export const salePostService = {
  // 상품 등록
  createSalePost: async (salePostCreateRequest: SalePostCreateRequest, images: File[]): Promise<void> => {
    const token = authService.getAccessToken();
    
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    const formData = new FormData();
    
    // salePostCreateRequest를 JSON 문자열로 변환하여 추가
    const jsonBlob = new Blob([JSON.stringify(salePostCreateRequest)], {
      type: 'application/json'
    });
    formData.append('salePostCreateRequest', jsonBlob);
    
    // 이미지 파일들 추가
    images.forEach((image) => {
      formData.append('salePostImages', image);
    });

    const response = await fetch(`${API_BASE_URL}/sale-post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '상품 등록에 실패했습니다.');
    }
  },

  // 상품 목록 조회 (페이징 처리 추가) - 0기반 인덱스
  getSalePosts: async (page: number = 0): Promise<SalePostsResponse> => {
    const response = await fetch(`${API_BASE_URL}/sale-post/all?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '상품 목록을 불러오는데 실패했습니다.');
    }

    return response.json();
  },

  // 상품 상세 정보 조회 (토큰 불필요)
  getSalePostDetail: async (postPk: number): Promise<SalePost> => {
    const response = await fetch(`${API_BASE_URL}/sale-post/detail/${postPk}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '상품 정보를 불러오는데 실패했습니다.');
    }

    return response.json();
  },

  // 내 게시글 조회 (토큰 필요) - 페이징 처리 추가 (0 기반 인덱스)
  getMyPosts: async (page: number = 0): Promise<MyPostsResponse> => {
    const token = authService.getAccessToken();
    
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`${API_BASE_URL}/mypage/sales?page=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '내 게시글을 불러오는데 실패했습니다.');
    }

    return response.json();
  },

  // 게시글 삭제 (토큰 필요)
  deleteSalePost: async (postPk: number): Promise<void> => {
    const token = authService.getAccessToken();
    
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`${API_BASE_URL}/sale-post/${postPk}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '게시글 삭제에 실패했습니다.');
    }
  },
};
