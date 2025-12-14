import { Page } from "@/components/Page";
import { Container } from "@/components/Container";
import { Colophon } from "@/components/Colophon";
import { WtalPanorama } from "@samisdat/wtal-panorama";
import "@samisdat/wtal-panorama/style.css";
import { LongPost } from "@/components/LongPost";

export default function PageContent() {
  return (
    <Page>
      <WtalPanorama />
      <Container>
        <LongPost />
        <Colophon />
      </Container>
    </Page>
  );
}
