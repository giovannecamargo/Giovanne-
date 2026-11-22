# Landing Page Comercial /contratar-show + aba no painel

## 1. Rotas públicas isoladas
- Nova página **/contratar-show** com cabeçalho comercial próprio (logo + botão WhatsApp), navegação interna por âncoras (Pacotes, Condições, Contato) e rodapé comercial próprio.
- O cabeçalho e o rodapé institucionais deixam de aparecer em **/contratar-show** e em **/admin**.
- Site institucional (/, /sobre, /agenda, /shows, /galeria, /patrocinadores, /contato) sem nenhuma alteração.
- Conteúdo da landing: apresentação comercial, cards dos pacotes (código, título, duração, formação, preço, som incluso, descrição, destaque), condições de contratação, sinal de reserva, cidades atendidas e botão de WhatsApp em cada pacote com mensagem já preenchida ("Olá, quero contratar o pacote P02 — ...").
- Visual premium preto/dourado, porém com layout comercial distinto do institucional. Funciona no celular.

## 2. Banco de dados
- `show_packages`: id, order_index, code, title, duration, formation, price, sound_included, description, is_highlighted, is_active.
- `hiring_settings` (registro único): whatsapp_number, deposit_percentage, valid_cities, contract_terms_text.
- Leitura pública: pacotes ativos e as configurações. Escrita: somente administradores.
- Os 3 pacotes oficiais cadastrados: P01 R$ 700, P02 R$ 1.000, P03 R$ 1.200. Os detalhes que você ainda não me passou (título, duração, formação, som incluso, descrição, sinal, cidades, condições) ficam em branco até você informar ou preencher pelo painel, para não inventar nada.
- Nenhuma tabela ou dado existente é alterado.

## 3. Painel /admin
- Mesmo login e permissões; nova aba **Contratação de Shows**.
- Pacotes: criar, editar (valores, descrição, duração, formação, som), ativar/desativar, destacar, ordenar e excluir com confirmação.
- Configurações comerciais: WhatsApp de atendimento, percentual do sinal, cidades atendidas e texto das condições.
- Alterações aqui refletem apenas em /contratar-show.

## Detalhes técnicos
- Migração: tabelas acima com GRANTs (SELECT anon/authenticated; escrita authenticated) + RLS com `has_role(auth.uid(),'admin')`; `price` numeric(10,2) com check >= 0; `deposit_percentage` 0–100; `hiring_settings.id boolean default true` como registro único. Inserção dos 3 pacotes na mesma migração (P01/P02/P03 com preços, demais campos vazios, ativos).
- `__root.tsx`: esconder Header/Footer/RouteProgress quando pathname começa com `/contratar-show` ou `/admin`.
- `src/routes/contratar-show.tsx` (head() próprio) + `src/components/hiring/*`; dados via `src/lib/hiring.ts` (query + formatação BRL + link WhatsApp com mensagem).
- `src/components/admin-hiring.tsx` adicionado às abas de `admin.tsx`.
- Testes: formatação de preço, link do WhatsApp por pacote, limite do sinal 0–100, e teste de rota para /contratar-show.
- Validação no navegador: editar pacote/configuração no admin como administrador e confirmar reflexo só na landing, em computador e celular.
