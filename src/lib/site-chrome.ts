// Landing comercial e painel têm estrutura própria, sem o cabeçalho/rodapé institucional.
export function usesInstitutionalChrome(pathname: string) {
  return !/^\/(contratar-show|admin)(\/|$)/.test(pathname);
}
