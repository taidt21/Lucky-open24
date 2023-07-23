import { LargeNumberLike } from 'crypto';

export interface PagedNhanSuRequestDto {
    tenantId?: number;
    filter: string;
    idChiNhanh?: string;
    sortBy: string;
    sortType: string;
    skipCount: number;
    maxResultCount: number;
}
