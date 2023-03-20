import { createContext, useState, useEffect } from "react";
export const Context = createContext();

export function ContextProvider({ children }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3002/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    }
    fetchData();
  }, []);

  async function deleteProduct(id) {
    try {
      await fetch(`http://localhost:3002/products/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      console.log(err.message);
    }
  }

  async function addProduct(product) {
    try {
      const response = await fetch("http://localhost:3002/products", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      setProducts([...products, data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateProduct(id, product) {
    try {
      await fetch(`http://localhost:3002/products/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      setProducts(
        products.map((p) => (p._id === id ? Object.assign({}, p, product) : p))
      );
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <Context.Provider value={{ products, setProducts, deleteProduct, addProduct, updateProduct }}>
      {children}
    </Context.Provider>
  );
}
