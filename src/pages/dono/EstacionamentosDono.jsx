import React, { useEffect, useState, useCallback } from 'react';
import { donoService } from '../../utils/services';
import { Toast } from '../../components/shared';

const EstacionamentosDono = () => {
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await donoService.getMeusEstacionamentos();
      setEstacionamentos(Array.isArray(data) ? data : (data.content || []));
    } catch (e) {
      setError(e.message || 'Erro ao carregar estacionamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Meus Estacionamentos</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Meus Estacionamentos</h1>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {estacionamentos.length === 0 && !error && (
        <p>Nenhum estacionamento cadastrado ainda.</p>
      )}
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
        {estacionamentos.map(est => (
          <div key={est.id || est.codigo} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1rem',
            background: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ margin: '0 0 .5rem 0', fontSize: '1rem' }}>{est.nome || est.name || 'Sem nome'}</h3>
            <p style={{ margin: 0, fontSize: '.875rem', color: '#6b7280' }}>{est.endereco || est.address || 'Endereço não informado'}</p>
            <div style={{ marginTop: '.75rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <span style={{ fontSize: '.75rem', color: '#374151' }}>Vagas: {est.totalVagas ?? est.vagasTotais ?? '—'}</span>
              <span style={{ fontSize: '.75rem', color: '#374151' }}>Ocupação: {est.ocupacaoPercentual ? `${est.ocupacaoPercentual}%` : '—'}</span>
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EstacionamentosDono;
