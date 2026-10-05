import { GalleryHeader } from '@/components/home/gallery-header';
import { GalleryStrip } from '@/components/home/gallery-strip';
import { Image } from '@/components/image';
import { Section } from '@/components/layout';
import { Reveal } from '@/components/motion';
import { gallery } from '@/constants/content';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

/** Desktop: photos arranged on a slowly turning cylinder (CSS 3D, see global.css). */
function Cylinder() {
  const step = 360 / gallery.length;
  return (
    <div className="glz-cyl-stage">
      <div className="glz-cyl">
        {gallery.map((g, i) => (
          <div key={i} className="glz-cyl-face" style={{ transform: `rotateY(${i * step}deg) translateZ(500px)` }}>
            <Image source={g.img} alt={g.alt} contentFit="cover" style={{ width: 300, height: 450 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Gallery() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <Section
      bg={colors.sand}
      style={{
        paddingTop: isMobile ? 72 : 120,
        paddingBottom: isMobile ? 72 : isDesktop ? 80 : 120,
        gap: isMobile ? 28 : 32,
        minHeight: isDesktop ? 990 : undefined,
      }}>
      <Reveal>
        <GalleryHeader />
      </Reveal>
      <Reveal variant="fade" delay={150}>
        {isDesktop ? <Cylinder /> : <GalleryStrip />}
      </Reveal>
    </Section>
  );
}
