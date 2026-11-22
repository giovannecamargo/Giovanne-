# Landing page de contratação + painel unificado

## Situação atual (analisada)
1. **Painel**: uma única página `/admin`, login por e-mail/senha, acesso de administrador por convite de uso único; abas Patrocinadores, Agenda, Página Shows, Fotos da Galeria, Avaliações e Contato. Só administradores gravam dados.
2. **Site institucional**: Início, Sobre, Agenda, Shows, Galeria, Patrocinadores e Contato, todos com o mesmo cabeçalho e rodapé.
3. **Landing page comercial**: ainda **não existe** no projeto — será criada do zero.
4. Os dados ficam no banco atual (patrocinadores, agenda, fotos, vídeos, contatos, avaliações, convites).

## O que será feito

### Ambiente 2 — Landing page em `/contratacao`
- Página própria, **sem** o menu e o rodapé do site institucional: cabeçalho comercial enxuto (logo + botão WhatsApp) e rodapé próprio.
- Seções: apresentação comercial, formatos/pacotes (nome, descrição, duração, formação musical, som incluso ou não, preço), condições de contratação, reserva e pagamento (percentual do sinal), e botões de WhatsApp por pacote.
- Visual premium preto/dourado, porém com layout comercial distinto.
- Nenhum pacote ou preço inventado: enquanto não houver pacotes ativos, a página mostra só a apresentação e o botão de contato.
- O site institucional não recebe link automático para ela (fica acessível pela própria URL).

### Painel — novo módulo "Contratação de Shows"
- Abas do painel agrupadas em dois módulos: **Site institucional** (abas atuais, sem mudanças) e **Contratação de Shows** (novo).
- Pacotes: criar, editar, excluir com confirmação, ativar/desativar, ordenar (subir/descer), editar preço, duração, descrição, formação e som incluso.
- Configurações: texto das condições de contratação, informações de reserva/pagamento, percentual do sinal, número de WhatsApp de atendimento e mensagem padrão do WhatsApp.
- Mesmo login, mesmas permissões; nenhum segundo painel.

### Separação dos dados
- Duas tabelas novas, usadas somente pela landing page: **pacotes de show** e **configurações de contratação** (registro único).
- O WhatsApp da landing é independente do WhatsApp do Contato institucional.
- Leitura pública apenas de pacotes ativos e da configuração; gravação apenas por administradores.
- Nenhuma tabela ou registro existente é alterado.

## Detalhes técnicos
- Migração `0012`: `show_packages` (name, description, price_cents, duration_label, lineup, sound_included, is_active, sort_order, timestamps) e `booking_settings` (terms, payment_info, deposit_percent 0–100, whatsapp, whatsapp_message, intro). RLS: SELECT anon/authenticated (pacotes só `is_active`), INSERT/UPDATE/DELETE via `has_role(auth.uid(),'admin')`; GRANTs.
- `__root.tsx`: renderizar Header/Footer institucionais exceto em `/contratacao`; a rota usa seu próprio shell em `src/components/booking/*`.
- `src/lib/booking.ts`: formatação de preço, link WhatsApp com mensagem por pacote, sanitização de percentual — com testes.
- `src/components/admin-booking.tsx` no admin, reaproveitando padrões existentes.
- `head()` próprio para `/contratacao`; teste de rota garante que existe.
- Sem mudanças em domínio, GitHub ou Vercel além do envio normal do código.

## Validação
Testar no computador e celular: criar/editar/ordenar/desativar/excluir pacote, alterar sinal e WhatsApp, e confirmar que só a landing muda e o site institucional fica idêntico.
