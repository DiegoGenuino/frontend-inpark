# Guia Rápido - Componente Modal

## 🎯 Overview

O componente `Modal` é um diálogo/pop-up minimalista e versátil para o sistema InPark.

### ✨ Características

- ✅ Fecha com ESC (configurável)
- ✅ Fecha ao clicar fora (configurável)
- ✅ Previne scroll do body quando aberto
- ✅ Animações suaves de entrada/saída
- ✅ 4 tamanhos predefinidos (sm, md, lg, xl)
- ✅ Scroll interno quando conteúdo é grande
- ✅ Totalmente responsivo
- ✅ Acessível (aria-labels, foco)

---

## 📖 Uso Básico

### 1. Modal Simples

```jsx
import { useState } from 'react';
import { Modal, Button } from '@/components/shared';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Título do Modal"
      >
        <p>Conteúdo aqui</p>
      </Modal>
    </>
  );
}
```

### 2. Modal com Footer e Ações

```jsx
import { Modal, ModalBody, ModalFooter, ModalActions, Button } from '@/components/shared';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar"
  size="sm"
>
  <ModalBody>
    <p>Deseja continuar?</p>
  </ModalBody>
  <ModalFooter>
    <ModalActions>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirmar
      </Button>
    </ModalActions>
  </ModalFooter>
</Modal>
```

---

## 🎨 Variações de Tamanho

```jsx
// Pequeno (400px) - Para alertas/confirmações
<Modal size="sm" {...props}>

// Médio (600px) - Padrão, para a maioria dos casos
<Modal size="md" {...props}>

// Grande (800px) - Para formulários complexos
<Modal size="lg" {...props}>

// Extra Grande (1000px) - Para conteúdo extenso
<Modal size="xl" {...props}>
```

---

## 🔧 Configurações Especiais

### Desabilitar Fechar com ESC

```jsx
<Modal
  closeOnEsc={false}
  {...props}
>
```

### Desabilitar Fechar ao Clicar Fora

```jsx
<Modal
  closeOnOverlay={false}
  {...props}
>
```

### Ocultar Botão X de Fechar

```jsx
<Modal
  showCloseButton={false}
  {...props}
>
```

### Modal "Forçado" (não pode ser fechado facilmente)

```jsx
<Modal
  closeOnEsc={false}
  closeOnOverlay={false}
  showCloseButton={false}
  {...props}
>
  {/* Usuário deve clicar em um botão específico para fechar */}
</Modal>
```

---

## 📋 Casos de Uso Comuns

### 1. Confirmação de Exclusão

```jsx
<Modal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  title="Confirmar Exclusão"
  size="sm"
>
  <ModalBody>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <MdWarning style={{ color: '#f59e0b', fontSize: '2rem' }} />
      <div>
        <p><strong>Esta ação não pode ser desfeita</strong></p>
        <p>Tem certeza que deseja excluir este item?</p>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <ModalActions>
      <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Sim, Excluir
      </Button>
    </ModalActions>
  </ModalFooter>
</Modal>
```

### 2. Modal de Sucesso

```jsx
<Modal
  isOpen={showSuccess}
  onClose={() => setShowSuccess(false)}
  size="sm"
  showCloseButton={false}
>
  <ModalBody>
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <MdCheckCircle style={{ color: '#10b981', fontSize: '4rem' }} />
      <h3>Sucesso!</h3>
      <p>Operação realizada com sucesso.</p>
      <Button variant="primary" onClick={() => setShowSuccess(false)} fullWidth>
        Fechar
      </Button>
    </div>
  </ModalBody>
</Modal>
```

### 3. Formulário em Modal

```jsx
<Modal
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  title="Novo Cadastro"
  size="md"
>
  <form onSubmit={handleSubmit}>
    <ModalBody>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Nome</label>
          <input type="text" name="name" required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" required />
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <ModalActions>
        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Salvar
        </Button>
      </ModalActions>
    </ModalFooter>
  </form>
</Modal>
```

### 4. Modal de Informação

