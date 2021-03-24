
type AcceptLanguage = string | undefined;

interface Languages {
    [key: string]: string;
}

interface LanguageWeightConfig {
    lan: string;
    q: number;
}
