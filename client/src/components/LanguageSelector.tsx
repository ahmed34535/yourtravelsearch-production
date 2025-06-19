import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLocalization } from "@/hooks/useLocalization";

export function LanguageSelector() {
  const { 
    selectedLanguage, 
    languages, 
    detectedLanguage, 
    isAutoDetected, 
    setLanguage, 
    getLanguageInfo 
  } = useLocalization();

  const currentLanguage = getLanguageInfo(selectedLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          <Globe className="w-4 h-4" />
          <span className="hidden md:inline">
            {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
            {isAutoDetected && detectedLanguage === selectedLanguage && (
              <span className="text-xs text-muted-foreground ml-1">(Auto)</span>
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language.code)}
            className={`flex items-center space-x-2 ${
              selectedLanguage === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
            {detectedLanguage === language.code && (
              <span className="text-xs text-blue-600 ml-auto">Auto</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}