import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../../assets/cross_icon.png";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  // Fetching products from API
  const fetchInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/allproducts");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllProducts(data);
      } else {
        console.error("Unexpected API response:", data);
        setAllProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product=async(id)=>{
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json'
      },
      body:JSON.stringify({id:id})
    })
   await fetchInfo();
  }

  return (
    <div className="list-product">
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.length === 0 ? (
          <p>No products available</p>
        ) : (
          allproducts.map((product, index) => (
            <React.Fragment key={index}>
              <div className="listproduct-format-main listproduct-format">
                <img
                  src={product.image?.trim() || "/fallback-image.jpg"}
                  alt={product.name || "Product Image"}
                  className="listproduct-product-icon"
                  onError={(e) => (e.target.src = "/fallback-image.jpg")}
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img onClick={()=>{remove_product(product.id)}}
                  className="listproduct-remove-icon"
                  src={cross_icon}
                  alt="Remove Product"
                />
              </div>
              <hr />
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default ListProduct;
