# Netlify Functions (Serverless)

Esta pasta é reservada para as Funções Serverless (Netlify Functions) que serão usadas para proteger as chaves de API secretas e gerenciar interações seguras com a AWS S3 e PDFShift.

**Regras de Acesso:**
1. O código Front-end (React) NÃO tem acesso direto às chaves aqui configuradas.
2. Apenas o código dentro desta pasta (`.js` ou `.ts`) tem acesso às variáveis de ambiente **SEM** o prefixo `VITE_`.
3. Funções comuns a serem implementadas aqui:
    * `upload-s3.js` (Para tratar o upload seguro de documentos).
    * `generate-pdf.js` (Para gerar PDFs usando a chave do PDFShift).
