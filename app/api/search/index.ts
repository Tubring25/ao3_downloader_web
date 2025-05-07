import api from '../apiService';

export const queryWorks = async (page: number, pageSize: number, keyword: string) => {
  try {
    const response = await api.get('/works', {
      params: {
        page,
        pageSize,
        keyword,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error in queryWorks:', err);
    throw err;
  }
}

export const queryWorkById = async (id: number) => {
  try {
    const response = await api.get(`/works/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error in queryWorkById:', err);
    throw err;
  }
}