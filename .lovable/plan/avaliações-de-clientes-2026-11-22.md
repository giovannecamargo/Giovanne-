# Avaliações de clientes

## O que será criado

- Substituir os depoimentos provisórios do menu **Sobre** por avaliações reais aprovadas.
- Adicionar o botão **Avaliar agora**, abrindo um formulário com nome, tipo de contratação, nota de 1 a 5 estrelas e comentário.
- Mostrar a média e a quantidade de avaliações publicadas; quando ainda não houver nenhuma, exibir apenas um convite para avaliar, sem conteúdo fictício.
- Criar a aba **Avaliações** na administração, com filtros e ações para aprovar, recusar e excluir.
- Novas avaliações começam como **pendentes** e só ficam públicas depois da aprovação.

## Regras e segurança

- Guardar avaliações em uma nova tabela protegida: visitantes só podem enviar avaliações pendentes e ler as aprovadas.
- Somente administradores podem ver pendentes/recusadas, alterar a moderação e excluir.
- Validar tamanhos dos textos, nota e campos obrigatórios no navegador e no banco.
- Acrescentar um campo invisível contra envios automáticos simples, sem pedir cadastro ao cliente.

## Verificação

- Testar as regras de nota, textos e visibilidade.
- Enviar uma avaliação temporária como visitante, confirmar que não aparece antes da aprovação, aprová-la no painel e conferir sua exibição pública.
- Testar recusa e exclusão, depois remover todos os registros temporários.
- Conferir computador e celular, executar os testes existentes e salvar a versão no GitHub.
