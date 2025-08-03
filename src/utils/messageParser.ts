import type { ParsedResponse, SuggestionItem } from '../types';

/**
 * Extrai o conteúdo de uma tag XML
 */
export function extractTagContent(content: string, tagName: string): string {
    const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    return regex.exec(content)?.[1]?.trim() || '';
}

/**
 * Extrai todos os itens de sugestão do conteúdo
 */
export function extractSuggestionItems(content: string): SuggestionItem[] {
    const sugestaoMatch = extractTagContent(content, 'sugestao');
    if (!sugestaoMatch) return [];

    const items = [...sugestaoMatch.matchAll(/<item>(.*?)<\/item>/g)]
        .map(([, item], index) => ({
            id: `suggestion-${index}`,
            content: item.trim()
        }))
        .filter(item => item.content.length > 0);

    return items;
}

/**
 * Faz o parsing completo da resposta da IA
 */
export function parseAIResponse(content: string): ParsedResponse {
    const reasoning = extractTagContent(content, 'razao');
    const suggestions = extractSuggestionItems(content);

    return {
        reasoning: reasoning || content,
        suggestions
    };
}

/**
 * Verifica se uma string contém tags XML válidas
 */
export function hasValidTags(content: string): boolean {
    const hasRazao = /<razao>[\s\S]*?<\/razao>/.test(content);
    const hasSugestao = /<sugestao>[\s\S]*?<\/sugestao>/.test(content);
    return hasRazao || hasSugestao;
}
