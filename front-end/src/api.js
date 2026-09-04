const BASE_URL = 'http://localhost:4000/produtos';

export const api = {
  async list() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Não foi possível carregar os produtos do backend.');
    return res.json();
  },

  async create(data) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar produto no servidor.');
    return res.json();
  },

  async update(id, data) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar produto no servidor.');
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok && res.status !== 204) {
      throw new Error('Erro ao excluir produto no servidor.');
    }
    return true;
  }
};

export function formatBRL(value) {
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num);
}