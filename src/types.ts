// src/types.ts
// ============================================================================
// Tipos e Interfaces globais para App e Dashboard
// ============================================================================

// === Tipos de App ===
export type UserRole = 'admin' | 'gestor' | 'coordenador' | 'auditor' | 'agricultor' | 'guest';

export type Page =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'farmer-register'
  | 'auditor-register';

// === Tipos do Dashboard ===
export type DashboardView = 
  | 'visao-geral' 
  | 'certificacoes' 
  | 'agricultores' 
  | 'auditores' 
  | 'auditorias' 
  | 'financas' 
  | 'lotes' 
  | 'relatorios' 
  | 'configuracoes';

// === Dados de Certificações ===
export interface Certification {
  id: string;
  nome: string;
  nivel: 'Bronze' | 'Prata' | 'Ouro';
  agricultor: string;
  auditor: string;
  status: 'Ativo' | 'Vencido' | 'Pendente';
  validade: number; // timestamp
}

// === Dados de Agricultores ===
export interface Farmer {
  id: string;
  nomePropriedade: string;
  proprietario: string;
  localizacao: string;
  statusCertificacao: 'Certificado' | 'Em Avaliação' | 'Rejeitado';
  lastActivity: number; // timestamp
}

// === Dados de Auditores ===
export interface Auditor {
  id: string;
  nome: string;
  registro: string;
  especialidade: string;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  lastAudit: number; // timestamp
}

// === Dados de Auditorias (Agendamentos) ===
export interface Audit {
  id: string;
  certificacao: string;
  agricultor: string;
  auditor: string;
  dataAgendada: number; // timestamp
  status: 'Concluída' | 'Em Andamento' | 'Cancelada';
}

// === Dados de Lotes de Produção ===
export interface Batch {
  id: string;
  produto: string;
  agricultor: string;
  dataColheita: number; // timestamp
  statusRastreio: 'Pronto Venda' | 'Em Processamento' | 'Em Campo';
  certificacaoID: string;
}

// === Dados de Faturamento / Transações ===
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  date: number; // timestamp
}

// ============================================================================
// FIM DOS TIPOS GLOBAIS
// ============================================================================
