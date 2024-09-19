import React, { useState } from 'react';

interface Product {
  imageUrl: string;
  productName: string;
  mainPrice: string;
  installmentPrice: string;
  installmentsInfo: string;
  discountPrice: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [magaluProducts, setMagaluProducts] = useState<Product[]>([]);
  const [url, setUrl] = useState<string>(''); 
  const [magaluUrl, setMagaluUrl] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);
  const [magaluLoading, setMagaluLoading] = useState<boolean>(false);

  // Função para buscar produtos gerais
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setProducts([]); // Limpar estado de produtos

    try {
      const response = await fetch('http://localhost:3100/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }), 
      });

      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.statusText);
      }

      const data = await response.json();
      const formattedProducts: Product[] = [{
        imageUrl: data.imageUrl || '',
        productName: data.productName || '',
        mainPrice: data.mainPrice || '',
        installmentPrice: data.installmentPrice || '',
        installmentsInfo: data.installmentsInfo || '',
        discountPrice: data.discountPrice || ''
      }];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar produtos Magalu
  const handleMagaluSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMagaluLoading(true);
    setMagaluProducts([]); // Limpar estado de produtos Magalu

    try {
      const response = await fetch('http://127.0.0.1:5001/produto-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: magaluUrl }), 
      });

      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.statusText);
      }

      const data = await response.json();
      const formattedMagaluProducts: Product[] = [{
        imageUrl: data.imageUrl || '',
        productName: data.productName || '',
        mainPrice: data.mainPrice || '',
        installmentPrice: data.installmentPrice || '',
        installmentsInfo: data.installmentsInfo || '',
        discountPrice: data.discountPrice || ''
      }];

      setMagaluProducts(formattedMagaluProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos Magalu:', error);
    } finally {
      setMagaluLoading(false);
    }
  };

  return (
    <div>
      {/* <h1>Produtos</h1> */}

      {/* Formulário para produtos gerais */}
      {/* <form onSubmit={handleSubmit}>
        <label>
          Insira o link da página:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Digite o link"
            required
            style={{ marginRight: '10px', width: '300px' }}
          />
        </label>
        <button type="submit" disabled={loading}>Buscar</button>
      </form> */}

      {/* <div id="products" style={{ marginTop: '20px' }}>
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={`Produto ${index}`} style={{ width: '100px', height: 'auto', margin: '10px' }} />
                )}
                <p>Preço: {product.mainPrice}</p>
                <p>Parcelas: {product.installmentsInfo} de {product.installmentPrice}</p>
                <p>Desconto: {product.discountPrice}</p>
              </div>
            ))
          ) : (
            <p>Nenhum produto scrapeado ainda.</p>
          )
        )}
      </div> */}
  
  
      <h2>Produtos Magalu</h2>

      {/* Formulário para produtos Magalu */}
      <form onSubmit={handleMagaluSubmit}>
        <label>
          Insira o link da página Magalu:
          <input
            type="text"
            value={magaluUrl}
            onChange={(e) => setMagaluUrl(e.target.value)}
            placeholder="Digite o link Magalu"
            required
            style={{ marginRight: '10px', width: '300px' }}
          />
        </label>
        <button type="submit" disabled={magaluLoading}>Buscar</button>
      </form>

      <div id="magalu-products" style={{ marginTop: '20px' }}>
        {magaluLoading ? (
          <p>Carregando produtos Magalu...</p>
        ) : (
          magaluProducts.length > 0 ? (
            magaluProducts.map((product, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={`Produto Magalu ${index}`} style={{ width: '100px', height: 'auto', margin: '10px' }} />
                )}
                <p>Preço: {product.productName}</p>
                <p>Parcelas: {product.installmentsInfo}x de R$ {product.installmentPrice}</p>
                <p>Preço total: {product.mainPrice}</p>
                <p>Preço desconto: {product.discountPrice}</p>
              </div>
            ))
          ) : (
            <p>Nenhum produto Magalu scrapeado ainda.</p>
          )
        )}
      </div>
    </div>
  );
}

export default App;
