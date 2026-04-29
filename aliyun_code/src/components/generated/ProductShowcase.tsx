import { Link } from 'react-router-dom';
import { ScrollAnimation } from './ScrollAnimation';

const products = [
  {
    name: 'Ayon Audio Polaris III',
    category: '解码器',
    description: '旗舰级电子管解码器，极致音质表现',
    image: 'https://baas-api.wanwang.xin/toc/image/preview/ayon-polaris-dac-premium-audio.jpg?w=600&h=400&q=90',
  },
  {
    name: 'Benchmark DAC3',
    category: '数字播放器',
    description: '专业级 D/A 转换器，录音室标准',
    image: 'https://baas-api.wanwang.xin/toc/image/preview/benchmark-dac3-converter-studio.jpg?w=600&h=400&q=90',
  },
  {
    name: 'Ryan Speaker Petra',
    category: '扬声器',
    description: '高端书架式扬声器，精准音场还原',
    image: 'https://baas-api.wanwang.xin/toc/image/preview/ryan-petra-speakers-bookshelf.jpg?w=600&h=400&q=90',
  },
];

export function ProductShowcase() {
  return (
    <section className="py-32 bg-black">
      <div className="max-w-[1920px] mx-auto px-8">
        <ScrollAnimation>
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-xs font-light tracking-[0.3em] uppercase text-gray-500 mb-4">FEATURED PRODUCTS</p>
              <h2 className="text-4xl md:text-5xl font-extralight text-white">精选产品</h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-light tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors duration-300 hidden md:block"
            >
              查看全部 →
            </Link>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ScrollAnimation key={product.name} delay={index * 100}>
              <Link
                to={`/products`}
                className="group block glass-card hover-lift overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <p className="text-xs font-light tracking-[0.2em] uppercase text-gray-500 mb-3">
                    {product.category}
                  </p>
                  <h3 className="text-xl font-extralight text-white mb-3 tracking-[0.1em]">
                    {product.name}
                  </h3>
                  <p className="text-sm font-light text-gray-500 tracking-[0.05em]">
                    {product.description}
                  </p>
                  <div className="mt-6 flex items-center text-xs font-light tracking-[0.2em] uppercase text-gray-400 group-hover:text-white transition-colors duration-300">
                    <span>了解详情</span>
                    <svg
                      className="w-3 h-3 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
