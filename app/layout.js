import StyledComponentsRegistry from './lib/registry';
import './globals.css';

export const metadata = {
  title: 'D&D 5e Encounter Generator — Free Random Combat Tool',
  description: 'Generate balanced D&D 5e combat encounters in seconds. Set your party size, level, and difficulty — get monster groups, XP breakdowns, and narrative complications. Free, no signup.',
  keywords: 'D&D 5e encounter generator, DnD encounter builder, dungeons and dragons combat generator, 5e random encounters, encounter XP calculator, DnD monster encounter, tabletop RPG encounter tool, dungeon master tools, free DnD tools, 5th edition encounter maker',
  alternates: {
    canonical: 'https://dndencounter.no',
  },
  openGraph: {
    title: 'D&D 5e Encounter Generator — Free Random Combat Tool',
    description: 'Generate balanced D&D 5e combat encounters in seconds. Set your party size, level, and difficulty — get monster groups, XP breakdowns, and narrative complications.',
    url: 'https://dndencounter.no',
    siteName: 'DnD Encounter Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'D&D 5e Encounter Generator — Free Random Combat Tool',
    description: 'Generate balanced D&D 5e combat encounters in seconds. Free, no signup.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/danielsLogo.png',
  },
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Goudy+Bookletter+1911&family=Jacquard+12&family=Major+Mono+Display&family=Teko:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "D&D 5e Encounter Generator",
                "url": "https://dndencounter.no",
                "description": "Generate balanced D&D 5e combat encounters for any party size and level.",
                "applicationCategory": "GameApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How do I use the D&D 5e encounter generator?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Set your party size, level, and desired difficulty. Optionally filter by monster type. Click Generate Encounter — the tool handles the XP math and produces a balanced combat encounter with narrative details you can use as inspiration."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How are encounters balanced?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Encounters are built using the official D&D 5e XP budget system from the Dungeon Master's Guide. The generator selects monster groups whose adjusted XP — raw XP multiplied by a difficulty multiplier based on monster count and party size — fits within the party's XP threshold for the chosen difficulty."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What is a monster complication in the encounter generator?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "A complication adds narrative flavour to the encounter. When the complication is a monster group, those creatures are a separate third party — not allied with the main group. They may attack the players, the main monsters, or both, creating a dynamic three-way situation the players can choose to engage with or avoid."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is this D&D encounter generator free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. The encounter generator is completely free and runs entirely in your browser. No signup, no downloads, no cost."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I download my generated D&D encounters?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. You can download individual encounters or all encounters at once as a Markdown file (.md), which works with campaign notes apps like Obsidian, Notion, or any text editor."
                    }
                  }
                ]
              }
            ]),
          }}
        />
      </head>
      <body>
        <noscript>
          <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>D&D 5e Encounter Generator</h1>
            <p>This free encounter generator creates balanced combat encounters for Dungeons &amp; Dragons 5th Edition. Please enable JavaScript to use the generator.</p>
          </div>
        </noscript>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
