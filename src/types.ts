// ============================================================================
// Tipos e Interfaces globais para o Painel de Gestão
// ============================================================================

// --- Tipos de Navegação ---
export type DashboardView = 
  'visao-geral' | 
  'certificacoes' | 
  'agricultores' | 
  'auditores' | 
  'auditorias' | 
  'financas' | 
  'lotes' | 
  'relatorios' | 
  'configuracoes';

// --- Dados de Certificações ---
export interface Certification {
  id: string;
  nome: string;
  nivel: 'Bronze' | 'Prata' | 'Ouro';
  agricultor: string;
  auditor: string;
  status: 'Ativo' | 'Vencido' | 'Pendente';
  validade: number; // Timestamp
}

// --- Dados de Agricultores ---
export interface Farmer {
  id: string;
  nomePropriedade: string;
  proprietario: string;
  localizacao: string;
  statusCertificacao: 'Certificado' | 'Em Avaliação' | 'Rejeitado';
  lastActivity: number; // Timestamp
}

// --- Dados de Auditores ---
export interface Auditor {
  id: string;
  nome: string;
  registro: string;
  especialidade: string;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  lastAudit: number; // Timestamp
}

// --- Dados de Auditorias (Agendamentos) ---
export interface Audit {
  id: string;
  certificacao: string;
  agricultor: string;
  auditor: string;
  dataAgendada: number; // Timestamp
  status: 'Concluída' | 'Em Andamento' | 'Cancelada';
}

// --- Dados de Lotes de Produção ---
export interface Batch {
  id: string;
  produto: string;
  agricultor: string;
  dataColheita: number; // Timestamp
  statusRastreio: 'Pronto Venda' | 'Em Processamento' | 'Em Campo';
  certificacaoID: string;
}

// --- Dados de Faturamento (Exemplo) ---
export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'Income' | 'Expense';
    date: number; // Timestamp
}

// ============================================================================
// FIM DOS TIPOS GLOBAIS
// ============================================================================
