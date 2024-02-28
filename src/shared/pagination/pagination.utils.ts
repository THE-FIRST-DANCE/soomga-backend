import { PageRequest } from './dto/page-request.dto';
import { PageResponse } from './dto/page-response.dto';

interface ItemWithId {
  id: any;
}

export function createPageResponse<T extends ItemWithId>(
  items: T[],
  pageRequest: PageRequest,
  totalItems: number,
): PageResponse<T> {
  let nextCursor = null;

  if (items.length > 0) {
    const lastItem = items[items.length - 1];
    nextCursor = lastItem.id;
  }

  return {
    items,
    nextCursor,
  };
}
