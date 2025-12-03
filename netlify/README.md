# Netlify Functions (Serverless)

Esta pasta e reservada para as Funcoes Serverless (Netlify Functions) que serao usadas para proteger as chaves de API secretas e gerenciar interacoes seguras com a AWS S3 e PDFShift.

**Regras de Acesso:**
1. O codigo Front-end (React) NAO tem acesso direto as chaves aqui configuradas.
2. Apenas o codigo dentro desta pasta (`.js` ou `.ts`) tem acesso as variaveis de ambiente **SEM** o prefixo `VITE_`.
3. Funções comuns a serem implementadas aqui:
    * `upload-s3.js` (Para tratar o upload seguro de documentos).
    * `generate-pdf.js` (Para gerar PDFs usando a chave do PDFShift).
