CLAUDE.md - OD Mooca Manager (XP Edition)
Visão Geral e Filosofia (Extreme Programming)
Este projeto segue rigorosamente os princípios de Extreme Programming (XP) mediado por IA.

Pair Programming: O Usuário é o Navigator (define o "quê" e o "porquê") e o Agente é o Driver (executa o "como").

Small Releases: Cada interação deve resultar em um commit funcional e pronto para produção.

Simplicidade Radical: Se a proposta for complexa demais (ex: excesso de estados ou abstrações prematuras), o Driver deve simplificar imediatamente.

Stack Tecnológico Completo
Framework: Next.js 14+ (App Router).

Backend & Auth: Supabase (PostgreSQL + RLS).

Linguagem: TypeScript (Strict Mode).

UI: Tailwind CSS + Shadcn/ui (Mobile-first).

Testes (Crítico): Vitest (Unitários) e Playwright (E2E).

CI/CD: GitHub Actions (Lint -> Security Scan -> Testes).

Estratégia de Testes (TDD)

Ratio Alvo: Manter ~1.5x mais linhas de teste do que de código funcional.

Ciclo Virtuoso: O Agente deve propor o teste antes da implementação da lógica.

Segurança: Nenhum bug reportado deve ser corrigido sem a criação de um teste que comprove a falha e valide a correção.

Estrutura do Diretório e Componentes

/src/core: Lógica de negócio pura (funções TS testáveis, sem dependência de framework).

/src/services: Clientes de dados e integração com Supabase.

/src/app: Rotas e Server Actions (Interface com o usuário).

/tests: Suíte completa de integração e E2E.

Design Patterns e Regras de "Poda"

Continuous Refactoring: O Agente deve sugerir a extração de concerns e eliminação de duplicidade a cada nova feature.

Don't Pile Up: Não empilhe código novo sobre código sujo. Refatore o arquivo antes de expandi-lo.

Brakeman-style Security: Validar proativamente contra SSRF, Injeção e Path Traversal.

Common Hurdles & Solutions (Documentação Viva)
Hurdle 01: Latência de Auth no Supabase -> Solution: Middleware protection.

Hurdle 02: Notificações PWA no iOS -> Solution: Manifest.json + Service Worker específico.

Hurdle 03: CI quebra por Prettier format:check -> Solution: SEMPRE rodar `npm run format` antes de commitar. O CI roda `prettier --check` e falha se qualquer arquivo não estiver formatado. Comando seguro: `npm run format && git add -A && git commit`.

(Adicionar novos obstáculos conforme surgirem, conforme a lição de que a documentação retorna investimento )

Pipeline Semanal & Ritmo

Segunda a Quinta: Ciclos de TDD e Small Releases.

Quinta (10h): Hardenning e Testes E2E completos.

Sexta (09h): Deploy em produção.

Checklist Pós-Implementação (Obrigatório)
[ ] O código funcional tem testes unitários correspondentes?

[ ] O ratio de teste/código está próximo de 1.5x?

[ ] Rodou o Linter e verificou vulnerabilidades de segurança?

[ ] A interface foi validada em viewport mobile real?

[ ] O CLAUDE.md foi atualizado com novos aprendizados ou padrões?
