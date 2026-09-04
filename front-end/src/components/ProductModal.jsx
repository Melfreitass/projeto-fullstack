import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validateProduct } from '../schema.js';
import styles from './ProductModal.module.css';

export function ProductModal({ isOpen, onClose, onSave, productToEdit }) {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    quantidade: '',
    preco: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData({
          nome: productToEdit.nome || '',
          categoria: productToEdit.categoria || '',
          quantidade: String(productToEdit.quantidade ?? ''),
          preco: String(productToEdit.preco ?? '')
        });
      } else {
        setFormData({ nome: '', categoria: '', quantidade: '', preco: '' });
      }
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const isEditing = Boolean(productToEdit);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateProduct(formData);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);
      await onSave(validation.data);
      onClose();
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {errors.form && <div className={styles.formError}>{errors.form}</div>}

          <div className={styles.field}>
            <label htmlFor="nome" className={styles.label}>Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
              placeholder="Ex: Mouse sem fio"
              value={formData.nome}
              onChange={handleChange}
              autoFocus
            />
            {errors.nome && <span className={styles.errorText}>{errors.nome}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="categoria" className={styles.label}>Categoria</label>
            <input
              id="categoria"
              name="categoria"
              type="text"
              className={`${styles.input} ${errors.categoria ? styles.inputError : ''}`}
              placeholder="Ex: Periféricos"
              value={formData.categoria}
              onChange={handleChange}
            />
            {errors.categoria && <span className={styles.errorText}>{errors.categoria}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="quantidade" className={styles.label}>Quantidade</label>
              <input
                id="quantidade"
                name="quantidade"
                type="number"
                min="0"
                className={`${styles.input} ${errors.quantidade ? styles.inputError : ''}`}
                placeholder="0"
                value={formData.quantidade}
                onChange={handleChange}
              />
              {errors
.quantidade && <span className={styles.errorText}>{errors.quantidade}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="preco" className={styles.label}>Preço (R$)</label>
              <input
                id="preco"
                name="preco"
                type="text"
                className={`${styles.input} ${errors.preco ? styles.inputError : ''}`}
                placeholder="0.00"
                value={formData.preco}
                onChange={handleChange}
              />
              {errors.preco && <span className={styles.errorText}>{errors.preco}</span>}
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// fim