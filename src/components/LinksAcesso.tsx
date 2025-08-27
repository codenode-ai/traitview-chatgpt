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
  if (links.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum link de acesso gerado.
      </div>
    );
  }

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