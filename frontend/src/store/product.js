import {create} from 'zustand';
export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "All fields are required" };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    if (data.success) {
      set((state) => ({ products: [...state.products, data.product] }));
    }
    return { success: data.success, message: data.message };
  },
  fetchProducts: async (search = "", category = "") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);

    const res = await fetch(
      "/api/products" + (params.toString() ? `?${params.toString()}` : "")
    );
    const data = await res.json();
    if (data.success) set({ products: data.data });
    else set({ products: [] });
    return data;
  },
  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: data.success, message: data.message };
    //Updates the UI immediately
    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));
    return { success: data.success, message: data.message };
  },
  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: data.success, message: data.message };
    //Updates the UI immediately
    set((state) => ({
      products: state.products.map((product) =>
        product._id === pid ? data.data : product
      ),
    }));
    return { success: data.success, message: data.message };
  },
}));