import type { Metadata } from 'next';

import { ObfuscatedEmail } from '@/components/ObfuscatedEmail';
import { SITE_AUTHOR } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Datenschutzerklärung',
};

export default function DatenschutzPage() {
    return (
        <>
            <h1>Datenschutzerklärung</h1>

            <h2>Verantwortlicher</h2>
            <address>
                {SITE_AUTHOR}
                <br />
                Haus Düssel 28
                <br />
                42489 Wülfrath
                <br />
                E-Mail: <ObfuscatedEmail />
            </address>

            <h2>Hosting</h2>
            <p>
                Diese Website wird gehostet bei Vercel Inc., 440 N Barranca Avenue #4133, Covina,
                CA 91723, USA (nachfolgend „Vercel"). Beim Abruf der Website übermittelt
                dein Browser technisch bedingt Daten an Vercels Server, darunter IP-Adresse,
                Browser-Typ, Betriebssystem, aufgerufene URL und Zeitstempel. Diese Daten werden in
                Logdateien gespeichert.
            </p>
            <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am
                störungsfreien Betrieb der Website). Die Logdaten werden gelöscht, sobald sie für
                den Betrieb nicht mehr erforderlich sind.
            </p>
            <p>
                Vercel ist unter dem EU-US Data Privacy Framework (DPF) zertifiziert, das eine
                angemessenes Datenschutzniveau für Übermittlungen in die USA sicherstellt. Mit
                Vercel besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
            </p>

            <h2>Reichweitenmessung mit Vercel Web Analytics</h2>
            <p>
                Diese Website nutzt Vercel Web Analytics, einen cookielosen Analysedienst von
                Vercel. Vercel Web Analytics erhebt keine personenbezogenen Daten und setzt keine
                Cookies. Die Auswertung erfolgt ausschließlich auf Basis aggregierter Metriken
                (aufgerufene Seiten, Herkunftsland, Browser-Typ).
            </p>
            <p>
                Zur Erkennung eindeutiger Seitenaufrufe wird ein Hash aus den eingehenden
                Anfragedaten gebildet. Dieser Hash wird nicht persistent gespeichert und nach 24
                Stunden verworfen; er ermöglicht kein Cross-Site-Tracking.
            </p>
            <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse besteht
                darin, die Nutzung der Website anonym nachzuvollziehen und Inhalte zu verbessern.
                Die Verarbeitung ist auf das absolut notwendige Minimum beschränkt: kein Cookie-
                Einsatz, kein Cross-Site-Tracking, täglicher Hash-Reset.
            </p>

            <h3>Opt-out</h3>
            <p>
                Du kannst die Erhebung durch einen Content-Blocker (z. B. uBlock Origin, Brave
                Browser) verhindern.
            </p>

            <h2>Betroffenenrechte</h2>
            <p>Du hast gegenüber dem Verantwortlichen folgende Rechte:</p>
            <ul>
                <li>
                    <strong>Auskunft</strong> über die zu deiner Person gespeicherten Daten
                    (Art. 15 DSGVO)
                </li>
                <li>
                    <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
                </li>
                <li>
                    <strong>Löschung</strong> deiner Daten (Art. 17 DSGVO)
                </li>
                <li>
                    <strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)
                </li>
                <li>
                    <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
                </li>
                <li>
                    <strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)
                </li>
            </ul>
            <p>
                Zur Ausübung deiner Rechte wende dich per E-Mail an <ObfuscatedEmail />.
            </p>

            <h2>Beschwerderecht</h2>
            <p>
                Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
                Zuständig ist die Landesbeauftragte für Datenschutz und Informationsfreiheit
                Nordrhein-Westfalen (LDI NRW), Kavalleriestraße 2–4, 40213 Düsseldorf,
                www.ldi.nrw.de.
            </p>
        </>
    );
}
