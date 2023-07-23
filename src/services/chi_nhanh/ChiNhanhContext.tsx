import { createContext } from 'react';
import { SuggestChiNhanhDto } from '../suggests/dto/SuggestChiNhanhDto';
export const ChiNhanhContext = createContext<SuggestChiNhanhDto>({ id: '', tenChiNhanh: '' });
export const ChiNhanhContextbyUser = createContext<SuggestChiNhanhDto[]>([]);
