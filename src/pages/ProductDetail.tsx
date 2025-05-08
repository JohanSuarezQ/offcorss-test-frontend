import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  productId: string;
  productName: string;
  brand: string;
  price: number;
  description: string;
  images: Array<{ imageUrl: string }>;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/products/${id}`);
        const item = response.data;
        const formattedProduct: Product = {
          productId: item.productId,
          productName: item.productName,
          brand: item.brand,
          price: item.items[0]?.sellers[0]?.commertialOffer?.Price || 0,
          description: item.description || 'No hay descripción disponible',
          images: item.items[0]?.images || [],
        };
        setProduct(formattedProduct);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="pa4">
      <button onClick={() => navigate(-1)} className="b ph3 pv2 mb3 input-reset ba b--black bg-transparent grow pointer f6 dib">
        ⬅ Volver
      </button>
      <h2 className="f3 mb3">{product.productName}</h2>
      <p><strong>Marca:</strong> {product.brand}</p>
      <p><strong>Precio:</strong> ${product.price.toLocaleString()}</p>
      <p><strong>Descripción:</strong> {product.description}</p>
      {product.images.length > 0 && (
        <img src={product.images[0].imageUrl} alt={product.productName} width="300" />
      )}
      <button onClick={handlePrint} className="mt3 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib">
        Imprimir Detalles
      </button>
    </div>
  );
};

export default ProductDetail;