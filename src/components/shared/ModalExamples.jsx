import React, { useState } from 'react';
import { MdInfo, MdWarning, MdCheckCircle, MdError, MdDelete } from 'react-icons/md';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalActions } from './Modal';
import Button from './Button';
import Badge from './Badge';

/**
 * Exemplos de uso do componente Modal
 */

// Exemplo 1: Modal Simples
export const SimpleModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Modal Simples
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Simples"
        size="md"
      >
        <p>Este é um exemplo de modal simples com título e conteúdo básico.</p>
        <p>O modal fecha ao clicar no X, pressionar ESC ou clicar fora dele.</p>
      </Modal>
    </>
  );
};

// Exemplo 2: Modal com Ações
export const ModalWithActionsExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    console.log('Salvando...');
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Modal com Ações
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmar Ação"
        size="sm"
      >
        <ModalBody>
          <p>Você tem certeza que deseja realizar esta ação?</p>
        </ModalBody>
        <ModalFooter>
          <ModalActions>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Confirmar
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>
    </>
  );
};

// Exemplo 3: Modal de Confirmação de Exclusão
export const DeleteConfirmModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log('Deletando item...');
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)} icon={<MdDelete />}>
        Excluir Item
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmar Exclusão"
        size="sm"
        closeOnOverlay={false}
      >
        <ModalBody>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <MdWarning style={{ color: '#f59e0b', fontSize: '2rem', flexShrink: 0 }} />
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                Esta ação não pode ser desfeita
              </p>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Tem certeza que deseja excluir este item? Todos os dados relacionados serão perdidos permanentemente.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalActions>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Sim, Excluir
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>
    </>
  );
};

// Exemplo 4: Modal de Sucesso
export const SuccessModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Mostrar Sucesso
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="sm"
        showCloseButton={false}
      >
        <ModalBody>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <MdCheckCircle style={{ color: '#10b981', fontSize: '4rem', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827' }}>
              Operação Realizada com Sucesso!
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
              Seus dados foram salvos com sucesso.
            </p>
            <Button variant="primary" onClick={() => setIsOpen(false)} fullWidth>
              Fechar
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

// Exemplo 5: Modal com Formulário
export const FormModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Formulário em Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Cadastro de Usuário"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalActions>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Salvar
              </Button>
            </ModalActions>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

// Exemplo 6: Modal Grande com Conteúdo Longo
export const LargeModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Modal Grande
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Termos e Condições"
        size="lg"
      >
        <ModalBody>
          <h3>1. Aceitação dos Termos</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          
          <h3>2. Uso do Serviço</h3>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          
          <h3>3. Privacidade</h3>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          
          <h3>4. Responsabilidades</h3>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          
          <h3>5. Modificações</h3>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
        </ModalBody>
        <ModalFooter>
          <ModalActions>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Recusar
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Aceitar
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>
    </>
  );
};

// Exemplo 7: Modal sem Fechar no Overlay
export const ModalNoOverlayCloseExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Modal Forçado
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Atenção Obrigatória"
        size="sm"
        closeOnOverlay={false}
        closeOnEsc={false}
        showCloseButton={false}
      >
        <ModalBody>
          <div style={{ textAlign: 'center' }}>
            <MdInfo style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '1rem' }} />
            <p>Este modal só pode ser fechado clicando no botão abaixo.</p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Não é possível fechar com ESC ou clicando fora.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalActions>
            <Button variant="primary" onClick={() => setIsOpen(false)} fullWidth>
              Entendi
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>
    </>
  );
};

// Exemplo 8: Modal com Badge e Ícones
export const ModalWithBadgesExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Modal Estilizado
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
      >
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Status do Sistema</h2>
            <Badge variant="success" dot>Operacional</Badge>
          </div>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MdCheckCircle style={{ color: '#10b981', fontSize: '1.5rem' }} />
              <div style={{ flex: 1 }}>
                <strong>Servidor Principal</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  Todos os sistemas funcionando normalmente
                </p>
              </div>
              <Badge variant="success" size="sm">Online</Badge>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MdCheckCircle style={{ color: '#10b981', fontSize: '1.5rem' }} />
              <div style={{ flex: 1 }}>
                <strong>Banco de Dados</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  Conexão estável
                </p>
              </div>
              <Badge variant="success" size="sm">Online</Badge>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MdWarning style={{ color: '#f59e0b', fontSize: '1.5rem' }} />
              <div style={{ flex: 1 }}>
                <strong>API Externa</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  Resposta lenta detectada
                </p>
              </div>
              <Badge variant="warning" size="sm">Lento</Badge>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalActions>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default {
  SimpleModalExample,
  ModalWithActionsExample,
  DeleteConfirmModalExample,
  SuccessModalExample,
  FormModalExample,
  LargeModalExample,
  ModalNoOverlayCloseExample,
  ModalWithBadgesExample
};
