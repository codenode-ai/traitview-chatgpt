import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Timer } from "lucide-react";

interface LinkAcessoProps {
  link: string;
  expiresAt?: Date;
}

export function LinkAcesso({ link, expiresAt }: LinkAcessoProps) {
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
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      
      if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      }
      
      return `${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
      
      if (time === "Expirado") {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
      <div className="flex-1 text-sm truncate">
        {link}
      </div>
      <div className="flex items-center gap-1">
        {expiresAt && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer size={14} />
            <span>{timeLeft}</span>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="flex items-center gap-1"
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