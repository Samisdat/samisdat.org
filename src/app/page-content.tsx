import { PanoramaWrapper } from "@/components/PanoramaWrapper";
import { Page } from "@/components/Page";
import { ScrollWatcher } from "@/components/ScrollWatcher";
import { Post } from "@/components/Post";
import { Container } from "@/components/Container";
import { Colophon } from "@/components/Colophon";
import { Navi } from "@/components/Navi";
import { Quote } from "@/components/Quote";

export default function PageContent() {
  return (
    <>
      <ScrollWatcher />
      <Page>
        <PanoramaWrapper />
        <Quote />
        <Container>
          <Navi />
          <Post />
          <Colophon />
        </Container>
      </Page>
    </>
  );
}
