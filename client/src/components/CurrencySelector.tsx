import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/hooks/useCurrency";

export function CurrencySelector() {
  const { selectedCurrency, currencies, detectedCurrency, isAutoDetected, setCurrency, getCurrencySymbol } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="font-medium">{getCurrencySymbol()} {selectedCurrency}</span>
          {isAutoDetected && detectedCurrency && (
            <span className="text-xs text-muted-foreground">
              (Auto)
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Select Currency
        </div>
        {isAutoDetected && detectedCurrency && (
          <div className="px-2 py-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-sm mb-1">
            Auto-detected: {detectedCurrency}
          </div>
        )}
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrency(currency.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{currency.symbol}</span>
              <span className="font-medium">{currency.code}</span>
              <span className="text-muted-foreground">- {currency.name}</span>
            </div>
            {selectedCurrency === currency.code && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
        <div className="border-t mt-1 pt-1">
          <div className="px-2 py-1 text-xs text-muted-foreground">
            Prices automatically converted from USD
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}