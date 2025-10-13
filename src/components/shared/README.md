# Componentes Compartilhados - Design System Minimalista

Este diretório contém os componentes reutilizáveis do sistema InPark, seguindo um design minimalista e consistente.

## 🎨 Filosofia de Design

- **Minimalismo**: Design limpo e funcional
- **Consistência**: Espaçamento e cores padronizados
- **Responsividade**: Adaptação fluida para diferentes telas
- **Acessibilidade**: Componentes acessíveis por padrão

### Paleta de Cores

```css
/* Cores Principais */
--dark: #111827      /* Texto principal, botões primários */
--gray: #6b7280      /* Texto secundário, ícones */
--light-gray: #e5e7eb /* Bordas, divisores */
--bg-light: #f3f4f6  /* Fundos secundários */
--bg-lighter: #f9fafb /* Fundos alternativos */
--white: #ffffff     /* Fundos de cards */

/* Cores Semânticas */
--success: #10b981   /* Status positivo */
--warning: #f59e0b   /* Avisos */
--danger: #ef4444    /* Erros, ações destrutivas */
--info: #3b82f6      /* Informações */
```

### Sistema de Espaçamento

Todos os espaçamentos seguem múltiplos de `0.25rem` (4px):
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 0.75rem (12px)
- **lg**: 1rem (16px)
- **xl**: 1.5rem (24px)

---

## 📦 Componentes Disponíveis

### 1. Card

Componente base para containers de conteúdo.

#### Uso

```jsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/shared';

<Card variant="outlined" padding="md" hoverable>
  <CardHeader>
    <h3>Título</h3>
  </CardHeader>
  <CardBody>
    <p>Conteúdo principal</p>
  </CardBody>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'default' \| 'outlined' \| 'flat'` | `'default'` | Estilo visual do card |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do padding interno |
| `hoverable` | `boolean` | `false` | Adiciona efeito hover |
| `onClick` | `function` | - | Handler de clique |
| `className` | `string` | - | Classes CSS adicionais |

---

### 2. Button

Botão estilizado com múltiplas variantes.

#### Uso

```jsx
import { Button } from '@/components/shared';

<Button 
  variant="primary" 
  size="md"
  icon={<MdAdd />}
  onClick={handleClick}
>
  Adicionar
</Button>
```

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do botão |
| `fullWidth` | `boolean` | `false` | Ocupa toda a largura |
| `disabled` | `boolean` | `false` | Desabilita o botão |
| `loading` | `boolean` | `false` | Mostra spinner de loading |
| `icon` | `ReactNode` | - | Ícone do botão |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posição do ícone |
| `onClick` | `function` | - | Handler de clique |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo HTML do botão |

---

### 3. Badge

Indicador visual para status e categorias.

#### Uso

```jsx
import { Badge } from '@/components/shared';

<Badge variant="success" size="sm" dot>
  Ativo
</Badge>
```

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'dark'` | `'default'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do badge |
| `dot` | `boolean` | `false` | Adiciona indicador dot |
| `className` | `string` | - | Classes CSS adicionais |

---

### 4. Modal

Componente para diálogos e pop-ups.

#### Uso

```jsx
import { Modal, ModalBody, ModalFooter, ModalActions } from '@/components/shared';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título do Modal"
  size="md"
>
  <ModalBody>
    <p>Conteúdo do modal</p>
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

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOpen` | `boolean` | `false` | Controla visibilidade do modal |
| `onClose` | `function` | - | Callback para fechar |
| `title` | `string` | - | Título do modal |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamanho do modal |
| `closeOnOverlay` | `boolean` | `true` | Fecha ao clicar fora |
| `closeOnEsc` | `boolean` | `true` | Fecha ao pressionar ESC |
| `showCloseButton` | `boolean` | `true` | Mostra botão X |
| `className` | `string` | - | Classes CSS adicionais |

#### Sub-componentes

- **ModalHeader**: Cabeçalho customizado
- **ModalBody**: Corpo do modal (scrollable)
- **ModalFooter**: Rodapé com bordas
- **ModalActions**: Container para botões (com alinhamento)

#### Exemplos Avançados

**Modal de Confirmação:**
```jsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirmar Ação"
  size="sm"
  closeOnOverlay={false}
>
  <ModalBody>
    <p>Tem certeza que deseja continuar?</p>
  </ModalBody>
  <ModalFooter>
    <ModalActions>
      <Button variant="outline" onClick={onClose}>Não</Button>
      <Button variant="danger" onClick={handleConfirm}>Sim</Button>
    </ModalActions>
  </ModalFooter>
</Modal>
```

**Modal com Formulário:**
```jsx
<Modal isOpen={isOpen} onClose={onClose} title="Novo Item">
  <form onSubmit={handleSubmit}>
    <ModalBody>
      {/* Campos do formulário */}
    </ModalBody>
    <ModalFooter>
      <ModalActions>
        <Button type="button" variant="outline" onClick={onClose}>
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

---

### 5. ParkingCard

Card especializado para exibir informações de estacionamentos.

#### Uso

```jsx
import { ParkingCard } from '@/components/shared';

<ParkingCard
  parking={parkingData}
  onReserve={handleReserve}
  onViewDetails={handleViewDetails}
/>
```

#### Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `parking` | `object` | Dados do estacionamento |
| `onReserve` | `function` | Callback para reservar |
| `onViewDetails` | `function` | Callback para ver detalhes |

#### Estrutura do Objeto `parking`

```typescript
{
  id: number;
  nome: string;
  endereco: string;
  numero: string;
  CEP: string;
  horaAbertura: string;  // "HH:MM:SS"
  horaFechamento: string; // "HH:MM:SS"
  maximoDeVagas: number;
  vagasOcupadas?: number;
  vagasPreferenciais: number;
}
```

---

### 6. CarCard

Card especializado para exibir informações de veículos.

#### Uso

```jsx
import { CarCard } from '@/components/shared';

<CarCard
  car={carData}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onSetPrincipal={handleSetPrincipal}
/>
```

#### Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `car` | `object` | Dados do veículo |
| `onEdit` | `function` | Callback para editar |
| `onDelete` | `function` | Callback para excluir |
| `onSetPrincipal` | `function` | Callback para definir como principal |

#### Estrutura do Objeto `car`

```typescript
{
  id: number;
  placa: string;
  modelo: string;
  cor: string;
  apelido?: string;
  vagaPreferencial: boolean;
  principal: boolean;
}
```

---

## 🎯 Boas Práticas

### 1. Uso de Variantes

Escolha a variante apropriada para cada contexto:

```jsx
// Ação primária (destaque)
<Button variant="primary">Salvar</Button>

// Ação secundária
<Button variant="secondary">Cancelar</Button>

// Ação alternativa/discreta
<Button variant="outline">Ver Detalhes</Button>

// Ação não intrusiva
<Button variant="ghost">Editar</Button>

// Ação destrutiva
<Button variant="danger">Excluir</Button>
```

### 2. Composição de Cards

Use os sub-componentes para estruturar o conteúdo:

```jsx
<Card>
  <CardHeader>
    {/* Título, badges, ícones */}
  </CardHeader>
  <CardBody>
    {/* Conteúdo principal */}
  </CardBody>
  <CardFooter>
    {/* Ações, botões */}
  </CardFooter>
</Card>
```

### 3. Badges para Status

```jsx
// Status positivo
<Badge variant="success">Disponível</Badge>

// Status de aviso
<Badge variant="warning">Médio</Badge>

// Status crítico
<Badge variant="danger">Lotado</Badge>

// Informação
<Badge variant="info">Novo</Badge>
```

### 4. Responsividade

Os componentes são responsivos por padrão. Use breakpoints para ajustes específicos:

```css
@media (max-width: 768px) {
  /* Ajustes para mobile */
}

@media (max-width: 480px) {
  /* Ajustes para telas pequenas */
}
```

---

## 🔧 Personalização

### Estendendo Componentes

Todos os componentes aceitam `className` para estilos adicionais:

```jsx
<Button className="meu-botao-customizado">
  Clique Aqui
</Button>
```

```css
.meu-botao-customizado {
  min-width: 200px;
}
```

### Criando Novos Componentes

Ao criar novos componentes, siga os padrões:

1. **Estrutura de Arquivo**
   ```
   NomeDoComponente.jsx
   NomeDoComponente.css
   ```

2. **Nomenclatura CSS**
   ```css
   .nome-do-componente { }
   .nome-do-componente__elemento { }
   .nome-do-componente--modificador { }
   ```

3. **Props Padrão**
   - `className` para customização
   - `size` para variações de tamanho
   - `variant` para variações visuais

---

## 📱 Responsividade

Todos os componentes seguem os breakpoints:

- **Desktop**: > 1200px
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

---

## ♿ Acessibilidade

- Todos os botões têm states de `focus` visíveis
- Componentes interativos têm `cursor: pointer`
- Estados disabled claramente indicados
- Contraste de cores adequado (WCAG AA)

---

## 🚀 Próximos Componentes

Componentes planejados para futuras versões:

- [ ] Input (campos de texto)
- [ ] Select (dropdown)
- [ ] Checkbox
- [ ] Radio
- [ ] Modal
- [ ] Toast/Notification
- [ ] Tooltip
- [ ] Tabs
- [ ] Table
- [ ] Pagination

---

## 📚 Referências

- Design inspirado em sistemas minimalistas
- Seguindo princípios de Material Design
- Focado em UX/UI limpo e funcional
