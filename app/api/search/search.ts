import apiService from '../apiService';

export const queryWorks = async (keyword: string) => {
  const { data } = await apiService.get(`/works?author=${keyword}`);
  return data;
}