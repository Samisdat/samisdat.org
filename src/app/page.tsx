import { Heading } from '@/components/Heading';
import { Paragraph } from '@/components/Paragraph';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@linaria/react';

import { ColorSwitcher } from '@/components/ColorSwitcher';
import { promises as fs } from 'fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import path from 'path';

export default async function Home() {
    const mdxPath = path.join(process.cwd(), 'content/', `home.mdx`);

    const content = await fs.readFile(mdxPath, 'utf-8');

    const components = {
        //em:
    };
    interface Frontmatter {
        title: string;
    }

    const data = await compileMDX<Frontmatter>({
        source: content,
        options: {
            parseFrontmatter: true,
        },
        components,
    });

    return (
        <>
            <Heading>{data.frontmatter.title}</Heading>
            {data.content}
            <ColorSwitcher />
            <FontAwesomeIcon icon={faThumbsUp} />
            <Paragraph>Ich hab im Januar 2010 meine Ausbildung beendet und arbeite seitdem als Developer</Paragraph>
            <Paragraph>Das sind 16 Jahre</Paragraph>
            <Paragraph>Oder bei einer 40 Stundenwoche mit Urlaub, Wochenenden & Feiertagen</Paragraph>
            <Heading> 28.520 Stunden</Heading>

            <Heading>Hermeneutisches Wohlwollen</Heading>

            <Heading>Brötchen statt Kathedralen</Heading>

            <Heading>Demut</Heading>
            <Paragraph>
                Ich hab oft Ideen, die ich - im ersten Moment - für absolute brilliant und herrausragend halte.
            </Paragraph>
            <Paragraph>Manchmal - leider seltender als ich gerne wünschen würde - stimmt das sogar.</Paragraph>
            <Paragraph>Das Internet ist sehr groß</Paragraph>
            <Paragraph>
                Die Wahrscheinlichkeit, dass ich ein konkretes Problem besser verstanden haben und besser lösen kann,
                als alle anderen, ist nicht null.{' '}
            </Paragraph>
            <Paragraph>Leider ist diese Wahrscheinlichkeit auch nicht sehr hoch.</Paragraph>
            <Paragraph>
                Weil gerade meine brillianten Ideen dazu tendieren sich zu krasse Zeitfresser zu entwicklen, lohne es
                sich für mich immer,{' '}
            </Paragraph>
            <Paragraph> die eigene Brillianz einmal zu challengend.</Paragraph>
            <Paragraph>Dabei gewinne ich immer</Paragraph>
            <Paragraph>
                Entweder - meistens - finde ich sehr schnell raus, dass jemand was ähnliches schon in schöner
                hinbekommen hat.{' '}
            </Paragraph>
            <Paragraph>Und das spart mir krass viel zeit </Paragraph>
            <Paragraph>Oder ich hab wirklich mal einen Geistesblitz.</Paragraph>
            <Paragraph>Dann freue mich mich nach der Recherche noch mal drüber</Paragraph>
        </>
    );
}
/*
        <FontAwesomeIcon icon={faThumbsUp} />
      <Paragraph>
        Ich hab im Januar 2010 meine Ausbildung beendet und arbeite seitdem als
        Developer
      </Paragraph>
      <Paragraph>Das sind 16 Jahre</Paragraph>
      <Paragraph>
        Oder bei einer 40 Stundenwoche mit Urlaub, Wochenenden & Feiertagen
      </Paragraph>
      <Heading> 28.520 Stunden</Heading>

      <Heading>Hermeneutisches Wohlwollen</Heading>

      <Heading>Brötchen statt Kathedralen</Heading>

      <Heading>Demut</Heading>
      <Paragraph>
        Ich hab oft Ideen, die ich - im ersten Moment - für absolute brilliant
        und herrausragend halte.
      </Paragraph>
      <Paragraph>
        Manchmal - leider seltender als ich gerne wünschen würde - stimmt das
        sogar.
      </Paragraph>
      <Paragraph>Das Internet ist sehr groß</Paragraph>
      <Paragraph>
        Die Wahrscheinlichkeit, dass ich ein konkretes Problem besser verstanden
        haben und besser lösen kann, als alle anderen, ist nicht null.{" "}
      </Paragraph>
      <Paragraph>
        Leider ist diese Wahrscheinlichkeit auch nicht sehr hoch.
      </Paragraph>
      <Paragraph>
        Weil gerade meine brillianten Ideen dazu tendieren sich zu krasse
        Zeitfresser zu entwicklen, lohne es sich für mich immer,{" "}
      </Paragraph>
      <Paragraph> die eigene Brillianz einmal zu challengend.</Paragraph>
      <Paragraph>Dabei gewinne ich immer</Paragraph>
      <Paragraph>
        Entweder - meistens - finde ich sehr schnell raus, dass jemand was
        ähnliches schon in schöner hinbekommen hat.{" "}
      </Paragraph>
      <Paragraph>Und das spart mir krass viel zeit </Paragraph>
      <Paragraph>Oder ich hab wirklich mal einen Geistesblitz.</Paragraph>
      <Paragraph>
        Dann freue mich mich nach der Recherche noch mal drüber
      </Paragraph>
    </>
  );}
      */
