import React, { useEffect, useState, useCallback } from 'react';
import services from '../../utils/services';

const FinanceiroDono = () => {
  const [valores, setValores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchValores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await services.valor.getAll();
      setValores(Array.isArray(data) ? data : (data.content || []));
    } catch (e) {
      setError(e.message || 'Erro ao carregar valores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchValores();
  }, [fetchValores]);

  const total = valores.reduce((sum, v) => sum + (Number(v.valor) || 0), 0);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Financeiro</h1>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem', background: '#fff' }}>
              <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>Itens de valor</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{valores.length}</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem', background: '#fff' }}>
              <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>Total (soma)</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>R$ {total.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['ID','Descrição','Valor','Criado em'].map(h => (
                    <th key={h} style={{ padding: '.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: 12, letterSpacing: '.05em', textTransform: 'uppercase', color: '#6b7280' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {valores.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '.75rem', color: '#6b7280' }}>#{String(v.id).padStart(4,'0')}</td>
                    <td style={{ padding: '.75rem' }}>{v.descricao || v.nome || '—'}</td>
                    <td style={{ padding: '.75rem' }}>R$ {(Number(v.valor) || 0).toFixed(2)}</td>
                    <td style={{ padding: '.75rem' }}>{v.criadoEm || v.createdAt || '—'}</td>
                  </tr>
                ))}
                {valores.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>Nenhum valor cadastrado ainda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceiroDono;
