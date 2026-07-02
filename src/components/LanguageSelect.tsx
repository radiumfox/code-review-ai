import { langs } from '@uiw/codemirror-extensions-langs';


type LanguageExtension = keyof typeof langs;
type Unwrap<T> = T[keyof T];

const languageExtensions: Record<LanguageExtension, Unwrap<typeof langs>> = langs;

export default function LanguageSelect({
  value, onChange
}: { value: keyof typeof langs; onChange: (lang: keyof typeof langs) => void }) {

  const languagesList = Object.entries(languageExtensions).map(([langName, langValue]) => {
    return <option className="w-250" key={langName} value={langName}>{langName}</option>;
  });

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as keyof typeof langs)}
      className="border rounded px-2 py-1 bg-[#0a0a23] text-[#dfdfe2] w-250"
    >
      {languagesList}
    </select>
  );
}