import { LinkAcesso } from "@/components/LinkAcesso";

interface LinksAcessoProps {
  links: {
    id: string;
    testName: string;
    link: string;
    expiresAt: Date;
  }[];
}

export function LinksAcesso({ links }: LinksAcessoProps) {
  console.log("🔍 LinksAcesso recebeu links:", links);
  
  if (links.length === 0) {
    console.log("❌ LinksAcesso: Nenhum link para renderizar");
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum link de acesso gerado.
      </div>
    );
  }

  console.log("✅ LinksAcesso: Renderizando", links.length, "links");
  return (
    <div className="space-y-3">
      {links.map(({ id, testName, link, expiresAt }) => (
        <LinkAcesso 
          key={id}
          testName={testName}
          link={link}
          expiresAt={expiresAt}
        />
      ))}
    </div>
  );
}