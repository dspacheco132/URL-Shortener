export type Locale = "en" | "pt";

export const locales: Locale[] = ["en", "pt"];
export const defaultLocale: Locale = "en";

export const translations = {
  en: {
    home: {
      title: "Shorten your links",
      titleHighlight: "instantly",
      subtitle:
        "Transform long URLs into short, memorable links. Simple, fast, and free.",
    },
    form: {
      placeholder: "Paste your URL here...",
      submit: "Shorten",
    },
    linkResult: {
      label: "Your shortened link",
      original: "Original",
      clicks: (n: number) => (n === 1 ? "click" : "clicks"),
      refresh: "Refresh",
    },
    linkPage: {
      title: "Link created",
      subtitle: "Your link is ready to share.",
      backLink: "← Shorten another link",
    },
    footer: {
      madeBy: "Made by",
    },
    errors: {
      missing_url: "Please enter a URL to shorten.",
      invalid_url: "Invalid URL. Please check and try again.",
      server_error: "Something went wrong. Please try again.",
    },
    toast: {
      copySuccess: "Link copied!",
      copyError: "Failed to copy",
    },
    notFound: {
      title: "Oops! Page not found",
      backLink: "Return to Home",
    },
  },
  pt: {
    home: {
      title: "Encurta os teus links",
      titleHighlight: "instantaneamente",
      subtitle:
        "Transforma URLs longas em links curtos e memoráveis. Simples, rápido e grátis.",
    },
    form: {
      placeholder: "Cola a tua URL aqui...",
      submit: "Encurtar",
    },
    linkResult: {
      label: "O teu link curto",
      original: "Original",
      clicks: (n: number) => (n === 1 ? "clique" : "cliques"),
      refresh: "Atualizar",
    },
    linkPage: {
      title: "Link criado",
      subtitle: "O teu link está pronto para partilhar.",
      backLink: "← Encurtar outro link",
    },
    footer: {
      madeBy: "Criado por",
    },
    errors: {
      missing_url: "Introduz uma URL para encurtar.",
      invalid_url: "URL inválida. Verifica e tenta novamente.",
      server_error: "Ocorreu um erro. Tenta novamente.",
    },
    toast: {
      copySuccess: "Link copiado!",
      copyError: "Erro ao copiar",
    },
    notFound: {
      title: "Oops! Página não encontrada",
      backLink: "Voltar ao início",
    },
  },
} as const;

function getNested(
  obj: Record<string, unknown>,
  path: string
): string | ((...args: unknown[]) => string) | undefined {
  const value = path.split(".").reduce((curr: unknown, key) => {
    if (curr && typeof curr === "object" && key in curr) {
      return (curr as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return value as string | ((...args: unknown[]) => string) | undefined;
}

export function getTranslations(locale: Locale) {
  const dict = translations[locale] ?? translations.en;
  return function t(key: string, ...args: unknown[]): string {
    const value = getNested(dict as Record<string, unknown>, key);
    if (typeof value === "function") {
      return value(...args);
    }
    return (value as string) ?? key;
  };
}
