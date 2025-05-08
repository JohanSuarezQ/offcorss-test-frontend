import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

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
        const response = await axios.get(`https://offcorss-test-backend.onrender.com/api/products/products/${id}`);
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

  if (!product) return (
    <div className="flex justify-center items-center h5">
      <CircularProgress
        thickness={4}
        size={40}
        sx={{ color: 'black' }}
      />
    </div>
  );

  return (
    <div className="pa4 mw8 center bg-light-gray br3 shadow-3">
      <div
        onClick={() => navigate(-1)}
        className="f6 fw6 dib no-underline bg-animate mid-gray pointer flex items-center"
      >
        <svg className="w1 mr2" data-icon="chevronLeft" viewBox="0 0 32 32" style={{ fill: 'currentcolor' }}>
          <title>chevronLeft icon</title>
          <path d="M20 1 L24 5 L14 16 L24 27 L20 31 L6 16 z"></path>
        </svg>
        Atrás
      </div>

      <div className="flex-ns justify-between items-start">
        <div className="w-50-ns mb4 mb0-ns pr4-ns">
          <h2 className="f2 mb3">{product.productName}</h2>
          <p className="mb2"><strong>Marca:</strong> {product.brand}</p>
          <p className="mb2"><strong>Precio:</strong> ${product.price.toLocaleString()}</p>
          <p className="mb4"><strong>Descripción:</strong> {product.description}</p>
          <button
            onClick={handlePrint}
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          >
            Imprimir Detalles
          </button>
        </div>

        <div className="w-50-ns tc">
          {product.images.length > 0 && (
            <img
              src={product.images[0].imageUrl}
              alt={product.productName}
              className="br3 shadow-4 w-100 print-w-50"
              style={{ maxWidth: '300px', marginTop: '20px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;