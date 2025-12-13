import { DataProvider } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";

// Use the local API endpoints
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create base simple-rest data provider
const baseDataProvider = dataProvider(API_URL);

// Wrap it to ensure proper data transformation
export const customDataProvider: DataProvider = {
  ...baseDataProvider,
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    try {
      const result = await baseDataProvider.getList({
        resource,
        pagination,
        filters,
        sorters,
        meta,
      });

      // Handle nested data structure (double-wrapping issue)
      // API returns { data: [...], total: ... } but simple-rest might wrap it again
      let data = result.data;
      let total = result.total;

      // If data is an object with nested data property, unwrap it
      if (data && typeof data === 'object' && !Array.isArray(data) && 'data' in data) {
        const unwrapped = data as { data: any[]; total?: number };
        data = unwrapped.data;
        if (unwrapped.total !== undefined) {
          total = unwrapped.total;
        }
      }

      // Ensure data is always an array
      if (!Array.isArray(data)) {
        return {
          ...result,
          data: [],
          total: total || 0,
        };
      }

      // Ensure all items have string IDs (Refine requirement)
      const normalizedData = data.map((item: any) => ({
        ...item,
        id: String(item.id || ''),
      }));

      return {
        ...result,
        data: normalizedData,
        total: total || normalizedData.length,
      };
    } catch (error) {
      console.error(`❌ Error in getList for ${resource}:`, error);
      throw error;
    }
  },
  getOne: async ({ resource, id, meta }) => {
    try {
      const result = await baseDataProvider.getOne({ resource, id, meta });
      
      // Handle nested data structure (similar to getList) - OPTIMIZED
      let data = result.data;
      
      // Unwrap if nested: { data: { data: {...} } } -> { data: {...} }
      if (data && typeof data === 'object' && !Array.isArray(data) && 'data' in data) {
        const nestedData = (data as any).data;
        // Check if nested data also has a 'data' property (double wrapped)
        if (nestedData && typeof nestedData === 'object' && !Array.isArray(nestedData) && 'data' in nestedData) {
          data = nestedData.data;
        } else {
          data = nestedData;
        }
      }
      
      // Ensure ID is string
      if (data && typeof data === 'object') {
        data = {
          ...data,
          id: String(data.id || id),
        };
      }
      
      return {
        ...result,
        data,
      };
    } catch (error) {
      console.error(`❌ Error in getOne for ${resource}:`, error);
      throw error;
    }
  },
  create: async ({ resource, variables, meta }) => {
    try {
      return await baseDataProvider.create({ resource, variables, meta });
    } catch (error) {
      console.error(`❌ Error in create for ${resource}:`, error);
      throw error;
    }
  },
  update: async ({ resource, id, variables, meta }) => {
    try {
      return await baseDataProvider.update({ resource, id, variables, meta });
    } catch (error) {
      console.error(`❌ Error in update for ${resource}:`, error);
      throw error;
    }
  },
  deleteOne: async ({ resource, id, meta }) => {
    try {
      return await baseDataProvider.deleteOne({ resource, id, meta });
    } catch (error) {
      console.error(`❌ Error in deleteOne for ${resource}:`, error);
      throw error;
    }
  },
  getApiUrl: () => API_URL,
};
