// Biografia oficial do artista — texto enviado pelo cantor.
// Manter o texto fiel ao original; ajustes de redação só quando ele pedir.

export type BioSection = { title: string; paragraphs: string[] };

export const bio = {
  lead: "Uma trajetória construída pela música, com raízes no sertanejo e paixão pelo público.",
  facts: [
    { label: "Origem", value: "Juiz de Fora — MG" },
    { label: "Criado em", value: "São Pedro da Aldeia — RJ" },
    { label: "Base atual", value: "Cachoeira de Emas — SP" },
    { label: "Carreira", value: "12 anos de música" },
  ],
  sections: [
    {
      title: "Onde tudo começou",
      paragraphs: [
        "A música faz parte da história de Giovanne Camargo desde a infância. Natural de Juiz de Fora, Minas Gerais, foi criado em São Pedro da Aldeia, no Rio de Janeiro, e teve seus primeiros contatos com a música ainda aos 6 anos de idade, quando começou a cantar na igreja ao lado de sua mãe e a acompanhar seu pai em bares e festas.",
        "Sua paixão pela música tem raízes familiares. Neto de sanfoneiro e filho de músico, cresceu cercado por instrumentos e referências musicais. Iniciou seus estudos com aulas de teclado, aprendeu outros instrumentos na igreja e desenvolveu suas habilidades no violão e no canto observando e acompanhando seu pai.",
      ],
    },
    {
      title: "Uma trajetória de 12 anos",
      paragraphs: [
        "Há 12 anos, iniciou sua trajetória profissional na música, quando se mudou para Recife, Pernambuco. Foi nessa época que desenvolveu um projeto de música sertaneja ao lado de seu amigo e parceiro musical Marcio Papa, hoje produtor musical.",
        "Desde então, construiu uma caminhada marcada por apresentações, experiências e contato com diferentes públicos.",
        "Ao longo de sua trajetória, passou por diversas cidades e regiões do Brasil, com apresentações em locais como Recife, João Pessoa, Garanhuns, Caruaru, Olinda, São Paulo, Rio de Janeiro, Maceió, Pirassununga, Leme, Araras, Santa Cruz da Conceição, Conchal e Porto Ferreira, entre outras.",
      ],
    },
    {
      title: "A identidade musical",
      paragraphs: [
        "Seu estilo musical tem como essência o sertanejo, com um repertório versátil que percorre diferentes gerações.",
        "Das raízes do sertanejo tradicional aos grandes sucessos das décadas de 1980 e 1990, passando pelos hits que marcaram os anos de 2010 a 2015 e chegando à música sertaneja atual.",
        "Entre suas principais referências musicais estão Zezé Di Camargo & Luciano, Bruno & Marrone, Milionário & José Rico, Gusttavo Lima e Panda, artistas que representam diferentes fases e influências de sua identidade musical.",
      ],
    },
    {
      title: "Muito além do palco: conexão com o público",
      paragraphs: [
        "Mais do que a potência vocal, um dos grandes diferenciais de Giovanne está na interação com o público.",
        "Suas apresentações buscam criar proximidade e conexão, levando a música para além do palco. Uma de suas marcas é se aproximar das pessoas, sentar ao lado dos espectadores e interpretar, cara a cara, as músicas que eles gostam de ouvir.",
      ],
    },
    {
      title: "Os próximos capítulos",
      paragraphs: [
        "Atualmente, vivendo em Cachoeira de Emas, distrito de Pirassununga, São Paulo, Giovanne segue trabalhando no fortalecimento da marca Giovanne Camargo.",
        "Seu objetivo é ampliar sua presença no estado de São Paulo e expandir sua carreira também para Minas Gerais, levando sua música, sua identidade sertaneja e sua conexão com o público a novos lugares.",
      ],
    },
  ] as BioSection[],
  tagline: "Giovanne Camargo: a força da voz, a essência do sertanejo e a conexão verdadeira com o público.",
};
