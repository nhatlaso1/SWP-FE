import { BrandAPI } from './apiBrand';
import { ProductAPI } from './apiProduct';

export const CombinedAPI = {
  // Lấy tất cả nhãn hiệu và sản phẩm
  getBrandsAndProducts: async () => {
    try {
      const [brands, products] = await Promise.all([
        BrandAPI.getAll(),
        ProductAPI.getAll()
      ]);
      return { brands, products };
    } catch (error) {
      console.error('Error fetching brands and products:', error);
      throw new Error('Failed to load brands and products.');
    }
  }
}; 