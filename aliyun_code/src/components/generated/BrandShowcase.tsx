import { Link } from 'react-router-dom';
import { ScrollAnimation } from './ScrollAnimation';

const brands = [
  {
    name: 'Ayon Audio',
    description: '波兰顶级电子管音响制造商',
  },
  {
    name: 'BAT',
    description: '美国 Balanced Audio Technology 高端音响',
  },
  {
    name: 'Benchmark',
    description: '美国专业音频设备领导品牌',
  },
  {
    name: 'Ryan',
    description: '高端扬声器系统专家',
  },
  {
    name: 'Lyravox',
    description: '德国高端音响系统品牌',
  },
  {
    name: 'MSB',
    description: '美国顶级数字音频转换器制造商',
  },
];

export function BrandShowcase() {
  return (
    <section className="py-32 bg-black">
      <div className="max-w-[1920px] mx-auto px-8">
        <ScrollAnimation>
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">GLOBAL BRANDS</p>
              <h2 className="text-4xl md:text-5xl font-extralight text-white">全球顶级品牌</h2>
            </div>
            <Link
              to="/brands"
              className="text-xs font-light tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors duration-300 hidden md:block"
            >
              查看全部 →
            </Link>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10">
          {brands.map((brand, index) => (
            <ScrollAnimation key={brand.name} delay={index * 50}>
              <Link
                to={`/brand/${brand.name.toLowerCase().replace(' ', '-')}`}
                className="block bg-black p-12 hover:bg-white/[0.02] transition-all duration-700 group"
              >
                <p className="text-sm font-light text-gray-400 group-hover:text-white transition-colors duration-500 tracking-[0.15em]">
                  {brand.name}
                </p>
                <p className="text-xs font-light text-gray-600 mt-2 tracking-[0.1em]">
                  {brand.description}
                </p>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