```jsx
<Modal
  isOpen={showInfo}
  onClose={() => setShowInfo(false)}
  title="Informações do Sistema"
  size="lg"
>
  <ModalBody>
    <h3>Versão 1.0.0</h3>
    <p>Sistema de Gerenciamento de Estacionamentos InPark</p>
    
    <h4>Funcionalidades</h4>
    <ul>
      <li>Gerenciamento de reservas</li>
      <li>Cadastro de veículos</li>
      <li>Pagamentos online</li>
    </ul>
  </ModalBody>
  <ModalFooter>
    <ModalActions>
      <Button variant="outline" onClick={() => setShowInfo(false)}>
        Fechar
      </Button>
    </ModalActions>
  </ModalFooter>
</Modal>
```

---

## 🎯 Boas Práticas

### ✅ DO (Faça)

- Use `size="sm"` para confirmações simples
- Use `size="md"` como padrão para a maioria dos casos
- Use `size="lg"` ou `xl` para formulários complexos ou conteúdo extenso
- Sempre forneça um `title` descritivo
- Use `ModalActions` para organizar botões
- Adicione ícones para melhorar a comunicação visual
- Desabilite `closeOnOverlay` para ações críticas

### ❌ DON'T (Não Faça)

- Não use modais dentro de modais
- Não sobrecarregue modais com muito conteúdo
- Não force o usuário a fechar modais informativos
- Não use modal para navegação principal
- Não esqueça de implementar `onClose`

---

## 📱 Responsividade

O Modal se adapta automaticamente:

- **Desktop (> 768px)**: Tamanhos definidos (400px, 600px, 800px, 1000px)
- **Mobile (< 768px)**: 100% da largura com padding lateral
- **Ações no Footer**: Stack vertical em mobile

---

## ♿ Acessibilidade

- Fecha com tecla ESC (padrão)
- Foco automático no modal ao abrir
- Aria-label no botão de fechar
- Previne scroll do body quando aberto
- Alto contraste nos textos e botões

---

## 🔄 Integração com Componentes Existentes

### Com Button

```jsx
<ModalFooter>
  <ModalActions>
    <Button variant="outline">Cancelar</Button>
    <Button variant="primary" loading={isLoading}>Salvar</Button>
  </ModalActions>
</ModalFooter>
```

### Com Badge

```jsx
<ModalHeader>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <h2>Status</h2>
    <Badge variant="success">Ativo</Badge>
  </div>
</ModalHeader>
```

### Com Card (dentro do Modal)

```jsx
<ModalBody>
  <Card variant="outlined">
    <CardBody>
      <p>Conteúdo dentro de um card</p>
    </CardBody>
  </Card>
</ModalBody>
```

---

## 🚀 Exemplos Completos

Veja o arquivo `ModalExamples.jsx` para exemplos completos e interativos de:

1. Modal Simples
2. Modal com Ações
3. Confirmação de Exclusão
4. Modal de Sucesso
5. Formulário em Modal
6. Modal Grande com Scroll
7. Modal Forçado
8. Modal com Badges e Ícones

---

## 📊 Props Completas

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOpen` | `boolean` | `false` | Controla visibilidade |
| `onClose` | `function` | - | Callback ao fechar |
| `title` | `string` | - | Título do modal |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamanho (400/600/800/1000px) |
| `closeOnOverlay` | `boolean` | `true` | Fecha ao clicar fora |
| `closeOnEsc` | `boolean` | `true` | Fecha com tecla ESC |
| `showCloseButton` | `boolean` | `true` | Mostra botão X |
| `className` | `string` | `''` | Classes CSS adicionais |
| `children` | `ReactNode` | - | Conteúdo do modal |

---

## 💡 Dicas

1. **Loading States**: Use a prop `loading` do Button nos ModalActions
2. **Validação**: Valide formulários antes de fechar o modal
3. **Feedback**: Use modais de sucesso/erro após ações importantes
4. **UX**: Mantenha modais simples e focados em uma tarefa
5. **Performance**: Não renderize modais complexos se não estiverem abertos (use `isOpen` para conditional rendering)

---

## 🎨 Customização de Estilos

```jsx
// Customizar largura máxima
<Modal className="custom-modal" size="md">
  {/* conteúdo */}
</Modal>
```

```css
.custom-modal {
  max-width: 750px !important;
}

.custom-modal .modal__body {
  padding: 2rem;
}
```

---

**Status**: ✅ Componente pronto para uso em produção
