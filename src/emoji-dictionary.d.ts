declare module 'emoji-dictionary' {
  export function getUnicode(name: string): string;
  export function getName(unicode: string): string;

  const emoji: Record<string, string>;
  export default emoji;
}
