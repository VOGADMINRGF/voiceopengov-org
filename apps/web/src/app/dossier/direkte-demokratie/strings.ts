import { DEFAULT_LOCALE, type SupportedLocale } from "@/config/locales";

type DossierStrings = {
  meta: { title: string; description: string };
  label: string;
  title: string;
  intro: string;
  cards: string[];
  discussion: {
    label: string;
    title: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  actions: {
    primary: string;
    secondary: string;
  };
};

const STRINGS: Record<SupportedLocale, DossierStrings> = {
  de: {
    meta: {
      title: "Beispiel-Dossier: Direkte Demokratie – VoiceOpenGov",
      description: "Beispiel-Dossier mit Fragen, Quellen und Diskussion zu direkter Demokratie.",
    },
    label: "Beispiel-Dossier",
    title: "Direkte Demokratie",
    intro:
      "Ein Dossier bündelt Aussagen, Quellen, offene Fragen und Varianten. So wird sichtbar, worüber Entscheidungen getroffen werden und welche Grundlagen geprüft wurden.",
    cards: [
      "Wie sichern wir die Qualität von Abstimmungen?",
      "Welche Rollen haben Regionen und Gemeinden?",
      "Welche Standards braucht die Umsetzung?",
    ],
    discussion: {
      label: "Diskussion",
      title: "Beiträge aus eDebatte",
      body:
        "Hier entsteht die Diskussion zu diesem Dossier. Die Live-Einbindung folgt; bis dahin kannst du direkt im Tool mitdiskutieren.",
      ctaPrimary: "Diskussion öffnen",
      ctaSecondary: "Community beitreten",
    },
    actions: {
      primary: "Community beitreten",
      secondary: "Thema einreichen",
    },
  },
  en: {
    meta: {
      title: "Sample dossier: Direct democracy – VoiceOpenGov",
      description: "Sample dossier with questions, sources and discussion on direct democracy.",
    },
    label: "Sample dossier",
    title: "Direct democracy",
    intro:
      "A dossier consolidates claims, sources, open questions and variants. This makes it clear which decisions are being made and which foundations were checked.",
    cards: [
      "How do we secure the quality of votes?",
      "What roles do regions and municipalities play?",
      "Which standards does implementation require?",
    ],
    discussion: {
      label: "Discussion",
      title: "Contributions from eDebatte",
      body:
        "Discussion for this dossier will appear here. Live embedding is coming; until then you can join directly in the tool.",
      ctaPrimary: "Open discussion",
      ctaSecondary: "Join the community",
    },
    actions: {
      primary: "Join the community",
      secondary: "Submit a topic",
    },
  },
  fr: {
    meta: {
      title: "Dossier exemple : Démocratie directe – VoiceOpenGov",
      description: "Dossier exemple avec questions, sources et discussion sur la démocratie directe.",
    },
    label: "Dossier exemple",
    title: "Démocratie directe",
    intro:
      "Un dossier regroupe des affirmations, des sources, des questions ouvertes et des variantes. Cela rend visibles les décisions prises et les bases vérifiées.",
    cards: [
      "Comment garantir la qualité des votes ?",
      "Quel rôle pour les régions et les communes ?",
      "Quels standards pour la mise en œuvre ?",
    ],
    discussion: {
      label: "Discussion",
      title: "Contributions d’eDebatte",
      body:
        "La discussion sur ce dossier apparaîtra ici. L’intégration en direct arrive ; d’ici là, participe directement dans l’outil.",
      ctaPrimary: "Ouvrir la discussion",
      ctaSecondary: "Rejoindre la communauté",
    },
    actions: {
      primary: "Rejoindre la communauté",
      secondary: "Proposer un sujet",
    },
  },
  pl: {
    meta: {
      title: "Przykładowe dossier: Demokracja bezpośrednia – VoiceOpenGov",
      description: "Przykładowe dossier z pytaniami, źródłami i dyskusją o demokracji bezpośredniej.",
    },
    label: "Przykładowe dossier",
    title: "Demokracja bezpośrednia",
    intro:
      "Dossier łączy tezy, źródła, otwarte pytania i warianty. Dzięki temu widać, jakie decyzje są podejmowane i jakie podstawy zostały sprawdzone.",
    cards: [
      "Jak zapewnić jakość głosowań?",
      "Jakie role mają regiony i gminy?",
      "Jakie standardy są potrzebne we wdrożeniu?",
    ],
    discussion: {
      label: "Dyskusja",
      title: "Wkłady z eDebatte",
      body:
        "Tu pojawi się dyskusja o tym dossier. Integracja na żywo wkrótce; do tego czasu możesz dyskutować bezpośrednio w narzędziu.",
      ctaPrimary: "Otwórz dyskusję",
      ctaSecondary: "Dołącz do społeczności",
    },
    actions: {
      primary: "Dołącz do społeczności",
      secondary: "Zgłoś temat",
    },
  },
  es: {
    meta: {
      title: "Dossier de ejemplo: Democracia directa – VoiceOpenGov",
      description: "Dossier de ejemplo con preguntas, fuentes y debate sobre democracia directa.",
    },
    label: "Dossier de ejemplo",
    title: "Democracia directa",
    intro:
      "Un dossier reúne afirmaciones, fuentes, preguntas abiertas y variantes. Así se ve qué decisiones se toman y qué fundamentos se revisaron.",
    cards: [
      "¿Cómo aseguramos la calidad de las votaciones?",
      "¿Qué papel tienen regiones y municipios?",
      "¿Qué estándares necesita la implementación?",
    ],
    discussion: {
      label: "Debate",
      title: "Aportes desde eDebatte",
      body:
        "Aquí aparecerá la discusión sobre este dossier. La integración en vivo llegará pronto; mientras tanto puedes debatir directamente en la herramienta.",
      ctaPrimary: "Abrir debate",
      ctaSecondary: "Unirse a la comunidad",
    },
    actions: {
      primary: "Unirse a la comunidad",
      secondary: "Enviar tema",
    },
  },
  it: {
    meta: {
      title: "Dossier di esempio: Democrazia diretta – VoiceOpenGov",
      description: "Dossier di esempio con domande, fonti e discussione sulla democrazia diretta.",
    },
    label: "Dossier di esempio",
    title: "Democrazia diretta",
    intro:
      "Un dossier raccoglie affermazioni, fonti, domande aperte e varianti. Così è chiaro quali decisioni vengono prese e quali basi sono state verificate.",
    cards: [
      "Come garantiamo la qualità delle votazioni?",
      "Quali ruoli hanno regioni e comuni?",
      "Quali standard servono per l’attuazione?",
    ],
    discussion: {
      label: "Discussione",
      title: "Contributi da eDebatte",
      body:
        "Qui nascerà la discussione su questo dossier. L’integrazione live arriverà; nel frattempo puoi discutere direttamente nello strumento.",
      ctaPrimary: "Apri discussione",
      ctaSecondary: "Unisciti alla community",
    },
    actions: {
      primary: "Unisciti alla community",
      secondary: "Invia un tema",
    },
  },
  tr: {
    meta: {
      title: "Örnek dosya: Doğrudan demokrasi – VoiceOpenGov",
      description: "Doğrudan demokrasi hakkında sorular, kaynaklar ve tartışma içeren örnek dosya.",
    },
    label: "Örnek dosya",
    title: "Doğrudan demokrasi",
    intro:
      "Bir dosya, iddiaları, kaynakları, açık soruları ve seçenekleri bir araya getirir. Böylece hangi kararların alındığı ve hangi temellerin incelendiği görünür.",
    cards: [
      "Oylamaların kalitesini nasıl güvenceye alırız?",
      "Bölgeler ve belediyeler hangi rollere sahip?",
      "Uygulama için hangi standartlar gerekir?",
    ],
    discussion: {
      label: "Tartışma",
      title: "eDebatte katkıları",
      body:
        "Bu dosyaya ilişkin tartışma burada oluşacak. Canlı entegrasyon yakında; o zamana kadar araçta doğrudan katılabilirsin.",
      ctaPrimary: "Tartışmayı aç",
      ctaSecondary: "Topluluğa katıl",
    },
    actions: {
      primary: "Topluluğa katıl",
      secondary: "Konu gönder",
    },
  },
  ar: {
    meta: {
      title: "ملف نموذجي: الديمقراطية المباشرة – VoiceOpenGov",
      description: "ملف نموذجي بأسئلة ومصادر ونقاش حول الديمقراطية المباشرة.",
    },
    label: "ملف نموذجي",
    title: "الديمقراطية المباشرة",
    intro:
      "يجمع الملف الادعاءات والمصادر والأسئلة المفتوحة والبدائل. وبذلك يتضح ما هي القرارات المتخذة وما هي الأسس التي تم فحصها.",
    cards: [
      "كيف نضمن جودة التصويت؟",
      "ما أدوار الأقاليم والبلديات؟",
      "ما المعايير المطلوبة للتنفيذ؟",
    ],
    discussion: {
      label: "نقاش",
      title: "مساهمات من eDebatte",
      body:
        "ستظهر المناقشة الخاصة بهذا الملف هنا. سيأتي الربط المباشر لاحقًا؛ وحتى ذلك الحين يمكنك المشاركة مباشرة داخل الأداة.",
      ctaPrimary: "افتح النقاش",
      ctaSecondary: "انضم إلى المجتمع",
    },
    actions: {
      primary: "انضم إلى المجتمع",
      secondary: "أرسل موضوعًا",
    },
  },
  ru: {
    meta: {
      title: "Пример досье: Прямая демократия – VoiceOpenGov",
      description: "Пример досье с вопросами, источниками и обсуждением прямой демократии.",
    },
    label: "Пример досье",
    title: "Прямая демократия",
    intro:
      "Досье объединяет утверждения, источники, открытые вопросы и варианты. Так видно, какие решения принимаются и какие основания были проверены.",
    cards: [
      "Как обеспечить качество голосований?",
      "Какие роли у регионов и муниципалитетов?",
      "Какие стандарты нужны для реализации?",
    ],
    discussion: {
      label: "Обсуждение",
      title: "Вклады из eDebatte",
      body:
        "Обсуждение по этому досье появится здесь. Живая интеграция скоро; пока можно участвовать прямо в инструменте.",
      ctaPrimary: "Открыть обсуждение",
      ctaSecondary: "Присоединиться к сообществу",
    },
    actions: {
      primary: "Присоединиться к сообществу",
      secondary: "Предложить тему",
    },
  },
  zh: {
    meta: {
      title: "示例档案：直接民主 – VoiceOpenGov",
      description: "关于直接民主的示例档案，包含问题、来源与讨论。",
    },
    label: "示例档案",
    title: "直接民主",
    intro:
      "档案汇集观点、来源、开放问题与方案，从而清晰呈现决策内容及其核查依据。",
    cards: [
      "如何确保投票质量？",
      "地区与市政的角色是什么？",
      "落实需要哪些标准？",
    ],
    discussion: {
      label: "讨论",
      title: "来自 eDebatte 的贡献",
      body:
        "该档案的讨论将在此展开。实时嵌入即将上线；在此之前可直接在工具中参与。",
      ctaPrimary: "打开讨论",
      ctaSecondary: "加入社区",
    },
    actions: {
      primary: "加入社区",
      secondary: "提交议题",
    },
  },
};

export function getDossierStrings(locale: SupportedLocale | string): DossierStrings {
  const normalized = (locale || DEFAULT_LOCALE) as SupportedLocale;
  return STRINGS[normalized] ?? STRINGS[DEFAULT_LOCALE];
}
