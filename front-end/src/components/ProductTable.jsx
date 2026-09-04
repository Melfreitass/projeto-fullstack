import { Pencil, Trash2 } from 'lucide-react';
import { formatBRL } from '../api.js';
import styles from './ProductTable.module.css';

export function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Nenhum produto cadastrado ou correspondente à busca.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Nome</th>
            <th className={styles.th}>Categoria</th>
            <th className={`${styles.th} ${styles.thRight}`}>Estoque</th>
            <th className={`${styles.th} ${styles.thRight}`}>Preço</th>
            <th className={`${styles.th} ${styles.thRight}`}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            const qtd = Number(item.quantidade) || 0;
            const preco = Number(item.preco) || 0;

            return (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>
  <span className={styles.idText}>#{item.id}</span>
</td>
<td className={styles.td}>
  <span className={styles.nomeText}>{item.nome}</span>
</td>
<td className={styles.td}>
  <span className={styles.categoriaBadge}>{item.categoria}</span>
</td>
<td className={`${styles.td} ${styles.tdRight}`}>
  <span className={`${styles.stockBadge} ${qtd === 0 ? styles.outOfStock : qtd <= 5 ? styles.lowStock : styles.inStock}`}>
    {qtd} un
  </span>
</td>
<td className={`${styles.td} ${styles.tdRight}`}>
  <span className={styles.precoText}>{formatBRL(preco)}</span>
</td>
<td className={`${styles.td} ${styles.tdRight}`}>
  <div className={styles.actions}>
    <button
      type="button"
      className={styles.actionBtn}
      onClick={() => onEdit(item)}
      title="Editar"
    >
      <Pencil size={15} />
    </button>
    <button
      type="button"
      className={`${styles.actionBtn} ${styles.deleteBtn}`}
      onClick={() => onDelete(item)}
      title="Excluir"
    >
      <Trash2 size={15} />
    </button>
  </div>
</td>
</tr>
);
})}
</tbody>
</table>
</div>
);
}
// fim