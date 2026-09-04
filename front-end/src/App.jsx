import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { api, formatBRL } from './api.js';
import { ProductTable } from './components/ProductTable.jsx';
import { ProductModal } from './components/ProductModal.jsx';
import styles from './App.module.css';

export function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.list();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Erro ao conectar à API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (productToEdit) {
      await api.update(productToEdit.id, formData);
    } else {
      await api.create(formData);
    }
    await loadProducts();
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Deseja realmente excluir "${product.nome}"?`);
    if (!confirmed) return;

    try {
      await api.delete(product.id);
      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };
  
  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.nome?.toLowerCase().includes(term) ||
      p.categoria?.toLowerCase().includes(term) ||
      String(p.id).includes(term)
    );
  });

  const totalStock = products.reduce((acc, p) => acc + (Number(p.quantidade) || 0), 0);
  const totalValue = products.reduce(
    (acc, p) => acc + (Number(p.quantidade) || 0) * (Number(p.preco) || 0),
    0
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Estoque</h1>
            <p className={styles.subtitle}>Gestão e controle de produtos</p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.refreshBtn}
              onClick={loadProducts}
              disabled={loading}
              title="Recarregar"
            >
              <RefreshCw size={15} className={loading ? styles.spinning : ''} />
              </button>

            <button
              type="button"
              className={styles.addBtn}
              onClick={handleOpenCreate}
            >
              <Plus size={16} />
              <span>Novo Produto</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Barra de resumo soft */}
        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Itens cadastrados</span>
            <span className={styles.summaryValue}>{products.length}</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total em estoque</span>
            <span className={styles.summaryValue}>{totalStock} un</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Valor do estoque</span>
            <span className={styles.summaryValue}>{formatBRL(totalValue)}</span>
          </div>
        </div>

        {/* Busca */}
        <div className={styles.searchRow}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar por nome ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Mensagem de Erro de Conexão com o Backend */}
        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} className={styles.errorIcon} />
            <div className={styles.errorText}>
              <p><strong>Servidor backend desconectado:</strong> {error}</p>
              <span className={styles.errorHint}>
                Certifique-se de que o backend está rodando em http://localhost:4000.
              </span>
            </div>
            <button type="button" className={styles.retryBtn} onClick={loadProducts}>
              Tentar novamente
            </button>
          </div>
        )}

        {/* Tabela ou Loading */}
        {loading && !products.length ? (
          <div className={styles.loading}>
            <RefreshCw size={20} className={styles.spinning} />
            <span>Carregando dados do estoque...</span>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        productToEdit={productToEdit}
      />
    </div>
  );
}

export default App;
//fim