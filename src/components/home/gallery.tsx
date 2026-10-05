import { GalleryHeader } from '@/components/home/gallery-header';
import { GalleryStrip } from '@/components/home/gallery-strip';
import { Section } from '@/components/layout';
import { Reveal } from '@/components/motion';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

export function Gallery() {
  const { isMobile } = useLayout();
  return (
    <Section bg={colors.sand} style={{ paddingVertical: isMobile ? 72 : 120, gap: isMobile ? 28 : 40 }}>
      <Reveal>
        <GalleryHeader />
      </Reveal>
      <Reveal variant="fade" delay={150}>
        <GalleryStrip />
      </Reveal>
    </Section>
  );
}
