export type LocalizedText = { zh: string; en: string };
export type ProfileLinkInput = {
  href: string;
  label: LocalizedText;
  description: LocalizedText;
};

function splitPipeDelimitedText(value: string): string[] {
  return value
    .split(/\r?\n/)
    .flatMap((line) => line.split('|'))
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLineDelimitedText(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function mergePipeDelimitedListByLanguage(
  currentItems: LocalizedText[],
  nextValue: string,
  lang: 'zh' | 'en',
): LocalizedText[] {
  const nextItems = splitPipeDelimitedText(nextValue);

  return nextItems.map((item, index) => ({
    zh: lang === 'zh' ? item : currentItems[index]?.zh ?? '',
    en: lang === 'en' ? item : currentItems[index]?.en ?? '',
  }));
}

export function mergeLineDelimitedListByLanguage(
  currentItems: LocalizedText[],
  nextValue: string,
  lang: 'zh' | 'en',
): LocalizedText[] {
  const nextItems = splitLineDelimitedText(nextValue);

  return nextItems.map((item, index) => ({
    zh: lang === 'zh' ? item : currentItems[index]?.zh ?? '',
    en: lang === 'en' ? item : currentItems[index]?.en ?? '',
  }));
}

export function mergeLinksByLanguage(
  currentItems: ProfileLinkInput[],
  nextValue: string,
  lang: 'zh' | 'en',
): ProfileLinkInput[] {
  const nextItems = nextValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', description = '', href = ''] = line.split('|').map((part) => part.trim());
      return { label, description, href };
    });

  return nextItems.map((item, index) => {
    const currentItem = currentItems[index];
    return {
      href: item.href || currentItem?.href || '',
      label: {
        zh: lang === 'zh' ? item.label : currentItem?.label.zh ?? '',
        en: lang === 'en' ? item.label : currentItem?.label.en ?? '',
      },
      description: {
        zh: lang === 'zh' ? item.description : currentItem?.description.zh ?? '',
        en: lang === 'en' ? item.description : currentItem?.description.en ?? '',
      },
    };
  });
}

export function formatPipeDelimitedList(items: LocalizedText[], lang: 'zh' | 'en'): string {
  return items
    .map((item) => item[lang])
    .filter(Boolean)
    .join(' | ');
}

export function formatLineDelimitedList(items: LocalizedText[], lang: 'zh' | 'en'): string {
  return items
    .map((item) => item[lang])
    .filter(Boolean)
    .join('\n');
}
