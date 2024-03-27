import { PageRequest } from './dto/page-request.dto';
import { PageResponse } from './dto/page-response.dto';

export interface PaginationInterface<T> {
  paginate(pageRequest: PageRequest): Promise<PageResponse<T>>;
}
