import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface Product {
  productId: string;
  productName: string;
  brand: string;
  price: number;
  images: Array<{ imageUrl: string }>;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://offcorss-test-backend.onrender.com/api/products/products', {
          params: {
            page,
            limit,
            search,
            sort,
            order,
          },
        });

        const formattedProducts = response.data.map((product: any) => ({
          productId: product.productId,
          productName: product.productName,
          brand: product.brand,
          price: product.items[0]?.sellers[0]?.commertialOffer?.Price || 0,
          images: product.items[0]?.images || [],
        }));

        setProducts(formattedProducts);
        // Corrige el manejo del conteo total interpretando el header como número
        const totalCount = parseInt(response.headers['x-total-count'] || formattedProducts.length, 10);
        setTotalProducts(isNaN(totalCount) ? formattedProducts.length : totalCount);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, [page, search, sort, order, limit]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalProducts / limit);
  console.log("Total productos:", totalProducts, "Páginas:", totalPages);

  return (
    <div className="pa4">
      <h2 className="f3 mb3">Listado de Productos</h2>
      
      <div className="mb3">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={handleSearchChange}
          className="pa3 input-reset ba b--black bg-transparent w-100 mb3 br3"
        />
<div className="mb3">
  <div className="flex mb3">
    <div className="relative w-50 mr2">
      <FormControl fullWidth>
        <InputLabel>Filtrar por</InputLabel>
        <Select
          value={sort}
          label="Filtrar por"
          onChange={(e) => setSort(e.target.value as string)}
          sx={{ 
            borderWidth: 1,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
              borderWidth: 1
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
              borderWidth: 1
            }
          }}
        >
          <MenuItem value="name">Nombre</MenuItem>
          <MenuItem value="price">Precio</MenuItem>
          <MenuItem value="brand">Marca</MenuItem>
        </Select>
      </FormControl>
    </div>

    <div className="relative w-50">
      <FormControl fullWidth>
        <InputLabel>Orden</InputLabel>
        <Select
          value={order}
          label="Orden"
          onChange={(e) => setOrder(e.target.value as string)}
          sx={{ 
            borderWidth: 1,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
              borderWidth: 1
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
              borderWidth: 1
            }
          }}
        >
          <MenuItem value="asc">Ascendente</MenuItem>
          <MenuItem value="desc">Descendente</MenuItem>
        </Select>
      </FormControl>
    </div>
  </div>
</div>
      </div>

      <div className="mb3 flex justify-between items-center">
        <h3 className="f5 b mb2">Listado de Productos</h3>
        <CSVLink
          data={products}
          headers={[
            { label: "ID", key: "productId" },
            { label: "Nombre", key: "productName" },
            { label: "Marca", key: "brand" },
            { label: "Precio", key: "price" },
          ]}
          filename="productos.csv"
          className="b ph3 pv2 input-reset ba by-betwe bg-transparent grow pointer f6 dib"
        >
          Exportar a CSV
        </CSVLink>
      </div>

      <table className="collapse ba br2 b--black-10 pv2 ph3 w-100">
        <thead>
          <tr>
            <th className="pv2 ph3 tl f6 fw6 ttu">ID</th>
            <th className="pv2 ph3 tl f6 fw6 ttu">Nombre</th>
            <th className="pv2 ph3 tl f6 fw6 ttu">Marca</th>
            <th className="pv2 ph3 tl f6 fw6 ttu">Precio</th>
            <th className="pv2 ph3 tl f6 fw6 ttu">Imagen</th>
            <th className="pv2 ph3 tl f6 fw6 ttu">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td className="pv2 ph3">{product.productId}</td>
              <td className="pv2 ph3">{product.productName}</td>
              <td className="pv2 ph3">{product.brand}</td>
              <td className="pv2 ph3">
                {typeof product.price === 'number' ? `$${product.price.toLocaleString()}` : 'Sin Precio'}
              </td>
              <td className="pv2 ph3">
                {product.images.length > 0 ? (
                  <img src={product.images[0].imageUrl} alt={product.productName} width="100" />
                ) : (
                  <span>Sin Imagen</span>
                )}
              </td>
              <td className="pv2 ph3">
                <button
                  onClick={() => navigate(`/products/${product.productId}`)}
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt3">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="mr2 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib">
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="ml2 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductList;