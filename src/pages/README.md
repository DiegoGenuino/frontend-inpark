# Estrutura de Páginas Organizada

Esta pasta contém todas as páginas da aplicação organizadas por funcionalidade/assunto para melhor manutenibilidade e escalabilidade.

## 📁 Estrutura das Pastas

### 🔐 **auth/** - Autenticação
- `Login.jsx` - Página de login do usuário
- `Signup.jsx` - Página de cadastro/registro

### 🏠 **dashboard/** - Dashboard Principal
- `Dashboard.jsx` - Dashboard principal com estatísticas e acesso rápido

### 🅿️ **estacionamentos/** - Gestão de Estacionamentos
- `Estacionamentos.jsx` - Lista e busca de estacionamentos
- `DetalhesEstacionamento.jsx` - Detalhes específicos de um estacionamento

### 📅 **reservas/** - Gestão de Reservas
- `MinhasReservas.jsx` - Lista de reservas do usuário (histórico e ativas)
- `CriacaoReserva.jsx` - Criação de nova reserva

### 💳 **pagamentos/** - Fluxo de Pagamento
- `Pagamento.jsx` - Página de pagamento
- `ConfirmacaoPagamento.jsx` - Confirmação do pagamento realizado

### 👤 **perfil/** - Gestão do Perfil do Usuário
- `MeuPerfil.jsx` - Dados pessoais e configurações do usuário
- `MeusCarros.jsx` - Gestão dos veículos cadastrados
- `Notificacoes.jsx` - Centro de notificações e alertas

### ⭐ **avaliacoes/** - Sistema de Avaliações
- `Avaliacao.jsx` - Página para avaliar serviços e estacionamentos

## 🎯 **Benefícios da Organização**

- **Escalabilidade**: Fácil adição de novas funcionalidades
- **Manutenibilidade**: Localização rápida de arquivos relacionados
- **Colaboração**: Estrutura clara para trabalho em equipe
- **Reutilização**: Imports organizados com arquivos index.js
- **Performance**: Possibilidade de lazy loading por módulo

## 🔄 **Como Usar**

### Import Individual:
```javascript
import { Login } from './pages/auth/Login.jsx';
```

### Import via Index (Recomendado):
```javascript
import { Login, Signup } from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { Estacionamentos, DetalhesEstacionamento } from './pages/estacionamentos';
```

## 📝 **Convenções**

- Cada pasta contém um arquivo `index.js` para facilitar imports
- Arquivos CSS permanecem junto com seus respectivos JSX
- Paths relativos ajustados para a nova estrutura (`../../utils/auth`)
- Nomes de pastas em minúsculo e descritivos

## 🚀 **Próximos Passos**

- Implementar lazy loading por módulo
- Adicionar testes organizados por funcionalidade
- Considerar sub-organizações conforme crescimento
- Documentar APIs específicas de cada módulo