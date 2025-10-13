import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button, 
  Badge,
  ParkingCard,
  CarCard
} from './index';
import { MdAdd, MdEdit, MdDelete, MdLocationOn } from 'react-icons/md';

/**
 * Exemplos de uso dos componentes compartilhados
 * Este arquivo serve como referência de implementação
 */

// ==========================================
// EXEMPLO 1: Card Básico
// ==========================================
const ExemploCardBasico = () => (
  <Card variant="outlined" padding="md">
    <CardBody>
      <h3>Card Simples</h3>
      <p>Este é um exemplo de card básico com conteúdo.</p>
    </CardBody>
  </Card>
);

// ==========================================
// EXEMPLO 2: Card Completo
// ==========================================
const ExemploCardCompleto = () => (
  <Card variant="default" padding="lg" hoverable>
    <CardHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Título do Card</h3>
        <Badge variant="success" size="sm" dot>
          Ativo
        </Badge>
      </div>
    </CardHeader>
    
    <CardBody>
      <p>Conteúdo principal do card com informações detalhadas.</p>
      <p>Múltiplos parágrafos ou componentes podem ser adicionados aqui.</p>
    </CardBody>
    
    <CardFooter>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="primary" size="md">
          Confirmar
        </Button>
        <Button variant="outline" size="md">
          Cancelar
        </Button>
      </div>
    </CardFooter>
  </Card>
);

// ==========================================
// EXEMPLO 3: Botões
// ==========================================
const ExemploBotoes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {/* Variantes */}
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>

    {/* Tamanhos */}
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>

    {/* Com Ícones */}
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button variant="primary" icon={<MdAdd />}>
        Adicionar
      </Button>
      <Button variant="outline" icon={<MdEdit />}>
        Editar
      </Button>
      <Button variant="danger" icon={<MdDelete />}>
        Excluir
      </Button>
    </div>

    {/* Estados */}
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button variant="primary" disabled>
        Desabilitado
      </Button>
      <Button variant="primary" loading>
        Carregando...
      </Button>
    </div>

    {/* Full Width */}
    <Button variant="primary" fullWidth>
      Botão Largo
    </Button>
  </div>
);

// ==========================================
// EXEMPLO 4: Badges
// ==========================================
const ExemploBadges = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {/* Variantes */}
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Sucesso</Badge>
      <Badge variant="warning">Aviso</Badge>
      <Badge variant="danger">Perigo</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="dark">Dark</Badge>
    </div>

    {/* Com Dot */}
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="success" dot>Ativo</Badge>
      <Badge variant="warning" dot>Pendente</Badge>
      <Badge variant="danger" dot>Inativo</Badge>
    </div>

    {/* Tamanhos */}
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Badge variant="info" size="sm">Small</Badge>
      <Badge variant="info" size="md">Medium</Badge>
      <Badge variant="info" size="lg">Large</Badge>
    </div>
  </div>
);

// ==========================================
// EXEMPLO 5: ParkingCard
// ==========================================
const ExemploParkingCard = () => {
  const parkingData = {
    id: 1,
    nome: "Estacionamento Central",
    endereco: "Rua das Flores",
    numero: "123",
    CEP: "12345-678",
    horaAbertura: "08:00:00",
    horaFechamento: "22:00:00",
    maximoDeVagas: 120,
    vagasOcupadas: 80,
    vagasPreferenciais: 15
  };

  const handleReserve = (parking) => {
    console.log('Reservar:', parking);
  };

  const handleViewDetails = (parking) => {
    console.log('Ver detalhes:', parking);
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <ParkingCard
        parking={parkingData}
        onReserve={handleReserve}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

// ==========================================
// EXEMPLO 6: CarCard
// ==========================================
const ExemploCarCard = () => {
  const carData = {
    id: 1,
    placa: "ABC1D23",
    modelo: "Chevrolet Onix",
    cor: "Prata",
    apelido: "Carro do Trabalho",
    vagaPreferencial: false,
    principal: true
  };

  const handleEdit = (car) => {
    console.log('Editar:', car);
  };

  const handleDelete = (car) => {
    console.log('Excluir:', car);
  };

  const handleSetPrincipal = (carId) => {
    console.log('Definir como principal:', carId);
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <CarCard
        car={carData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSetPrincipal={handleSetPrincipal}
      />
    </div>
  );
};

// ==========================================
// EXEMPLO 7: Layout Completo
// ==========================================
const ExemploLayoutCompleto = () => (
  <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Card variant="default" padding="lg" style={{ marginBottom: '2rem' }}>
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0' }}>Painel de Controle</h1>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Gerencie seus estacionamentos e veículos
              </p>
            </div>
            <Button variant="primary" icon={<MdAdd />}>
              Novo Item
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Grid de Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Card de Estatística 1 */}
        <Card variant="outlined" padding="md" hoverable>
          <CardBody>
            <Badge variant="success" size="sm" dot>
              Ativo
            </Badge>
            <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Total de Vagas</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              150
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
              +12% em relação ao mês passado
            </p>
          </CardBody>
        </Card>

        {/* Card de Estatística 2 */}
        <Card variant="outlined" padding="md" hoverable>
          <CardBody>
            <Badge variant="warning" size="sm" dot>
              Médio
            </Badge>
            <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Ocupação Atual</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              75%
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
              90 vagas ocupadas
            </p>
          </CardBody>
        </Card>

        {/* Card de Estatística 3 */}
        <Card variant="outlined" padding="md" hoverable>
          <CardBody>
            <Badge variant="info" size="sm" dot>
              Hoje
            </Badge>
            <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Reservas</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              24
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
              6 pendentes de confirmação
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Card com Ações */}
      <Card variant="default" padding="lg" style={{ marginTop: '2rem' }}>
        <CardHeader>
          <h2 style={{ margin: 0 }}>Ações Rápidas</h2>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Button variant="primary" icon={<MdAdd />} fullWidth>
              Nova Reserva
            </Button>
            <Button variant="outline" icon={<MdLocationOn />} fullWidth>
              Ver Estacionamentos
            </Button>
            <Button variant="secondary" icon={<MdEdit />} fullWidth>
              Meus Carros
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
);

// ==========================================
// Exportar Exemplos
// ==========================================
export {
  ExemploCardBasico,
  ExemploCardCompleto,
  ExemploBotoes,
  ExemploBadges,
  ExemploParkingCard,
  ExemploCarCard,
  ExemploLayoutCompleto
};

// Exemplo de uso padrão
export default ExemploLayoutCompleto;
