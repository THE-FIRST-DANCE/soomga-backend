export interface PageResponse<T> {
  items: T[]; // 현재 페이지의 아이템
  nextCursor?: number; // 다음 페이지를 위한 cursor
  count?: number; // 전체 아이템 수
}
