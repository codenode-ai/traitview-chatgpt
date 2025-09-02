import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Timer, Link as LinkIcon } from "lucide-react";

interface LinkAcessoProps {
  link: string;
  expiresAt?: Date;
  testName?: string;
}

export function LinkAcesso({ link, expiresAt, testName }: LinkAcessoProps) {
  console.log("🔗 LinkAcesso renderizando:", { link, expiresAt, testName });
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const difference = expiresAt.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return "Expirado";
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        return `${days}d ${hours}h`;
      }
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      
      return `${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
      
      if (time === "Expirado") {
        clearInterval(timer);
      }
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-muted rounded-lg border">
      <div className="flex-1 min-w-0">
        {testName && (
          <div className="text-xs font-medium text-muted-foreground mb-1 truncate">
            {testName}
          </div>
        )}
        <div className="flex items-center gap-2">
          <LinkIcon size={16} className="text-muted-foreground flex-shrink-0" />
          <div className="text-sm truncate">
            {link}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {expiresAt && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
            <Timer size={14} />
            <span>{timeLeft}</span>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="flex items-center gap-1 whitespace-nowrap"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copiado
            </>
          ) : (
            <>
              <Copy size={14} />
              Copiar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}