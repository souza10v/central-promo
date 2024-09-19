import React, { useState } from 'react';

interface Product {
  imageUrl: string;
  mainPrice: string;
  installmentPrice: string;
  installmentInfo: string;
  discount: string;
  originalPrice: string; // Adicionar o preço original
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [url, setUrl] = useState<string>(''); // Estado para armazenar o link inserido
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3100/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }), // Enviar o link para o backend
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();

      // Formatar o produto com base na resposta do backend
      const formattedProduct: Product = {
        imageUrl: data.imageUrl || '',
        mainPrice: data.mainPrice || 'Preço não disponível',
        installmentPrice: data.installmentPrice || 'Não disponível',
        installmentInfo: data.installmentInfo ? `${data.installmentInfo}x` : 'Não disponível',
        discount: data.discount || 'Não disponível',
        originalPrice: data.originalPrice || 'Não disponível', // Adicionar o preço original
      };

      setProducts([formattedProduct]); // Atualizar o estado com o produto formatado
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Produtos</h1>
      
      <form onSubmit={handleSubmit}>
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
      </form>

      <div id="products" style={{ marginTop: '20px' }}>
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <img src={product.imageUrl} alt={`Produto ${index}`} style={{ width: '100px', height: 'auto', margin: '10px' }} />
                <p>Preço Original: {product.originalPrice}</p> {/* Exibir o preço original */}
                <p>Preço: {product.mainPrice}</p>
                <p>Parcelas: {product.installmentInfo} de {product.installmentPrice}</p>
                <p>Desconto: {product.discount}</p>
              </div>
            ))
          ) : (
            <p>Nenhum produto scrapeado ainda.</p>
          )
        )}
      </div>
    </div>
  );
}

export default App;
